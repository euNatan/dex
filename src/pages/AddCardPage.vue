<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import CardFace from '../components/CardFace.vue'
import QtyStepper from '../components/QtyStepper.vue'
import { useCollectionStore } from '../stores/collection'
import { brPrice } from '../lib/format'

const store = useCollectionStore()
const { conditions } = storeToRefs(store)
const router = useRouter()

const query = ref('')
const selected = ref(null)
const conditionId = ref(0)
const quantity = ref(1)
const suggestions = ref([])
const searching = ref(false)
const saving = ref(false)
const error = ref('')
let searchTimer = 0

watch(
  conditions,
  (list) => {
    if (list.length && !list.some((item) => item.id === conditionId.value)) {
      conditionId.value = list[0].id
    }
  },
  { immediate: true },
)

watch(query, (value) => {
  window.clearTimeout(searchTimer)
  if (selected.value && value === selected.value.name) return
  selected.value = null
  if (String(value).trim().length < 2) {
    suggestions.value = []
    return
  }
  searchTimer = window.setTimeout(async () => {
    searching.value = true
    try {
      suggestions.value = await store.searchProducts(value)
    } finally {
      searching.value = false
    }
  }, 280)
})

const unitPrice = computed(() => Number(selected.value?.market_price || selected.value?.prices?.[conditionId.value] || 0))

function pick(product) {
  selected.value = product
  query.value = product.name
  suggestions.value = []
}

async function submit() {
  if (!selected.value || quantity.value < 1 || saving.value) return
  saving.value = true
  error.value = ''
  try {
    await store.addToCollection({
      product_id: selected.value.id,
      condition_id: conditionId.value,
      quantity: quantity.value,
    })
    router.push({ name: 'cards' })
  } catch (err) {
    error.value = err?.message || 'Não foi possível registrar'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section>
    <div class="page-title">
      <div>
        <h1>Registrar</h1>
        <p>Busque a carta no catálogo da Liga, escolha a condição e a quantidade.</p>
      </div>
    </div>

    <label class="search">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
      <input v-model="query" type="search" placeholder="Pikachu, MEW-025, Charizard..." />
    </label>

    <p v-if="searching" class="tiny">Buscando na Liga BRA...</p>

    <div v-if="!selected && suggestions.length">
      <button
        v-for="product in suggestions"
        :key="product.id"
        class="suggest"
        type="button"
        @click="pick(product)"
      >
        <CardFace size="sm" :product="product" />
        <div class="list-meta">
          <b>{{ product.name }}</b>
          <span>{{ product.collection?.[0]?.name }} · {{ product.code }}</span>
        </div>
      </button>
    </div>

    <div v-if="selected" class="panel" style="padding:14px">
      <div class="hero-card">
        <CardFace :product="selected" />
      </div>
      <h2 style="margin:0 0 4px;font-family:Rajdhani,sans-serif">{{ selected.name }}</h2>
      <p class="muted">{{ selected.collection?.[0]?.name }} · {{ selected.code }}</p>

      <div class="section-title" style="margin-top:16px">Condição</div>
      <div class="chip-row">
        <button
          v-for="condition in conditions"
          :key="condition.id"
          type="button"
          :class="{ active: conditionId === condition.id }"
          @click="conditionId = condition.id"
        >
          {{ condition.short_name }}
        </button>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;margin:8px 0 16px">
        <div>
          <div class="tiny">Quantidade</div>
          <div class="price">{{ brPrice(unitPrice * quantity) }}</div>
        </div>
        <QtyStepper v-model="quantity" />
      </div>

      <p v-if="error" class="tiny" style="color:var(--bra-red);margin-bottom:8px">{{ error }}</p>
      <button class="btn btn-primary" type="button" :disabled="saving" @click="submit">Registrar no Dex</button>
      <div style="height:10px" />
      <button class="btn btn-ghost" type="button" @click="selected = null">Trocar carta</button>
    </div>

    <p v-if="query.length >= 2 && !selected && !suggestions.length && !searching" class="empty">
      Nenhuma carta encontrada no catálogo da Liga.
    </p>
  </section>
</template>
