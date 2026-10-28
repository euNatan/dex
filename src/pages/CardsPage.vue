<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import CardFace from '../components/CardFace.vue'
import { useCollectionStore } from '../stores/collection'
import { brPrice } from '../lib/format'

const store = useCollectionStore()
const { cards, conditions, totals } = storeToRefs(store)

const query = ref('')
const conditionId = ref(0)
const sort = ref('price')

const filtered = computed(() => {
  const term = query.value.trim().toLowerCase()
  let list = [...cards.value]

  if (term) {
    list = list.filter((card) =>
      [card.product?.name, card.product?.code, card.product?.card_number, card.product?.collection?.[0]?.name]
        .some((value) => String(value || '').toLowerCase().includes(term)),
    )
  }

  if (conditionId.value) {
    list = list.filter((card) => card.condition_id === conditionId.value)
  }

  if (sort.value === 'name') {
    list.sort((a, b) => a.product.name.localeCompare(b.product.name))
  } else if (sort.value === 'qty') {
    list.sort((a, b) => b.quantity - a.quantity)
  } else {
    list.sort((a, b) => b.market_price * b.quantity - a.market_price * a.quantity)
  }

  return list
})
</script>

<template>
  <section>
    <div class="page-title">
      <div>
        <h1>Cartas</h1>
        <p>{{ totals.registred }} unidades · {{ brPrice(totals.price) }}</p>
      </div>
    </div>

    <label class="search">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
      <input v-model="query" type="search" placeholder="Buscar nome, número ou set" />
    </label>

    <div class="chip-row">
      <button type="button" :class="{ active: conditionId === 0 }" @click="conditionId = 0">Todas</button>
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

    <div class="chip-row">
      <button type="button" :class="{ active: sort === 'price' }" @click="sort = 'price'">Maior valor</button>
      <button type="button" :class="{ active: sort === 'name' }" @click="sort = 'name'">Nome</button>
      <button type="button" :class="{ active: sort === 'qty' }" @click="sort = 'qty'">Quantidade</button>
    </div>

    <router-link v-for="card in filtered" :key="card.id" class="list-card" :to="`/cards/${card.id}`">
      <CardFace size="sm" :product="card.product" />
      <div class="list-meta">
        <b>{{ card.product.name }}</b>
        <span>{{ card.product.collection?.[0]?.name }} · #{{ card.product.card_number }} · {{ card.condition?.short_name }} · x{{ card.quantity }}</span>
      </div>
      <div class="price">{{ brPrice(card.market_price * card.quantity) }}</div>
    </router-link>

    <div v-if="!filtered.length" class="empty">Nenhuma carta encontrada.</div>
  </section>
</template>
