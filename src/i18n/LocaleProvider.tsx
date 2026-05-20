/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Locale } from './types'
import type { Messages } from './types'
import { defaultLocale, messages } from './messages'
import { GEO_PAGE_CONTENT_DATE_ISO } from '../content/geoPageDate.generated'
import { SITE } from '../content/siteContent'

function upsertMeta(selector: string, attr: 'content' | 'href', value: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null
  if (!el) {
    if (attr === 'href') {
      const link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
      el = link
    } else {
      const nameMatch = selector.match(/meta\[(name|property)="([^"]+)"\]/)
      if (!nameMatch) return
      const meta = document.createElement('meta')
      meta.setAttribute(nameMatch[1], nameMatch[2])
      document.head.appendChild(meta)
      el = meta
    }
  }
  el.setAttribute(attr, value)
}

function getSiteUrl() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return SITE.siteUrl
}

/** Normalize path before locale detection (handles `/en/index.html`, trailing slashes). */
function localeFromPath(pathname: string): Locale {
  const trimmed = pathname.replace(/\/index\.html$/i, '').replace(/\/+$/, '') || '/'
  if (trimmed === '/en' || trimmed.startsWith('/en/')) return 'en'
  return 'zh'
}

/** Canonical public URL for the current locale landing (no query / hash). */
function canonicalLandingUrl(origin: string, pathname: string): string {
  return localeFromPath(pathname) === 'en' ? `${origin}/en/` : `${origin}/`
}

function updateJsonLdScript(id: string, payload: object) {
  const node = document.getElementById(id)
  if (!node) return
  node.textContent = JSON.stringify(payload)
}

function clearOgLocaleAlternates() {
  document.querySelectorAll('meta[property="og:locale:alternate"]').forEach((el) => {
    el.remove()
  })
}

function appendOgLocaleAlternate(content: string) {
  const meta = document.createElement('meta')
  meta.setAttribute('property', 'og:locale:alternate')
  meta.setAttribute('content', content)
  document.head.appendChild(meta)
}

function organizationSameAs(): string[] {
  const seed = [SITE.appUrl, SITE.githubUrl, SITE.orgGithubUrl]
  const merged = [...seed, ...SITE.officialSameAs]
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of merged) {
    const u = raw.trim()
    if (!u || seen.has(u)) continue
    seen.add(u)
    out.push(u)
  }
  return out
}

function readInitialLocale(): Locale {
  if (typeof window !== 'undefined') {
    return localeFromPath(window.location.pathname)
  }
  return defaultLocale
}

function homePathFor(locale: Locale): string {
  return locale === 'en' ? '/en/' : '/'
}

type LocaleContextValue = {
  locale: Locale
  setLocale: (next: Locale) => void
  homePath: string
  t: Messages
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readInitialLocale())

  useEffect(() => {
    const syncFromUrl = () => {
      setLocaleState(localeFromPath(window.location.pathname))
    }
    window.addEventListener('popstate', syncFromUrl)
    return () => window.removeEventListener('popstate', syncFromUrl)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    const pathFor = homePathFor(next)
    if (typeof window !== 'undefined') {
      const cur = localeFromPath(window.location.pathname)
      if (cur !== next) {
        window.history.pushState({}, '', pathFor)
      }
    }
    setLocaleState(next)
  }, [])

  const t = messages[locale]

  useEffect(() => {
    const siteUrl = getSiteUrl()
    const orgId = `${siteUrl}/#organization`
    const pathname =
      typeof window !== 'undefined' ? window.location.pathname : '/'
    const pageUrl =
      typeof window !== 'undefined'
        ? canonicalLandingUrl(window.location.origin, pathname)
        : `${SITE.siteUrl}/`
    const logoUrl = `${siteUrl}/logo.png`
    const softwareLanding =
      locale === 'en' ? `${siteUrl}/en/` : `${siteUrl}/`

    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
    document.title = t.meta.title
    upsertMeta('meta[name="description"]', 'content', t.meta.description)
    upsertMeta('meta[property="og:title"]', 'content', t.meta.title)
    upsertMeta('meta[property="og:description"]', 'content', t.meta.description)
    upsertMeta('meta[property="og:url"]', 'content', pageUrl)
    upsertMeta('meta[property="og:image"]', 'content', logoUrl)
    upsertMeta('meta[property="og:image:width"]', 'content', '512')
    upsertMeta('meta[property="og:image:height"]', 'content', '512')
    upsertMeta('meta[property="og:locale"]', 'content', locale === 'zh' ? 'zh_CN' : 'en_US')
    clearOgLocaleAlternates()
    appendOgLocaleAlternate(locale === 'zh' ? 'en_US' : 'zh_CN')
    upsertMeta('meta[name="twitter:title"]', 'content', t.meta.title)
    upsertMeta('meta[name="twitter:description"]', 'content', t.meta.description)
    upsertMeta('meta[name="twitter:image"]', 'content', logoUrl)
    upsertMeta('meta[property="og:image:alt"]', 'content', `${t.hero.headline} logo`)
    upsertMeta('meta[name="twitter:image:alt"]', 'content', `${t.hero.headline} logo`)
    upsertMeta('link[rel="canonical"]', 'href', pageUrl)
    upsertMeta(
      'meta[property="article:modified_time"]',
      'content',
      GEO_PAGE_CONTENT_DATE_ISO,
    )

    updateJsonLdScript('ld-org', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': orgId,
      name: t.hero.headline,
      url: `${siteUrl}/`,
      logo: logoUrl,
      description: t.meta.description,
      sameAs: organizationSameAs(),
    })

    updateJsonLdScript('ld-software', {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: t.hero.headline,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Windows, macOS, iOS, Android',
      url: softwareLanding,
      downloadUrl: SITE.downloadUrl,
      description: t.meta.description,
      inLanguage: locale === 'zh' ? 'zh-CN' : 'en',
      publisher: { '@id': orgId },
    })

    updateJsonLdScript('ld-website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: t.hero.headline,
      inLanguage: locale === 'zh' ? ['zh-CN', 'en'] : ['en', 'zh-CN'],
      publisher: { '@id': orgId },
    })

    updateJsonLdScript('ld-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      dateModified: GEO_PAGE_CONTENT_DATE_ISO,
      name: t.meta.title,
      description: t.meta.description,
      inLanguage: locale === 'zh' ? 'zh-CN' : 'en',
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': orgId },
      publisher: { '@id': orgId },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: logoUrl,
      },
    })

    updateJsonLdScript('ld-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      url: pageUrl,
      mainEntity: t.faqs.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    })

    updateJsonLdScript('ld-defined', {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      '@id': `${pageUrl}#infi-digital-avatar`,
      name: t.geoDefinition.title,
      description: t.geoDefinition.body,
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: t.hero.headline,
        url: pageUrl,
      },
    })
  }, [locale, t])

  const homePath = homePathFor(locale)

  const value = useMemo(
    () => ({ locale, setLocale, homePath, t }),
    [locale, setLocale, homePath, t],
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return ctx
}
