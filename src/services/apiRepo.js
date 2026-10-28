import { businessId, defaultOriginId } from '../lib/env'
import { adaptCategory, adaptGrouped, adaptSetCard, uniqueProducts } from './adapter'
import http from './http'

export const apiRepo = {
  async getConditions() {
    const { data } = await http.get('/v1/get-conditions/card')
    return Array.isArray(data) ? data : []
  },

  async searchProducts(query) {
    const term = String(query || '').trim()
    if (term.length < 2) return []

    const { data } = await http.post(`/v1/${businessId()}/products/paginate`, {
      name: term,
      product_type: 'card',
      per_page: 20,
      current_page: 1,
      order_by: 'relevance',
    })

    return uniqueProducts(data?.product_stores || data?.products || [])
  },

  async buildGrouped() {
    const { data } = await http.get('/v1/userCollections', {
      params: { vision: 'collection' },
    })
    return adaptGrouped(data)
  },

  async addToCollection({ product_id, condition_id, quantity, origin_id, api_id, storage_card, category_id }) {
    const { data } = await http.post('/v1/dex/register-card', {
      product_id: product_id || undefined,
      api_id: api_id || undefined,
      storage_card: storage_card || undefined,
      category_id: category_id || undefined,
      condition_id,
      quantity,
      origin_id: origin_id || defaultOriginId(),
    })

    if (data?.error) {
      throw new Error(data.message || 'Não foi possível registrar a carta')
    }

    return data
  },

  async updateQuantity(entry, quantity) {
    if (quantity <= 0) {
      return this.remove(entry.id)
    }

    return this.addToCollection({
      product_id: entry.product_id,
      condition_id: entry.condition_id,
      origin_id: entry.origin_id || defaultOriginId(),
      quantity,
    })
  },

  async remove(id) {
    await http.delete(`/v1/userCollections/${id}`)
  },

  async logout() {
    try {
      await http.post('/v1/auth/logout', {}, { skipAuthRetry: true })
    } catch {
      // logout local mesmo se o gateway falhar
    }
  },

  async getCollections(query = '') {
    const { data } = await http.post('/v1/paginate-categories', {
      id: 1,
      per_page: 48,
      current_page: 1,
      name: String(query || '').trim() || undefined,
    })

    return (data?.products || []).map(adaptCategory).filter(Boolean)
  },

  async getSetCards(categoryId) {
    const { data } = await http.get('/v1/dex/set-cards', {
      params: {
        category_id: categoryId,
        business_id: businessId(),
      },
    })

    const category = adaptCategory(data?.category || {})
    return {
      category,
      cards: (data?.cards || []).map((row) => adaptSetCard({
        ...row,
        collection: category ? [category] : [],
      })).filter(Boolean),
    }
  },

  async getPriceStats(productId, filter = '1m') {
    const { data } = await http.post(`/v1/${businessId()}/product-stats-price`, {
      product_id: productId,
      filter,
    })
    return data
  },
}
