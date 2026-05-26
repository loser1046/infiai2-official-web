import type { ClientPlatform } from './clientPlatform'

export type ReleaseAsset = {
  name: string
  browser_download_url: string
  size: number
}

function isDownloadableAsset(name: string): boolean {
  const lower = name.toLowerCase()
  if (lower.endsWith('.sha256') || lower.endsWith('.asc') || lower.endsWith('.sig')) return false
  if (lower.endsWith('.blockmap') || lower === 'latest-mac.yml' || lower === 'latest.yml')
    return false
  if (/\.(exe|dmg|pkg|msi|appimage|deb|rpm|apk|aab)$/i.test(name)) return true
  if (/win|windows|darwin|mac|linux|ubuntu|android/i.test(name)) return true
  return false
}

function scoreAsset(name: string, c: ClientPlatform): number {
  const lower = name.toLowerCase()
  if (c.os === 'ios') return 0
  if (c.os === 'unknown') return isDownloadableAsset(name) ? 10 : 0

  if (c.os === 'windows') {
    if (!/\.(exe|msi)$/i.test(name) && !/win|windows/i.test(lower)) return 0
    let s = 100
    const hasArm = /arm64|aarch64|arm\b/i.test(lower)
    const hasX64 = /x64|x86_64|amd64|win64/i.test(lower) || /\.exe$/i.test(name)
    if (c.arch === 'arm64') {
      if (hasArm) s += 50
      if (hasX64 && !hasArm) s -= 35
    } else if (c.arch === 'x64') {
      if (hasX64 || /\.exe$/i.test(name)) s += 50
      if (hasArm && !hasX64) s -= 35
    } else {
      s += 25
    }
    return s
  }

  if (c.os === 'mac') {
    if (!/\.(dmg|pkg)$/i.test(name) && !/darwin|mac|osx/i.test(lower)) return 0
    let s = 100
    const hasArm = /arm64|aarch64|apple|silicon/i.test(lower)
    const hasIntel = /x64|intel|amd64/i.test(lower)
    if (c.arch === 'arm64') {
      if (hasArm) s += 50
      if (hasIntel && !hasArm) s -= 35
    } else if (c.arch === 'x64') {
      if (hasIntel || hasArm) s += 40
      if (/universal/i.test(lower)) s += 45
    } else {
      s += 25
    }
    return s
  }

  if (c.os === 'linux') {
    if (!/\.(appimage|deb|rpm)$/i.test(name) && !/linux|ubuntu/i.test(lower)) return 0
    let s = 100
    if (c.arch === 'arm64' && /arm64|aarch64/i.test(lower)) s += 50
    else if (c.arch === 'x64' && /x64|amd64|x86_64/i.test(lower)) s += 50
    else if (c.arch === 'unknown') s += 25
    return s
  }

  if (c.os === 'android') {
    if (!/\.(apk|aab)$/i.test(name) && !/android/i.test(lower)) return 0
    let s = 100
    if (/arm64|aarch64|v8a/i.test(lower)) s += 40
    if (/universal/i.test(lower)) s += 35
    return s
  }

  return 0
}

export function pickRecommendedAssets(
  assets: ReleaseAsset[],
  client: ClientPlatform,
): { primary: ReleaseAsset | null; others: ReleaseAsset[] } {
  const filtered = assets.filter((a) => isDownloadableAsset(a.name))
  if (client.os === 'ios') return { primary: null, others: filtered }
  if (filtered.length === 0) return { primary: null, others: [] }

  const ranked = [...filtered].sort((a, b) => scoreAsset(b.name, client) - scoreAsset(a.name, client))
  const primary = ranked[0]
  const others = ranked.slice(1)
  return { primary, others }
}

export function formatBytes(bytes: number, locale: string): string {
  if (bytes === 0) return '0 B'
  const u = ['B', 'KB', 'MB', 'GB'] as const
  let i = 0
  let n = bytes
  while (n >= 1024 && i < u.length - 1) {
    n /= 1024
    i += 1
  }
  const digits = i === 0 ? 0 : n >= 10 ? 0 : 1
  return `${n.toLocaleString(locale, { maximumFractionDigits: digits, minimumFractionDigits: digits })} ${u[i]}`
}
