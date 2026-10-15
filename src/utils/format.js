/**
 * format.js — utilitários de formatação de dados para exibição.
 */

/**
 * formatCount — formata um número grande de forma compacta.
 * Ex.: 1200 → "1,2K", 1000000 → "1M"
 */
export function formatCount(n) {
  if (!n && n !== 0) return '0'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M'
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace('.0', '') + 'K'
  return String(n)
}

/**
 * formatDate — formata uma data ISO para exibição amigável.
 * Ex.: "2026-10-15T03:14:31.000Z" → "15/10/2026"
 */
export function formatDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleDateString('pt-BR')
}

/**
 * timeAgo — retorna tempo relativo.
 * Ex.: "há 2 horas", "há 3 dias"
 */
export function timeAgo(isoString) {
  if (!isoString) return ''
  const diff = Date.now() - new Date(isoString).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins  < 1)  return 'agora mesmo'
  if (mins  < 60) return `há ${mins} min`
  if (hours < 24) return `há ${hours}h`
  if (days  < 30) return `há ${days} dia${days > 1 ? 's' : ''}`
  return formatDate(isoString)
}
