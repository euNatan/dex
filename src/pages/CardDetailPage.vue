<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CardFace from '../components/CardFace.vue'
import PriceChart from '../components/PriceChart.vue'
import QtyStepper from '../components/QtyStepper.vue'
import { ligaProductUrl } from '../lib/media'
import { brPercent, brPrice } from '../lib/format'
import { useCollectionStore } from '../stores/collection'

const route = useRoute()
const router = useRouter()
const store = useCollectionStore()

const card = computed(
  () => store.cards.find((item) => item.id === Number(route.params.id)) || null,
)
const quantity = ref(card.value?.quantity || 1)
const saving = ref(false)
const period = ref('1m')
const stats = ref(null)
const monthStats = ref(null)
const statsLoading = ref(false)

watch(
  () => card.value?.quantity,
  (value) => {
    if (typeof value === 'number') quantity.value = value
  },
)

const chartValues = computed(() => stats.value?.datasets?.[0]?.data || [])
const chartLabels = computed(() => stats.value?.labels || [])
const extrasQty = computed(() => Math.max(0, Number(card.value?.quantity || 0) - 1))

const lastMonthPrice = computed(() => {
  const data = monthStats.value?.datasets?.[0]?.data || []
  return data.map(Number).find((value) => value > 0) || 0
})

const listingNow = computed(() => Number(card.value?.listing_price || (card.value?.price_source === 'listing' ? card.value?.market_price : 0) || 0))
const lastSold = computed(() => Number(card.value?.last_sold_price || (card.value?.price_source === 'last_sold' ? card.value?.market_price : 0) || 0))
const monthDelta = computed(() => {
  const now = listingNow.value || lastSold.value
  if (!now || !lastMonthPrice.value) return 0
  return ((now - lastMonthPrice.value) / lastMonthPrice.value) * 100
})

async function loadStats() {
  const productId = card.value?.product_id || card.value?.product?.id
  if (!productId) {
    stats.value = null
    monthStats.value = null
    return
  }

  statsLoading.value = true
  try {
    const [chart, month] = await Promise.all([
      store.getPriceStats(productId, period.value),
      period.value === '1m' ? Promise.resolve(null) : store.getPriceStats(productId, '1m'),
    ])
    stats.value = chart
    monthStats.value = month || chart
  } catch {
    stats.value = null
    monthStats.value = null
  } finally {
    statsLoading.value = false
  }
}

watch([() => card.value?.product_id, period], loadStats, { immediate: true })

async function saveQty() {
  if (!card.value || saving.value) return
  saving.value = true
  try {
    if (quantity.value <= 0) {
      await store.remove(card.value.id)
      router.replace({ name: 'cards' })
      return
    }
    await store.updateQuantity(card.value, quantity.value)
  } finally {
    saving.value = false
  }
}

async function remove() {
  if (!card.value || saving.value) return
  saving.value = true
  try {
    await store.remove(card.value.id)
    router.replace({ name: 'cards' })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section v-if="card">
    <div class="hero-card">
      <CardFace size="lg" :product="card.product" />
    </div>

    <div class="detail-panel panel">
      <div v-if="card.product.rarity" class="badge">{{ card.product.rarity }}</div>
      <h2>{{ card.product.name }}</h2>
      <p class="muted">{{ card.product.collection?.[0]?.name }} · {{ card.product.code }}</p>

      <div class="kv">
        <div>
          <span>Condição</span>
          <b>{{ card.condition?.name }} ({{ card.condition?.short_name }})</b>
        </div>
        <div>
          <span>Menor anúncio agora</span>
          <b>{{ brPrice(listingNow) }}</b>
        </div>
        <div>
          <span>Último vendido</span>
          <b>{{ brPrice(lastSold) }}</b>
        </div>
        <div>
          <span>Mês passado</span>
          <b>{{ brPrice(lastMonthPrice) }}</b>
        </div>
        <div>
          <span>Variação</span>
          <b :class="{ up: monthDelta > 0, down: monthDelta < 0 }">{{ brPercent(monthDelta) }}</b>
        </div>
      </div>

      <p v-if="extrasQty" class="tiny" style="margin:-4px 0 12px">
        {{ extrasQty }} extra{{ extrasQty > 1 ? 's' : '' }} além da coleção ·
        <router-link to="/extras">ver liquidez</router-link>
      </p>

      <div class="section-title">Histórico de vendas</div>
      <PriceChart
        v-model:period="period"
        :labels="chartLabels"
        :values="chartValues"
        :loading="statsLoading"
      />
      <p class="tiny" style="margin:8px 0 14px">
        Baseado em vendas NM/SP da Liga
        <span v-if="stats?.appreciation"> · {{ brPercent(stats.appreciation) }} no período</span>
      </p>

      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px">
        <span class="muted">Ajustar quantidade</span>
        <QtyStepper v-model="quantity" />
      </div>

      <button class="btn btn-primary" type="button" :disabled="saving" @click="saveQty">Salvar quantidade</button>
      <div style="height:10px" />
      <a class="btn btn-ghost" :href="ligaProductUrl({ ...card.product, id: card.product?.id || card.product_id })" target="_blank" rel="noopener">
        Ver anúncios na Liga
      </a>
      <div style="height:10px" />
      <button class="btn btn-ghost" type="button" :disabled="saving" @click="remove">Remover do Dex</button>
    </div>
  </section>
  <section v-else class="empty">Carta não encontrada.</section>
</template>
