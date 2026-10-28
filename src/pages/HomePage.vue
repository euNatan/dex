<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import CardTile from '../components/CardTile.vue'
import SetTile from '../components/SetTile.vue'
import { isMock } from '../lib/env'
import { useAuthStore } from '../stores/auth'
import { useCollectionStore } from '../stores/collection'
import { brPrice, compactNumber } from '../lib/format'

const store = useCollectionStore()
const auth = useAuthStore()
const router = useRouter()
const { totals, cards, setSummaries, extras, extrasTotal, error } = storeToRefs(store)

async function logout() {
  await auth.logout()
  router.replace({ name: 'login' })
}

const featuredSets = computed(() => setSummaries.value.slice(0, 3))
const recentCards = computed(() => [...cards.value].slice(0, 4))
const featuredExtras = computed(() => extras.value.slice(0, 3))
</script>

<template>
  <section>
    <div class="page-title">
      <div>
        <h1>DEX BRA</h1>
        <p>Sua coleção, com valor de mercado da Liga.</p>
      </div>
    </div>

    <div class="grid-stats">
      <div class="stat-hero">
        <div class="label">Valor da coleção</div>
        <div class="value">{{ brPrice(totals.price) }}</div>
        <div class="tiny">soma do menor anúncio × quantidade</div>
      </div>
      <div class="stat-stack">
        <div class="stat-mini panel">
          <div class="label">Cartas</div>
          <b>{{ compactNumber(totals.registred) }}</b>
        </div>
        <div class="stat-mini panel">
          <div class="label">Sets</div>
          <b>{{ compactNumber(totals.sets) }}</b>
        </div>
      </div>
    </div>

    <div class="chip-row">
      <div class="pill active">{{ compactNumber(totals.precified) }} precificadas</div>
      <div class="pill">{{ compactNumber(totals.registred - totals.precified) }} sem preço</div>
    </div>

    <div class="page-title">
      <div class="section-title">Coleções</div>
      <router-link class="tiny" to="/sets">Ver todas</router-link>
    </div>
    <div style="display:grid;gap:10px;margin-bottom:18px">
      <SetTile v-for="set in featuredSets" :key="set.code" :set="set" />
    </div>

    <div v-if="featuredExtras.length" class="page-title">
      <div class="section-title">Extras para vender</div>
      <router-link class="tiny" to="/extras">{{ brPrice(extrasTotal) }}</router-link>
    </div>
    <div v-if="featuredExtras.length" class="cards-grid" style="margin-bottom:18px">
      <CardTile v-for="card in featuredExtras" :key="'extra-' + card.id" :card="card" />
    </div>

    <div class="page-title">
      <div class="section-title">Cartas em destaque</div>
      <router-link class="tiny" to="/cards">Ver lista</router-link>
    </div>
    <div class="cards-grid">
      <CardTile v-for="card in recentCards" :key="card.id" :card="card" />
    </div>

    <p v-if="error" class="empty" style="color:var(--bra-red)">{{ error }}</p>

    <p class="empty" style="padding-top:18px">
      <button v-if="isMock()" class="btn btn-ghost" type="button" @click="store.resetDemo()">Restaurar demo</button>
      <button v-else class="btn btn-ghost" type="button" @click="logout">Sair da conta</button>
    </p>
  </section>
</template>
