<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import CardFace from './CardFace.vue'
import QtyStepper from './QtyStepper.vue'
import { useCollectionStore } from '../stores/collection'
import { brPrice } from '../lib/format'

const props = defineProps({
  product: { type: Object, default: null },
  defaultQuantity: { type: Number, default: 1 },
  categoryId: { type: Number, default: 0 },
})

const emit = defineEmits(['close', 'saved'])

const store = useCollectionStore()
const { conditions } = storeToRefs(store)

const conditionId = ref(0)
const quantity = ref(props.defaultQuantity)
const saving = ref(false)
const error = ref('')

watch(
  () => props.product,
  () => {
    quantity.value = props.defaultQuantity
    error.value = ''
    if (conditions.value.length && !conditions.value.some((item) => item.id === conditionId.value)) {
      conditionId.value = conditions.value[0].id
    }
  },
  { immediate: true },
)

watch(
  conditions,
  (list) => {
    if (list.length && !list.some((item) => item.id === conditionId.value)) {
      conditionId.value = list[0].id
    }
  },
  { immediate: true },
)

const unitPrice = computed(() => Number(props.product?.market_price || 0))

async function submit() {
  if (!props.product || saving.value) return
  saving.value = true
  error.value = ''
  try {
    await store.addToCollection({
      product_id: props.product.id || undefined,
      api_id: props.product.api_id,
      storage_card: props.product.storage_card,
      category_id: props.categoryId || undefined,
      condition_id: conditionId.value,
      quantity: quantity.value,
    })
    emit('saved')
  } catch (err) {
    error.value = err?.message || 'Não foi possível registrar'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Teleport to=".dex">
    <div class="sheet-backdrop" @click="emit('close')">
      <div class="sheet" @click.stop>
        <div class="sheet-handle" />
        <div v-if="product" class="sheet-body">
          <div class="sheet-card">
            <CardFace size="sm" :product="product" />
            <div>
              <b>{{ product.name }}</b>
              <span class="tiny">{{ product.collection?.[0]?.name }} · {{ product.code }}</span>
              <div class="price">{{ brPrice(unitPrice) }}</div>
            </div>
          </div>

          <div class="section-title" style="margin-top:12px">Condição</div>
          <div class="chip-row">
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

          <div style="display:flex;align-items:center;justify-content:space-between;margin:4px 0 14px">
            <div>
              <div class="tiny">Quantidade</div>
              <div class="price">{{ brPrice(unitPrice * quantity) }}</div>
            </div>
            <QtyStepper v-model="quantity" />
          </div>

          <p v-if="error" class="tiny" style="color:var(--bra-red);margin-bottom:8px">{{ error }}</p>
          <button class="btn btn-primary" type="button" :disabled="saving || quantity < 1" @click="submit">
            Registrar no Dex
          </button>
          <div style="height:8px" />
          <button class="btn btn-ghost" type="button" @click="emit('close')">Cancelar</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
