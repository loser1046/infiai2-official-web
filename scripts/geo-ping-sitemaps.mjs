/**
 * GEO：上线后尝试通知 Bing 抓取 sitemap（需联网）。
 *
 * - `www.bing.com/ping?sitemap=` 已返回 410（废弃）。
 * - 优先尝试 Webmaster `ping.aspx`（行为随 Bing 策略变化，失败不阻断构建）。
 *
 * 用法：
 *   GEO_SITE_ORIGIN=https://lingxie.net npm run geo:ping
 */

const origin = (process.env.GEO_SITE_ORIGIN ?? 'https://lingxie.net').replace(/\/$/, '')
const sitemapUrl = `${origin}/sitemap.xml`

if (process.env.GEO_VERIFY_SITEMAP !== '0') {
  try {
    const res = await fetch(sitemapUrl, {
      redirect: 'follow',
      headers: { 'user-agent': 'lingxie-site-ping/1.0' },
    })
    if (!res.ok) {
      console.warn(`[geo-ping] sitemap GET ${res.status} (expected 2xx): ${sitemapUrl}`)
    } else {
      console.log(`[geo-ping] sitemap ok: ${sitemapUrl}`)
    }
  } catch (err) {
    console.warn('[geo-ping] sitemap verify failed:', err)
  }
}

const endpoints = [
  `https://www.bing.com/webmaster/ping.aspx?sitemap=${encodeURIComponent(sitemapUrl)}`,
  `https://ssl.bing.com/webmaster/ping.aspx?sitemap=${encodeURIComponent(sitemapUrl)}`,
]

let ok = false

for (const pingUrl of endpoints) {
  try {
    const res = await fetch(pingUrl, { redirect: 'manual' })
    console.log(`[geo-ping] ${pingUrl}`)
    console.log(`[geo-ping] HTTP ${res.status}`)
    if (res.ok || res.status === 301 || res.status === 302) {
      ok = true
      break
    }
  } catch (err) {
    console.warn('[geo-ping] request failed:', err)
  }
}

if (!ok) {
  console.warn(
    '[geo-ping] Bing ping endpoints did not return success (non-fatal). Submit sitemap in Bing Webmaster Tools if needed.',
  )
}
