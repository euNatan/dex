import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { defaultOriginId, isMock } from '../lib/env'
import { repo } from '../services/repo'
import { useAuthStore } from './auth'

function flattenCards(grouped) {
  return Object.values(grouped).flatMap((group) => Object.values(group.cards || {}))
}

export const useCollectionStore = defineStore('collection', () => {
  const grouped = ref({})
  const conditions = ref([])
  const catalogSets = ref([])
  const setCardsById = ref({})
  const toast = ref('')
  const loading = ref(false)
  const error = ref('')

  async function loadConditions() {
    try {
      const list = await repo.getConditions()
      conditions.value = Array.isArray(list) ? list : []
    } catch {
      conditions.value = []
    }
  }

  async function refresh() {
    const auth = useAuthStore()
    if (!isMock() && !auth.loggedIn) {
      grouped.value = {}
      return
    }

    loading.value = true
    error.value = ''
    try {
      grouped.value = await repo.buildGrouped('collection')
    } catch (err) {
      error.value = err?.message || 'Não foi possível carregar a coleção'
      grouped.value = {}
    } finally {
      loading.value = false
    }
  }

  async function addToCollection(payload) {
    const result = await repo.addToCollection({
      ...payload,
      origin_id: payload.origin_id || defaultOriginId(),
    })
    await refresh()
    showToast('Carta registrada no Dex')
    return result
  }

  async function updateQuantity(entryOrId, quantity) {
    const entry = typeof entryOrId === 'object'
      ? entryOrId
      : cards.value.find((item) => item.id === Number(entryOrId))

    if (!entry) return

    if (isMock()) {
      repo.updateQuantity(entry.id, quantity)
    } else {
      await repo.updateQuantity(entry, quantity)
    }
    await refresh()
  }

  async function remove(id) {
    await repo.remove(id)
    await refresh()
    showToast('Carta removida')
  }

  async function resetDemo() {
    if (!isMock()) return
    repo.reset()
    await refresh()
    showToast('Coleção de demonstração restaurada')
  }

  function showToast(message) {
    toast.value = message
    window.setTimeout(() => {
      if (toast.value === message) toast.value = ''
    }, 2200)
  }

  async function searchProducts(query) {
    return repo.searchProducts(query)
  }

  async function loadCatalogSets(query = '') {
    catalogSets.value = await repo.getCollections(query)
    return catalogSets.value
  }

  function peekSetCards(categoryId) {
    return setCardsById.value[String(categoryId)] || null
  }

  function rememberSetCards(categoryId, data) {
    if (!categoryId || !data) return
    setCardsById.value = {
      ...setCardsById.value,
      [String(categoryId)]: data,
    }
  }

  async function getSetCards(categoryId, { force = false } = {}) {
    if (!force) {
      const cached = peekSetCards(categoryId)
      if (cached) return cached
    }

    const data = await repo.getSetCards(categoryId)
    rememberSetCards(categoryId, data)
    return data
  }

  async function getPriceStats(productId, filter = '1m') {
    return repo.getPriceStats(productId, filter)
  }

  const cards = computed(() => flattenCards(grouped.value))

  const totals = computed(() => {
    const groups = Object.values(grouped.value)
    const all = flattenCards(grouped.value)
    const setNames = new Set(
      all.map((card) => card.product?.collection?.[0]?.name).filter(Boolean),
    )

    return {
      price: groups.reduce((sum, group) => sum + (group.collection_price || 0), 0),
      registred: groups.reduce((sum, group) => sum + (group.registred || 0), 0),
      precified: groups.reduce((sum, group) => sum + (group.precified || 0), 0),
      sets: setNames.size || groups.filter((group) => group.code !== 'minhas-cartas').length,
    }
  })

  const setSummaries = computed(() => {
    return Object.entries(grouped.value).map(([name, group]) => {
      const uniqueOwned = new Set(
        Object.values(group.cards || {}).map((card) => card.product_id),
      ).size

      return {
        name,
        ...group,
        uniqueOwned,
      }
    }).sort((a, b) => b.collection_price - a.collection_price)
  })

  const extras = computed(() => {
    return cards.value
      .filter((card) => Number(card.quantity) > 1)
      .map((card) => {
        const extraQty = Number(card.quantity) - 1
        return {
          ...card,
          extras: extraQty,
          extras_value: extraQty * Number(card.market_price || 0),
        }
      })
      .sort((a, b) => b.extras_value - a.extras_value)
  })

  const extrasTotal = computed(() => extras.value.reduce((sum, card) => sum + card.extras_value, 0))

  const defaultConditionId = computed(() => {
    const nm = conditions.value.find((condition) => {
      const shortName = String(condition.short_name || '').toUpperCase()
      return shortName === 'NM' || Number(condition.id) === 1
    })
    return nm?.id || conditions.value[0]?.id || 1
  })

  return {
    grouped,
    conditions,
    catalogSets,
    toast,
    loading,
    error,
    cards,
    totals,
    setSummaries,
    extras,
    extrasTotal,
    defaultConditionId,
    refresh,
    loadConditions,
    addToCollection,
    updateQuantity,
    remove,
    resetDemo,
    searchProducts,
    loadCatalogSets,
    getSetCards,
    peekSetCards,
    rememberSetCards,
    getPriceStats,
  }
})
