<script setup>
import { computed } from 'vue'

const props = defineProps({
  labels: { type: Array, default: () => [] },
  values: { type: Array, default: () => [] },
  period: { type: String, default: '1m' },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:period'])

const periods = [
  { key: '1s', label: '7d' },
  { key: '1m', label: '30d' },
  { key: '3m', label: '90d' },
]

const series = computed(() => props.values.map((value) => Number(value) || 0))

const path = computed(() => {
  const data = series.value
  if (data.length < 2) return ''

  const width = 320
  const height = 110
  const pad = 8
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1

  return data.map((value, index) => {
    const x = pad + (index / (data.length - 1)) * (width - pad * 2)
    const y = height - pad - ((value - min) / span) * (height - pad * 2)
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')
})

const hasData = computed(() => series.value.some((value) => value > 0))
</script>

<template>
  <div class="price-chart">
    <div class="chip-row" style="margin-bottom:10px">
      <button
        v-for="item in periods"
        :key="item.key"
        type="button"
        :class="{ active: period === item.key }"
        @click="emit('update:period', item.key)"
      >
        {{ item.label }}
      </button>
    </div>

    <div v-if="loading" class="tiny">Carregando histórico de vendas...</div>
    <svg v-else-if="hasData && path" viewBox="0 0 320 110" class="spark">
      <path :d="path" fill="none" stroke="#7ddec4" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <p v-else class="tiny" style="margin:8px 0 0">Ainda não há vendas suficientes neste período.</p>
  </div>
</template>
