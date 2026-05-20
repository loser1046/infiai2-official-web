export type ClientOS = 'windows' | 'mac' | 'ios' | 'android' | 'linux' | 'unknown'
export type ClientArch = 'x64' | 'arm64' | 'unknown'

export type ClientPlatform = { os: ClientOS; arch: ClientArch }

export function detectClientPlatform(): ClientPlatform {
  const ua = navigator.userAgent
  const uaL = ua.toLowerCase()

  let os: ClientOS = 'unknown'
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) {
    os = 'ios'
  } else if (/android/i.test(ua)) os = 'android'
  else if (/windows/i.test(ua)) os = 'windows'
  else if (/mac os x|macintosh/i.test(ua) && !/like mac/i.test(ua)) os = 'mac'
  else if (/linux|x11/i.test(ua) && !/android/i.test(ua)) os = 'linux'

  let arch: ClientArch = 'unknown'
  if (/arm64|aarch64/i.test(uaL)) arch = 'arm64'
  else if (/x86_64|win64|\bx64\b|amd64|wow64/i.test(uaL)) arch = 'x64'

  const nav = navigator as Navigator & { userAgentData?: { platform: string } }
  const uad = nav.userAgentData
  if (uad?.platform) {
    const p = uad.platform.toLowerCase()
    if (p.includes('ios')) os = 'ios'
    else if (p.includes('android')) os = 'android'
    else if (p.includes('win')) os = 'windows'
    else if (p.includes('mac')) os = 'mac'
    else if (p.includes('linux')) os = 'linux'
  }

  return { os, arch }
}
