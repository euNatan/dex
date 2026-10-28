export function brPrice(price) {
  const value = Number(price)
  if (!value) return 'N/D'
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function brDate(iso) {
  if (!iso) return 'n/d'
  const [year, month, day] = String(iso).split('-')
  if (!day) return iso
  return `${day}/${month}/${year}`
}

export function compactNumber(value) {
  return Number(value || 0).toLocaleString('pt-BR')
}

export function brPercent(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return 'n/d'
  const formatted = Math.abs(amount).toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  if (amount > 0) return `+${formatted}%`
  if (amount < 0) return `-${formatted}%`
  return `${formatted}%`
}
