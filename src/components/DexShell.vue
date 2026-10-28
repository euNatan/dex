<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { isMock } from '../lib/env'
import { useCollectionStore } from '../stores/collection'
import { brPrice } from '../lib/format'

const route = useRoute()
const router = useRouter()
const store = useCollectionStore()
const { totals, toast, loading } = storeToRefs(store)

const nav = [
  { name: 'home', label: 'Início', icon: 'home' },
  { name: 'sets', label: 'Sets', icon: 'sets' },
  { name: 'cards', label: 'Cartas', icon: 'cards' },
  { name: 'extras', label: 'Extras', icon: 'extras' },
  { name: 'add', label: 'Add', icon: 'add' },
]

const active = computed(() => {
  if (route.name === 'set-detail') return 'sets'
  if (route.name === 'card-detail') return 'cards'
  return route.name
})

const publicScreen = computed(() => Boolean(route.meta.public))
</script>

<template>
  <div class="stage">
    <div class="dex">
      <header class="dex-top">
        <div class="brand">
          <button v-if="route.meta.back" class="back" type="button" @click="router.back()">←</button>
          <div v-else class="brand-mark" />
          <div class="brand-copy">
            <strong>DEX BRA</strong>
            <span>{{ isMock() ? 'Demo' : 'Liga BRA' }}</span>
          </div>
        </div>
        <div class="led" />
        <div v-if="!publicScreen" class="top-value">{{ brPrice(totals.price) }}</div>
      </header>

      <main class="dex-body">
        <div v-if="loading" class="tiny" style="margin-bottom:8px">Carregando coleção...</div>
        <router-view />
      </main>

      <nav v-if="!publicScreen" class="dex-nav">
        <button
          v-for="item in nav"
          :key="item.name"
          class="nav-item"
          :class="{ active: active === item.name }"
          type="button"
          @click="router.push({ name: item.name })"
        >
          <svg v-if="item.icon === 'home'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z"/></svg>
          <svg v-else-if="item.icon === 'sets'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="7" height="7" rx="1.5"/><rect x="14" y="4" width="7" height="7" rx="1.5"/><rect x="3" y="13" width="7" height="7" rx="1.5"/><rect x="14" y="13" width="7" height="7" rx="1.5"/></svg>
          <svg v-else-if="item.icon === 'cards'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="4" width="11" height="16" rx="2"/><path d="M16 7h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-8"/></svg>
          <svg v-else-if="item.icon === 'extras'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="8" r="3"/><circle cx="16" cy="10" r="3"/><path d="M4 19c.8-2.4 2.7-4 4.8-4s4 1.6 4.8 4M13.2 15.2c.8-.8 1.8-1.2 2.8-1.2 2.1 0 4 1.6 4.8 4"/></svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/></svg>
          {{ item.label }}
        </button>
      </nav>

      <div v-if="toast" class="toast">{{ toast }}</div>
    </div>
  </div>
</template>
