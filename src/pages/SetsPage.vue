<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import SetTile from '../components/SetTile.vue'
import { useCollectionStore } from '../stores/collection'

const store = useCollectionStore()
const { setSummaries, totals, catalogSets } = storeToRefs(store)
const query = ref('')
const tab = ref('mine')
const loadingCatalog = ref(false)

onMounted(async () => {
  if (!catalogSets.value.length) {
    loadingCatalog.value = true
    try {
      await store.loadCatalogSets()
    } finally {
      loadingCatalog.value = false
    }
  }
})

function withProgress(set) {
  const owned = setSummaries.value.find((item) =>
    Number(item.set_id) === Number(set.id) || item.code === set.code,
  )
  return {
    ...set,
    uniqueOwned: owned?.uniqueOwned || 0,
    collection_price: owned?.collection_price || 0,
    total_in_collection: owned?.total_in_collection || set.total_in_collection,
  }
}

const mine = computed(() => {
  const term = query.value.trim().toLowerCase()
  return setSummaries.value.filter((set) => {
    if (!term) return true
    return [set.name, set.code, set.series].some((value) => String(value).toLowerCase().includes(term))
  })
})

const explore = computed(() => {
  const term = query.value.trim().toLowerCase()
  return catalogSets.value
    .filter((set) => {
      if (!term) return true
      return [set.name, set.code, set.series].some((value) => String(value).toLowerCase().includes(term))
    })
    .map(withProgress)
})

const visible = computed(() => tab.value === 'mine' ? mine.value : explore.value)
</script>

<template>
  <section>
    <div class="page-title">
      <div>
        <h1>Coleções</h1>
        <p>{{ totals.sets }} na sua coleção · busque um set e registre no grid</p>
      </div>
    </div>

    <div class="chip-row">
      <button type="button" :class="{ active: tab === 'mine' }" @click="tab = 'mine'">Minhas</button>
      <button type="button" :class="{ active: tab === 'explore' }" @click="tab = 'explore'">Explorar</button>
    </div>

    <label class="search">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
      <input v-model="query" type="search" placeholder="Buscar set, código ou série" />
    </label>

    <p v-if="tab === 'explore' && loadingCatalog" class="tiny">Carregando coleções da Liga...</p>

    <div v-if="visible.length" style="display:grid;gap:10px">
      <SetTile v-for="set in visible" :key="set.code + '-' + (set.set_id || set.id)" :set="set" />
    </div>
    <div v-else class="empty">
      {{ tab === 'mine' ? 'Nenhuma coleção na sua lista ainda. Explore um set para começar.' : 'Nenhuma coleção encontrada.' }}
    </div>
  </section>
</template>
