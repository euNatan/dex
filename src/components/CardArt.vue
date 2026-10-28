<script setup>
import { computed } from 'vue'
import { TYPE_COLORS } from '../data/catalog'

const props = defineProps({
  name: { type: String, default: 'Card' },
  number: { type: String, default: '000' },
  code: { type: String, default: '' },
  type: { type: String, default: 'colorless' },
  rarity: { type: String, default: 'Common' },
  hp: { type: [Number, String, null], default: null },
  size: { type: String, default: 'md' },
})

const palette = computed(() => TYPE_COLORS[props.type] || TYPE_COLORS.colorless)
const uid = computed(() => props.name.replace(/\W+/g, '') + props.number)
const hash = computed(() => {
  let h = 0
  for (const char of props.name + props.number) h = (h * 31 + char.charCodeAt(0)) >>> 0
  return h
})
const variant = computed(() => hash.value % 4)
const dims = computed(() => {
  if (props.size === 'lg') return { w: 220, h: 308 }
  if (props.size === 'sm') return { w: 64, h: 90 }
  return { w: 148, h: 208 }
})
const monogram = computed(() => props.name.slice(0, 1).toUpperCase())
</script>

<template>
  <div class="holo art" :style="{ width: dims.w + 'px', height: dims.h + 'px' }">
    <svg :viewBox="`0 0 ${dims.w} ${dims.h}`" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient :id="'bg-' + uid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" :stop-color="palette.from" />
          <stop offset="1" :stop-color="palette.to" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" :width="dims.w - 4" :height="dims.h - 4" rx="14" fill="#0b1220" stroke="#f9ac05" stroke-width="2.2" />
      <rect x="10" y="10" :width="dims.w - 20" :height="dims.h - 20" rx="10" :fill="`url(#bg-${uid})`" />
      <circle :cx="dims.w / 2" :cy="dims.h * 0.42" r="28" fill="none" :stroke="palette.ink" stroke-opacity="0.25" stroke-width="8" />
      <circle v-if="variant === 0" :cx="dims.w / 2" :cy="dims.h * 0.4" r="22" :fill="palette.ink" fill-opacity="0.18" />
      <ellipse v-if="variant === 1" :cx="dims.w / 2" :cy="dims.h * 0.42" rx="30" ry="18" :fill="palette.ink" fill-opacity="0.18" />
      <polygon v-if="variant === 2" :points="`${dims.w/2},${dims.h*0.24} ${dims.w*0.72},${dims.h*0.52} ${dims.w*0.28},${dims.h*0.52}`" :fill="palette.ink" fill-opacity="0.18" />
      <rect v-if="variant === 3" :x="dims.w * 0.32" :y="dims.h * 0.28" :width="dims.w * 0.36" :height="dims.h * 0.26" rx="8" :fill="palette.ink" fill-opacity="0.18" />
      <text :x="dims.w / 2" :y="dims.h * 0.46" text-anchor="middle" :fill="palette.ink" :font-size="dims.w > 100 ? 42 : 22" font-family="Rajdhani, sans-serif" font-weight="700">{{ monogram }}</text>
      <text v-if="size !== 'sm'" :x="14" :y="28" :fill="palette.ink" font-size="11" font-weight="700" font-family="Manrope, sans-serif">{{ name }}</text>
      <text v-if="hp && size !== 'sm'" :x="dims.w - 14" :y="28" text-anchor="end" :fill="palette.ink" font-size="11" font-weight="800">HP {{ hp }}</text>
      <text v-if="size !== 'sm'" :x="14" :y="dims.h - 16" :fill="palette.ink" font-size="10" font-weight="700">#{{ number }}</text>
      <text v-if="size !== 'sm'" :x="dims.w - 14" :y="dims.h - 16" text-anchor="end" :fill="palette.ink" font-size="10" font-weight="700">{{ code }}</text>
    </svg>
  </div>
</template>

<style scoped>
.art { margin: 0 auto; }
</style>
