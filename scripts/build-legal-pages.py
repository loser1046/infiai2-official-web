#!/usr/bin/env python3
"""Build terms/privacy HTML from bilingual docx on Desktop."""

from __future__ import annotations

import html
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

DESKTOP = Path('/Users/gong/Desktop')
ROOT = Path(__file__).resolve().parents[1]

TAG_P = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'
TAG_T = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'


def extract_docx(path: Path) -> list[str]:
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read('word/document.xml'))
    paras: list[str] = []
    for p in root.iter(TAG_P):
        parts: list[str] = []
        for t in p.iter(TAG_T):
            if t.text:
                parts.append(t.text)
            if t.tail:
                parts.append(t.tail)
        line = ''.join(parts).strip()
        if line:
            paras.append(line)
    return paras


def lang_of(text: str) -> str:
    cjk = len(re.findall(r'[\u4e00-\u9fff]', text))
    latin = len(re.findall(r'[A-Za-z]', text))
    if cjk >= 3 and cjk >= latin:
        return 'zh'
    if latin >= 10 and latin > cjk * 2:
        return 'en'
    if cjk > 0 and latin > 0:
        return 'zh' if cjk >= latin else 'en'
    return 'zh' if cjk > 0 else 'en'


def pair_paragraphs(paras: list[str]) -> list[tuple[str, str]]:
    pairs: list[tuple[str, str]] = []
    i = 0
    while i < len(paras):
        para = paras[i]
        if lang_of(para) == 'zh':
            zh = para
            en = ''
            j = i + 1
            if j < len(paras) and lang_of(paras[j]) == 'en':
                en = paras[j]
                j += 1
            pairs.append((zh, en))
            i = j
        else:
            pairs.append(('', para))
            i += 1
    return pairs


def is_h3(zh: str) -> bool:
    return bool(re.match(r'^\d+\.\d+\s', zh))


def is_effective_zh(zh: str) -> bool:
    return zh.startswith('生效日期')


def is_h2_zh(zh: str) -> bool:
    if is_h3(zh) or is_effective_zh(zh):
        return False
    if '。' in zh or zh.endswith('；') or zh.endswith('：'):
        return False
    if re.match(r'^[一二三四五六七八九十]+、', zh):
        return True
    if re.match(r'^\d+[\.、]', zh):
        return False
    return len(zh) <= 22


def is_list_zh(zh: str) -> bool:
    return zh.endswith('；') and len(zh) < 120


def classify_zh(zh: str, *, is_first: bool) -> str:
    if is_first:
        return 'title'
    if is_effective_zh(zh):
        return 'effective'
    if is_h3(zh):
        return 'h3'
    if is_h2_zh(zh):
        return 'h2'
    if is_list_zh(zh):
        return 'list'
    return 'p'


def build_body(pairs: list[tuple[str, str]], lang: str, *, en_title: str) -> str:
    chunks: list[str] = []
    i = 0
    while i < len(pairs):
        zh, en = pairs[i]
        text = zh if lang == 'zh' else (en or zh)
        if not text:
            i += 1
            continue

        kind = classify_zh(zh, is_first=(i == 0)) if zh else 'p'

        if kind == 'title':
            title = zh if lang == 'zh' else en_title
            chunks.append(f'<h1>{html.escape(title)}</h1>')
            i += 1
            continue

        if kind == 'effective':
            chunks.append(f'<p class="lx-legal-updated">{html.escape(text)}</p>')
            i += 1
            continue

        if kind == 'h3':
            chunks.append(f'<h3>{html.escape(text)}</h3>')
            i += 1
            continue

        if kind == 'h2':
            chunks.append(f'<h2>{html.escape(text)}</h2>')
            i += 1
            continue

        if kind == 'list':
            items: list[str] = []
            while i < len(pairs):
                z, e = pairs[i]
                if not z or classify_zh(z, is_first=False) != 'list':
                    break
                line = z if lang == 'zh' else (e or z)
                items.append(f'<li>{html.escape(line)}</li>')
                i += 1
            chunks.append('<ul>' + ''.join(items) + '</ul>')
            continue

        chunks.append(f'<p>{html.escape(text)}</p>')
        i += 1

    return '\n      '.join(chunks)


