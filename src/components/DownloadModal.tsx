/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react'
import { SITE } from '../content/siteContent'
import { useLocale } from '../i18n/LocaleProvider'
import { fetchPublicDownloadVersions, pickDownloadVersion, type DownloadVersion } from '../lib/appVersionApi'
import { detectClientPlatform, type ClientOS, type ClientPlatform } from '../lib/clientPlatform'
import { formatBytes } from '../lib/releaseAssets'

type Props = { open: boolean; onClose: () => void; preferredOs?: ClientOS }

function envDescription(c: ClientPlatform, ui: ReturnType<typeof useLocale>['t']['ui']): string {
  if (c.os === 'windows' && c.arch === 'arm64') return ui.envWindowsArm64
  if (c.os === 'windows') return ui.envWindowsX64
  if (c.os === 'mac' && c.arch === 'arm64') return ui.envMacApple
  if (c.os === 'mac') return ui.envMacIntel
  if (c.os === 'ios') return ui.envIOS
  if (c.os === 'android') return ui.envAndroid
  if (c.os === 'linux') return ui.envLinux
  return ui.envUnknown
}

function replacePlaceholders(s: string, map: Record<string, string>): string {
  let out = s
  for (const [k, v] of Object.entries(map)) {
    out = out.replaceAll(`{${k}}`, v)
  }
  return out
}

function packageLine(item: DownloadVersion, locale: string) {
  return item.packageSize > 0 ? `${item.filename} · ${formatBytes(item.packageSize, locale)}` : item.filename
}

export function DownloadModal({ open, onClose, preferredOs }: Props) {
  const { t, locale } = useLocale()
  const ui = t.ui
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(false)
  const [versions, setVersions] = useState<DownloadVersion[]>([])

  const detected = useMemo(() => detectClientPlatform(), [])
  const client = useMemo(
    (): ClientPlatform =>
      preferredOs ? { os: preferredOs, arch: preferredOs === 'android' ? 'arm64' : detected.arch } : detected,
    [detected, preferredOs],
  )
  const isIosComingSoon = client.os === 'ios'

  const { primary, others } = useMemo(() => {
    if (!versions.length) return { primary: null, others: [] as DownloadVersion[] }
    return pickDownloadVersion(versions, client.os, client.arch)
  }, [versions, client])

  useEffect(() => {
    if (!open) return
    setErr(false)
    setLoading(true)
    setVersions([])

    if (isIosComingSoon) {
      setLoading(false)
      return
    }

    let cancelled = false
    fetchPublicDownloadVersions(SITE.chatApiUrl)
      .then((data) => {
        if (!cancelled) setVersions(data)
      })
      .catch(() => {
        if (!cancelled) setErr(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [open, isIosComingSoon])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const dateLoc = locale === 'zh' ? 'zh-CN' : 'en-US'
  const published =
    primary?.publishedAt &&
    new Date(primary.publishedAt).toLocaleDateString(dateLoc, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })

  const title = replacePlaceholders(ui.downloadModalTitle, { name: t.hero.headline })
  const detectedLine = replacePlaceholders(ui.downloadDetected, {
    env: envDescription(client, ui),
  })
  const releasedLine = published && replacePlaceholders(ui.downloadReleased, { date: published })

  const showSmartScreen = client.os === 'windows' && primary != null && /\.exe$/i.test(primary.filename)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label={ui.downloadClose}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ec-download-title"
        className="relative z-[101] w-full max-w-lg rounded-2xl border border-white/12 bg-[#0c0c10] p-6 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)] sm:p-7"
      >
        <button
          type="button"
          className="absolute right-4 top-4 rounded-lg px-2 py-1 text-lg leading-none text-zinc-500 transition hover:bg-white/10 hover:text-zinc-200"
          onClick={onClose}
          aria-label={ui.downloadClose}
        >
          ×
        </button>

        <h2 id="ec-download-title" className="pr-10 text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
          {title}
          {primary?.versionName ? (
            <span className="ml-2 inline-flex align-middle rounded-full border border-blue-500/40 bg-blue-500/15 px-2 py-0.5 text-xs font-semibold text-blue-300">
              {primary.versionName}
            </span>
          ) : null}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">{ui.downloadModalSub}</p>

        {releasedLine ? <p className="mt-2 text-sm text-zinc-500">{releasedLine}</p> : null}

        <p className="mt-4 flex gap-2 text-sm text-zinc-400">
          <span className="shrink-0 text-blue-300" aria-hidden>
            ℹ
          </span>
          <span>{detectedLine}</span>
        </p>

        <div className="mt-6">
          {isIosComingSoon ? (
            <div className="rounded-2xl border border-amber-300/25 bg-amber-300/[0.08] p-5 text-center">
              <p className="text-lg font-semibold text-amber-100">{ui.mobileComingSoonTitle}</p>
              <p className="mt-2 text-sm leading-relaxed text-amber-100/70">{ui.mobileComingSoonBody}</p>
              <a
                href={SITE.appUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#07111f] transition hover:bg-cyan-100"
              >
                {ui.directExperience}
              </a>
            </div>
          ) : loading ? (
            <p className="text-center text-sm text-zinc-500">{ui.downloadLoading}</p>
          ) : err ? (
            <p className="text-center text-sm text-zinc-400">{ui.downloadFetchError}</p>
          ) : primary == null ? (
            <p className="text-center text-sm text-zinc-400">{ui.downloadNoInstallers}</p>
          ) : (
            <>
              <a
                href={primary.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-4 transition hover:border-blue-500/40 hover:bg-white/[0.07]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/10 bg-black/40 text-blue-300">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v11"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block font-semibold text-zinc-100">{envDescription(client, ui)}</span>
                  <span className="mt-0.5 block truncate text-xs text-zinc-500">{packageLine(primary, dateLoc)}</span>
                </span>
                <span className="shrink-0 rounded-lg bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] px-4 py-2 text-sm font-semibold text-white">
                  {ui.download}
                </span>
              </a>
              {showSmartScreen ? (
                <p className="mt-3 text-xs leading-relaxed text-zinc-600">{ui.downloadSmartScreenHint}</p>
              ) : null}
            </>
          )}
        </div>

        {!loading && !err && others.length > 0 ? (
          <details className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
            <summary className="cursor-pointer text-sm font-medium text-zinc-300">{ui.downloadOtherPlatforms}</summary>
            <ul className="mt-3 space-y-2 border-t border-white/[0.06] pt-3">
              {others.map((a) => (
                <li key={a.id}>
                  <a
                    className="flex items-center justify-between gap-3 text-sm text-zinc-400 transition-colors hover:text-blue-300"
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="min-w-0 truncate font-medium">
                      {a.title} {a.versionName}
                    </span>
                    <span className="shrink-0 text-xs text-zinc-500">
                      {a.packageSize > 0 ? formatBytes(a.packageSize, dateLoc) : a.arch}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </details>
        ) : null}

        <p className="mt-6 text-center">
          <a
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 underline-offset-4 transition-colors hover:text-blue-300 hover:underline"
            href={SITE.downloadUrl}
          >
            {ui.downloadViewReleases}
          </a>
        </p>
      </div>
    </div>
  )
}
