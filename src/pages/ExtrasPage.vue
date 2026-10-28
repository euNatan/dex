<script setup>
import { storeToRefs } from 'pinia'
import CardFace from '../components/CardFace.vue'
import { ligaProductUrl } from '../lib/media'
import { brPrice, compactNumber } from '../lib/format'
import { useCollectionStore } from '../stores/collection'

const store = useCollectionStore()
const { extras, extrasTotal } = storeToRefs(store)
</script>

<template>
  <section>
    <div class="page-title">
      <div>
        <h1>Extras</h1>
        <p>1 fica na coleção. O resto é liquidez para anunciar.</p>
      </div>
    </div>

    <div class="stat-hero" style="margin-bottom:16px">
      <div class="label">Valor dos extras</div>
      <div class="value">{{ brPrice(extrasTotal) }}</div>
      <div class="tiny">{{ compactNumber(extras.length) }} cartas com quantidade acima de 1</div>
    </div>

    <article v-for="card in extras" :key="card.id" class="list-card">
      <router-link :to="`/cards/${card.id}`">
        <CardFace size="sm" :product="card.product" />
      </router-link>
      <div class="list-meta">
        <router-link :to="`/cards/${card.id}`">
          <b>{{ card.product.name }}</b>
        </router-link>
        <span>tenho {{ card.quantity }} · {{ card.extras }} extra{{ card.extras > 1 ? 's' : '' }} · {{ card.condition?.short_name }}</span>
        <a class="liga-link" :href="ligaProductUrl(card.product)" target="_blank" rel="noopener">
          Anunciar na Liga
        </a>
      </div>
      <div class="price">{{ brPrice(card.extras_value) }}</div>
    </article>

    <div v-if="!extras.length" class="empty">Nenhum extra ainda. Quantidade maior que 1 vira liquidez aqui.</div>
  </section>
</template>