def page_html(
    *,
    lang_attr: str,
    title: str,
    description: str,
    canonical: str,
    hreflang_zh: str,
    hreflang_en: str,
    back_href: str,
    back_label: str,
    footer_links: list[tuple[str, str]],
    body_inner: str,
) -> str:
    footer = ' · '.join(f'<a href="{h}">{html.escape(l)}</a>' for h, l in footer_links)
    return f'''<!doctype html>
<html lang="{lang_attr}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="{html.escape(description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="{canonical}" />
    <link rel="alternate" hreflang="zh-CN" href="{hreflang_zh}" />
    <link rel="alternate" hreflang="en" href="{hreflang_en}" />
    <title>{html.escape(title)}</title>
    <link rel="stylesheet" href="/legal-doc.css" />
  </head>
  <body>
    <main class="lx-legal-wrap">
      <a class="lx-legal-back" href="{back_href}">{html.escape(back_label)}</a>
      {body_inner}
      <footer class="lx-legal-footer">
        {footer}
      </footer>
    </main>
  </body>
</html>
'''


CONFIGS = [
    {
        'doc': '服务条款.docx',
        'en_title': 'Terms of Service',
        'paths': {'zh': 'public/terms/index.html', 'en': 'public/en/terms/index.html'},
        'meta': {
            'zh': {
                'title': '服务条款 — 灵谐',
                'description': '灵谐平台服务条款：使用灵谐产品与服务的规则与约定。',
                'canonical': 'https://lingxie.net/terms/',
                'back': ('/', '← 返回首页'),
                'footer': [('/privacy/', '隐私政策'), ('/en/terms/', 'English')],
            },
            'en': {
                'title': 'Terms of Service — Lingxie',
                'description': 'Lingxie Terms of Service: rules and agreements for using Lingxie products and services.',
                'canonical': 'https://lingxie.net/en/terms/',
                'back': ('/en/', '← Back to home'),
                'footer': [('/en/privacy/', 'Privacy Policy'), ('/terms/', '中文')],
            },
        },
    },
    {
        'doc': '隐私政策.docx',
        'en_title': 'Privacy Policy',
        'paths': {'zh': 'public/privacy/index.html', 'en': 'public/en/privacy/index.html'},
        'meta': {
            'zh': {
                'title': '隐私政策 — 灵谐',
                'description': '灵谐隐私政策：我们如何收集、使用与保护您的个人信息。',
                'canonical': 'https://lingxie.net/privacy/',
                'back': ('/', '← 返回首页'),
                'footer': [('/terms/', '服务条款'), ('/en/privacy/', 'English')],
            },
            'en': {
                'title': 'Privacy Policy — Lingxie',
                'description': 'Lingxie Privacy Policy: how we collect, use, and protect your personal information.',
                'canonical': 'https://lingxie.net/en/privacy/',
                'back': ('/en/', '← Back to home'),
                'footer': [('/en/terms/', 'Terms of Service'), ('/privacy/', '中文')],
            },
        },
    },
]


def main() -> int:
    docx_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else DESKTOP
    for cfg in CONFIGS:
        pairs = pair_paragraphs(extract_docx(docx_dir / cfg['doc']))
        for loc in ('zh', 'en'):
            m = cfg['meta'][loc]
            body = build_body(pairs, loc, en_title=cfg['en_title'])
            page = page_html(
                lang_attr='zh-CN' if loc == 'zh' else 'en',
                title=m['title'],
                description=m['description'],
                canonical=m['canonical'],
                hreflang_zh=cfg['meta']['zh']['canonical'],
                hreflang_en=cfg['meta']['en']['canonical'],
                back_href=m['back'][0],
                back_label=m['back'][1],
                footer_links=m['footer'],
                body_inner=body,
            )
            out = ROOT / cfg['paths'][loc]
            out.write_text(page, encoding='utf-8')
            print(f'wrote {out} ({len(page)} bytes)')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
