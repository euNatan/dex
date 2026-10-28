export function isMock() {
  return String(import.meta.env.VITE_USE_MOCK || 'false') === 'true'
}

export function ligaApi() {
  return String(import.meta.env.VITE_LIGA_API || 'http://localhost:8000/api').replace(/\/$/, '')
}

export function ligaOrigin() {
  return String(import.meta.env.VITE_LIGA_ORIGIN || 'http://localhost:8000').replace(/\/$/, '')
}

export function businessId() {
  return Number(import.meta.env.VITE_BUSINESS_ID || 1)
}

export function defaultOriginId() {
  return Number(import.meta.env.VITE_DEFAULT_ORIGIN_ID || 1)
}
