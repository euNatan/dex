import {
  CONDITIONS,
  PRODUCTS,
  SEED_INVENTORY,
  SETS,
  getCondition,
  getSet,
  hydrateProduct,
} from '../data/catalog'
import { isMock } from '../lib/env'
import { apiRepo } from './apiRepo'

const STORAGE_KEY = 'bra-dex-inventory-v1'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function nextId(items) {
  return items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
}

function round2(value) {
  return Math.round(value * 100) / 100
}

export const mockRepo = {
  getConditions() {
    return clone(CONDITIONS)
  },

  getCatalog() {
    return PRODUCTS.map(hydrateProduct)
  },

  getSets() {
    return clone(SETS)
  },

  getCollections(query = '') {
    const term = String(query || '').trim().toLowerCase()
    return clone(SETS)
      .filter((set) => {
        if (!term) return true
        return [set.name, set.code, set.series].some((value) => String(value).toLowerCase().includes(term))
      })
      .map((set) => ({
        ...set,
        set_id: set.id,
        uniqueOwned: 0,
        collection_price: 0,
      }))
  },

  getSetCards(categoryId) {
    const set = getSet(Number(categoryId))
    const cards = PRODUCTS.filter((product) => product.set_id === Number(categoryId)).map((product) => ({
      ...hydrateProduct(product),
      product_type: 'card',
      market_price: Number(product.prices?.[1] || 0),
    }))

    return {
      category: set
        ? {
            ...set,
            set_id: set.id,
            uniqueOwned: 0,
            collection_price: 0,
          }
        : null,
      cards,
    }
  },

  getPriceStats(productId, filter = '1m') {
    const product = PRODUCTS.find((row) => row.id === Number(productId))
    const base = Number(product?.prices?.[1] || 10)
    const points = filter === '1s' ? 7 : filter === '3m' ? 7 : 8
    const labels = Array.from({ length: points }, (_, index) => {
      if (filter === '1s') return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][index]
      return `${String(index + 1).padStart(2, '0')}`
    })

    let seed = Number(productId) % 97
    let price = base * 0.92
    const data = labels.map(() => {
      seed = (seed * 9301 + 49297) % 233280
      const noise = seed / 233280
      price = Math.max(1, round2(price * (0.96 + noise * 0.09)))
      return price
    })
    data[data.length - 1] = round2(base)

    const first = data[0] || 0
    const last = data[data.length - 1] || 0
    const difference = round2(last - first)
    const appreciation = first ? Number((((last - first) / first) * 100).toFixed(2)) : 0

    return {
      labels,
      datasets: [{ label: 'Preço', data }],
      appreciation,
      difference,
      total_order: 9 + (Number(productId) % 12),
      media_per_order: last,
    }
  },

  searchProducts(query) {
    const term = String(query || '').trim().toLowerCase()
    if (term.length < 2) return []

    return PRODUCTS.filter((product) => {
      const set = getSet(product.set_id)
      return [product.name, product.code, product.card_number, set?.name, set?.code]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    }).map(hydrateProduct)
  },

  loadInventory() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seed = clone(SEED_INVENTORY)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
      return seed
    }

    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : clone(SEED_INVENTORY)
    } catch {
      return clone(SEED_INVENTORY)
    }
  },

  saveInventory(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    return items
  },

  addToCollection({ product_id, condition_id, quantity }) {
    const items = this.loadInventory()
    const qty = Math.max(1, Number(quantity) || 1)
    const existing = items.find(
      (item) => item.product_id === product_id && item.condition_id === condition_id,
    )

    if (existing) {
      existing.quantity = qty
    } else {
      items.push({
        id: nextId(items),
        product_id,
        condition_id,
        quantity: qty,
      })
    }

    return this.saveInventory(items)
  },

  updateQuantity(id, quantity) {
    const items = this.loadInventory()
    const item = items.find((entry) => entry.id === Number(id))
    if (!item) return items

    const qty = Number(quantity)
    if (qty <= 0) {
      return this.remove(id)
    }

    item.quantity = qty
    return this.saveInventory(items)
  },

  remove(id) {
    const items = this.loadInventory().filter((item) => item.id !== Number(id))
    return this.saveInventory(items)
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY)
    return this.loadInventory()
  },

  buildEntry(item) {
    const product = PRODUCTS.find((row) => row.id === item.product_id)
    if (!product) return null

    const condition = getCondition(item.condition_id)
    const marketPrice = Number(product.prices?.[item.condition_id] || 0)

    return {
      id: item.id,
      quantity: item.quantity,
      product_id: product.id,
      condition_id: item.condition_id,
      market_price: marketPrice,
      product: hydrateProduct(product),
      condition,
    }
  },

  getEntry(id) {
    const item = this.loadInventory().find((entry) => entry.id === Number(id))
    return item ? this.buildEntry(item) : null
  },

  buildGrouped(vision = 'collection') {
    const data = {}
    const inventory = this.loadInventory()

    inventory.forEach((item, idx) => {
      const entry = this.buildEntry(item)
      if (!entry) return

      const set = getSet(entry.product.set_id)
      const collectionName = vision === 'cards' ? 'Minhas Cartas' : (set?.name || 'S/C')

      if (!data[collectionName]) {
        data[collectionName] = {
          image: set?.code || '',
          accent: set?.accent || '#155ba3',
          code: set?.code || '',
          series: set?.series || '',
          total_in_collection: set?.total_in_collection || 0,
          release_date: set?.release_date || '',
          set_id: set?.id || 0,
          collection_price: 0,
          precified: 0,
          registred: 0,
          cards: {},
        }
      }

      data[collectionName].cards[idx] = entry
      data[collectionName].collection_price = round2(
        data[collectionName].collection_price + entry.market_price * entry.quantity,
      )
      data[collectionName].registred += entry.quantity
      if (entry.market_price > 0) {
        data[collectionName].precified += entry.quantity
      }
    })

    return data
  },
}

export const repo = isMock() ? mockRepo : apiRepo
