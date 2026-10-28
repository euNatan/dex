<script setup>
import { computed } from 'vue'
import { brDate, brPrice } from '../lib/format'

const props = defineProps({
  set: { type: Object, required: true },
})

const progress = computed(() => {
  const total = props.set.total_in_collection || 0
  if (!total) return 0
  return Math.min(100, Math.round(((props.set.uniqueOwned || 0) / total) * 100))
})

const to = computed(() => ({
  name: 'set-detail',
  params: { code: props.set.code || 'set' },
  query: (props.set.set_id || props.set.id)
    ? { id: String(props.set.set_id || props.set.id) }
    : {},
}))
</script>

<template>
  <router-link class="set-tile" :to="to">
    <div class="set-logo" :style="{ background: set.accent }">
      <img v-if="set.image" :src="set.image" :alt="set.name" />
      <template v-else>{{ set.code }}</template>
    </div>
    <div>
      <b>{{ set.name }}</b>
      <div class="tiny">{{ set.series }} · {{ brDate(set.release_date) }}</div>
      <div class="tiny">{{ set.uniqueOwned }}/{{ set.total_in_collection }} · {{ brPrice(set.collection_price) }}</div>
      <div class="progress"><span :style="{ width: progress + '%' }" /></div>
    </div>
  </router-link>
</template>
