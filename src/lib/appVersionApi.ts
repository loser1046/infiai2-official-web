import type { ClientOS } from './clientPlatform'

export type AppVersionPlatform = 'windows' | 'macos' | 'android'
export type AppVersionArch = 'all' | 'x64' | 'arm64' | 'ia32'

export type AppVersionRecord = {
  id?: string
  platform: AppVersionPlatform
  channel: string
  arch: AppVersionArch
  versionName: string
  buildNumber: number
  status: string
  rolloutPercent: number
  storeUrl?: string
  downloadUrl?: string
  packageSize?: number
  checksum?: string
  publishedAt?: number
}

export type DownloadVersion = {
  id: string
  os: Exclude<ClientOS, 'ios' | 'linux' | 'unknown'>
  title: string
  versionName: string
  buildNumber: number
  arch: AppVersionArch
  url: string
  filename: string
  packageSize: number
  publishedAt: number
  checksum?: string
}

type ApiResponse<T> = {
  errCode: number
  errMsg?: string
  data?: T
}

type PageVersionsData = {
  versions?: AppVersionRecord[]
}

const platformTitles: Record<DownloadVersion['os'], string> = {
  windows: 'Windows',
  mac: 'macOS',
  android: 'Android',
}

function operationID() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function toDownloadOS(platform: string): DownloadVersion['os'] | null {
  if (platform === 'macos') return 'mac'
  if (platform === 'windows' || platform === 'android') return platform
  return null
}

function filenameFromURL(rawURL: string) {
  try {
    const url = new URL(rawURL)
    const name = decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() || '')
    return name || rawURL
  } catch {
    return rawURL.split('/').filter(Boolean).pop() || rawURL
  }
}

function toDownloadVersion(record: AppVersionRecord): DownloadVersion | null {
  const os = toDownloadOS(record.platform)
  const url = (record.downloadUrl || record.storeUrl || '').trim()
  if (!os || !url) return null
  return {
    id: record.id || `${record.platform}-${record.arch}-${record.buildNumber}`,
    os,
    title: platformTitles[os],
    versionName: record.versionName,
    buildNumber: Number(record.buildNumber || 0),
    arch: record.arch || 'all',
    url,
    filename: filenameFromURL(url),
    packageSize: Number(record.packageSize || 0),
    publishedAt: Number(record.publishedAt || 0),
    checksum: record.checksum,
  }
}

function publicRelease(record: AppVersionRecord) {
  return (
    record.status === 'published' &&
    record.channel === 'prod' &&
    Number(record.rolloutPercent || 0) >= 100 &&
    Boolean((record.downloadUrl || record.storeUrl || '').trim())
  )
}

export async function fetchPublicDownloadVersions(baseURL: string): Promise<DownloadVersion[]> {
  const res = await fetch(`${baseURL.replace(/\/$/, '')}/application/page_versions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      operationID: operationID(),
    },
    body: JSON.stringify({
      platform: ['windows', 'macos', 'android'],
      channel: 'prod',
      status: 'published',
      pagination: {
        pageNumber: 1,
        showNumber: 100,
      },
    }),
  })
  if (!res.ok) throw new Error(`Version API: ${String(res.status)}`)
  const payload = (await res.json()) as ApiResponse<PageVersionsData>
  if (payload.errCode !== 0) throw new Error(payload.errMsg || `Version API: ${payload.errCode}`)
  return (payload.data?.versions || [])
    .filter(publicRelease)
    .map(toDownloadVersion)
    .filter((item): item is DownloadVersion => item != null)
    .sort((a, b) => b.buildNumber - a.buildNumber)
}

export function pickDownloadVersion(
  versions: DownloadVersion[],
  os: ClientOS,
  arch: string,
): { primary: DownloadVersion | null; others: DownloadVersion[] } {
  if (os === 'ios') return { primary: null, others: versions }
  const supportedOS = os === 'windows' || os === 'mac' || os === 'android' ? os : null
  const matchingOS = supportedOS ? versions.filter((item) => item.os === supportedOS) : []
  const primary =
    matchingOS.find((item) => item.arch === arch) ||
    matchingOS.find((item) => item.arch === 'all') ||
    matchingOS[0] ||
    null
  const others = versions.filter((item) => item.id !== primary?.id)
  return { primary, others }
}
