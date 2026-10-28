<script setup>
import { computed } from 'vue'
import { productImage } from '../lib/media'
import CardArt from './CardArt.vue'

const props = defineProps({
  product: { type: Object, default: () => ({}) },
  size: { type: String, default: 'md' },
})

const src = computed(() => props.product?.image || productImage(props.product))
const dims = computed(() => {
  if (props.size === 'lg') return { w: 220, h: 308 }
  if (props.size === 'sm') return { w: 64, h: 90 }
  return { w: 148, h: 208 }
})
</script>

<template>
  <img
    v-if="src"
    class="holo card-photo"
    :src="src"
    :alt="product.name"
    :style="{ width: dims.w + 'px', height: dims.h + 'px' }"
  />
  <CardArt
    v-else
    :size="size"
    :name="product.name"
    :number="product.card_number"
    :code="product.code"
    :type="product.type"
    :rarity="product.rarity"
    :hp="product.hp"
  />
</template>

<style scoped>
.card-photo {
  display: block;
  margin: 0 auto;
  object-fit: cover;
  border-radius: 12px;
  background: #0b1220;
}
</style>
