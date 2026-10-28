<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import AddSheet from '../components/AddSheet.vue'
import SetCardTile from '../components/SetCardTile.vue'
import { useCollectionStore } from '../stores/collection'
import { brDate, brPrice, compactNumber } from '../lib/format'

const route = useRoute()
const router = useRouter()
const store = useCollectionStore()
const { setSummaries, cards, catalogSets, defaultConditionId } = storeToRefs(store)

const filter = ref('all')
const registerMode = ref(true)
const catalog = ref([])
const category = ref(null)
const loadingSet = ref(false)
const loadError = ref('')
const selectedProduct = ref(null)
const busyId = ref('')

const ownedSet = computed(() =>
  setSummaries.value.find((set) => set.code === route.params.code)
  || setSummaries.value.find((set) => Number(set.set_id) === Number(route.query.id))
  || null,
)

const catalogHit = computed(() =>
  catalogSets.value.find((set) => Number(set.id) === Number(route.query.id))
  || catalogSets.value.find((set) => set.code === route.params.code)
  || null,
)

const categoryId = computed(() => {
  const fromQuery = Number(route.query.id)
  if (fromQuery) return fromQuery
  if (ownedSet.value?.set_id) return Number(ownedSet.value.set_id)
  const fromCatalog = catalogSets.value.find((set) => set.code === route.params.code)
  return Number(fromCatalog?.id || 0)
})

const ownedByProduct = computed(() => {
  const map = {}
  cards.value.forEach((card) => {
    if (!map[card.product_id]) map[card.product_id] = []
    map[card.product_id].push(card)
  })
  return map
})

function rowKey(product) {
  return product?.id ? `p-${product.id}` : `s-${product?.api_id || product?.code || product?.name}`
}

const rows = computed(() => catalog.value.map((product) => {
  const entries = product.id ? (ownedByProduct.value[product.id] || []) : []
  const quantity = entries.reduce((sum, entry) => sum + Number(entry.quantity || 0), 0)
  return { product, entries, quantity, owned: quantity > 0, key: rowKey(product) }
}))

const visible = computed(() => {
  if (filter.value === 'have') return rows.value.filter((row) => row.owned)
  if (filter.value === 'missing') return rows.value.filter((row) => !row.owned)
  return rows.value
})

const missing = computed(() => rows.value.filter((row) => !row.owned))
const completeCost = computed(() =>
  missing.value.reduce((sum, row) => sum + Number(row.product.market_price || 0), 0),
)
const missingUnpriced = computed(() =>
  missing.value.filter((row) => !Number(row.product.market_price)).length,
)
const uniqueOwned = computed(() => rows.value.filter((row) => row.owned).length)
const totalInSet = computed(() =>
  Number(category.value?.total_in_collection || ownedSet.value?.total_in_collection || catalog.value.length),
)
const title = computed(() => category.value?.name || ownedSet.value?.name || catalogHit.value?.name || 'Coleção')
const series = computed(() => category.value?.series || ownedSet.value?.series || catalogHit.value?.series || '')
const releaseDate = computed(() => category.value?.release_date || ownedSet.value?.release_date || catalogHit.value?.release_date || '')

watch(categoryId, async (id) => {
  if (!id) {
    if (!catalogSets.value.length) {
      try {
        await store.loadCatalogSets()
      } catch {
        loadError.value = 'Não foi possível carregar a coleção'
      }
    }
    return
  }

  loadingSet.value = true
  loadError.value = ''
  try {
    const data = await store.getSetCards(id)
    category.value = data.category
    catalog.value = (data.cards || []).map((product) => ({
      ...product,
      collection: product.collection?.length
        ? product.collection
        : [{ id: data.category?.id, name: data.category?.name, code: data.category?.code }],
    }))
  } catch (err) {
    loadError.value = err?.message || 'Não foi possível carregar as cartas do set'
    catalog.value = []
  } finally {
    loadingSet.value = false
  }
}, { immediate: true })

