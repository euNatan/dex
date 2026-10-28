<script setup>
import { computed } from 'vue'
import { brPrice } from '../lib/format'
import CardFace from './CardFace.vue'

const props = defineProps({
  card: { type: Object, required: true },
})

const product = computed(() => props.card.product || {})
</script>

<template>
  <router-link class="tile" :to="`/cards/${card.id}`">
    <CardFace :product="product" />
    <div class="tile-meta">
      <b>{{ product.name }}</b>
      <span>{{ product.collection?.[0]?.name }} · {{ card.condition?.short_name }} · x{{ card.quantity }}</span>
      <div class="price">{{ brPrice(card.market_price * card.quantity) }}</div>
    </div>
  </router-link>
</template>
