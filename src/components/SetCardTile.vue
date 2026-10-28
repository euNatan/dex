<script setup>
import { computed } from 'vue'
import CardFace from './CardFace.vue'
import { brPrice } from '../lib/format'

const props = defineProps({
  product: { type: Object, required: true },
  owned: { type: Boolean, default: false },
  quantity: { type: Number, default: 0 },
  busy: { type: Boolean, default: false },
})

defineEmits(['select'])

const price = computed(() => Number(props.product.market_price || 0))
const priceHint = computed(() => {
  if (!price.value) return 'sem preço'
  const formatted = brPrice(price.value)
  return props.product.price_source === 'last_sold' ? `${formatted} · venda` : formatted
})
</script>

<template>
  <button
    class="tile set-card"
    :class="{ missing: !owned, busy }"
    type="button"
    @click="$emit('select')"
  >
    <CardFace :product="product" />
    <div v-if="owned" class="qty-dot">x{{ quantity }}</div>
    <div v-else class="missing-plus">+</div>
    <div class="tile-meta">
      <b>{{ product.name }}</b>
      <span>
        #{{ product.card_number }} · {{ priceHint }}
      </span>
    </div>
  </button>
</template>