function withCollection(product) {
  return {
    ...product,
    collection: product.collection?.length
      ? product.collection
      : [{ id: category.value?.id, name: category.value?.name, code: category.value?.code }],
  }
}

async function onSelect(row) {
  if (busyId.value) return

  if (registerMode.value) {
    busyId.value = row.key
    try {
      if (row.owned) {
        for (const entry of row.entries) {
          await store.remove(entry.id)
        }
      } else {
        const result = await store.addToCollection({
          product_id: row.product.id || undefined,
          api_id: row.product.api_id,
          storage_card: row.product.storage_card,
          category_id: categoryId.value,
          condition_id: defaultConditionId.value,
          quantity: 1,
        })
        if (result?.product_id && !row.product.id) {
          catalog.value = catalog.value.map((item) => (
            rowKey(item) === row.key
              ? { ...item, id: result.product_id, source: 'liga' }
              : item
          ))
        }
      }
    } catch (err) {
      loadError.value = err?.message || 'Não foi possível atualizar a carta'
    } finally {
      busyId.value = ''
    }
    return
  }

  if (row.owned && row.entries[0]) {
    router.push({ name: 'card-detail', params: { id: row.entries[0].id } })
    return
  }

  selectedProduct.value = withCollection(row.product)
}
</script>

<template>
  <section v-if="ownedSet || category || catalogHit || loadingSet || catalog.length || loadError">
    <div class="page-title">
      <div>
        <h1>{{ title }}</h1>
        <p>{{ series }} · {{ brDate(releaseDate) }}</p>
      </div>
    </div>

    <div class="grid-stats">
      <div class="stat-hero">
        <div class="label">Custo para fechar</div>
        <div class="value">{{ brPrice(completeCost) }}</div>
        <div class="tiny">
          {{ compactNumber(missing.length) }} faltando
          <span v-if="missingUnpriced"> · {{ missingUnpriced }} sem preço</span>
        </div>
      </div>
      <div class="stat-stack">
        <div class="stat-mini panel">
          <div class="label">Progresso</div>
          <b>{{ uniqueOwned }}/{{ totalInSet }}</b>
        </div>
        <div class="stat-mini panel">
          <div class="label">Valor que você tem</div>
          <b>{{ brPrice(ownedSet?.collection_price) }}</b>
        </div>
      </div>
    </div>

    <div class="chip-row">
      <button type="button" :class="{ active: filter === 'all' }" @click="filter = 'all'">Todas</button>
      <button type="button" :class="{ active: filter === 'missing' }" @click="filter = 'missing'">Faltam</button>
      <button type="button" :class="{ active: filter === 'have' }" @click="filter = 'have'">Tenho</button>
      <button type="button" :class="{ active: registerMode }" @click="registerMode = !registerMode">
        {{ registerMode ? 'Modo 0/1' : 'Ajustar' }}
      </button>
    </div>
    <p class="tiny" style="margin:-6px 0 12px">
      {{ registerMode
        ? 'Toque para marcar tenho (NM) ou tirar da coleção.'
        : 'Toque na carta para abrir a ficha ou registrar com condição.' }}
    </p>

    <p v-if="loadingSet" class="tiny">Carregando checklist do set...</p>
    <p v-else-if="loadError" class="tiny" style="color:var(--bra-red)">{{ loadError }}</p>

    <div v-if="visible.length" class="cards-grid">
      <SetCardTile
        v-for="row in visible"
        :key="row.key"
        :product="row.product"
        :owned="row.owned"
        :quantity="row.quantity"
        :busy="busyId === row.key"
        @select="onSelect(row)"
      />
    </div>
    <div v-else-if="!loadingSet" class="empty">Nenhuma carta neste filtro.</div>

    <AddSheet
      v-if="selectedProduct"
      :product="selectedProduct"
      :category-id="categoryId"
      @close="selectedProduct = null"
      @saved="selectedProduct = null"
    />
  </section>
  <section v-else class="empty">Coleção não encontrada.</section>
</template>
