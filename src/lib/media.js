import { ligaOrigin } from './env'

export function resolveMediaUrl(path) {
  if (!path) return ''
  const value = String(path)
  if (/^https?:\/\//i.test(value)) return value

  const origin = ligaOrigin()
  if (value.startsWith('/')) return origin + value
  return `${origin}/storage/${value}`
}

export function productImage(product) {
  const images = product?.product_image || product?.productImage || []
  const first = Array.isArray(images) ? images[0] : null
  return resolveMediaUrl(first?.image || product?.image || '')
}

export function ligaProductUrl(product) {
  if (!product?.id) return ligaOrigin()
  const type = product.product_type || 'card'
  return `${ligaOrigin()}/product/${product.id}/${type}`
}

export function slugify(name) {
  const slug = String(name || 'sc')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'sc'
}
