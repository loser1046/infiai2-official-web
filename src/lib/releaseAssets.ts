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
