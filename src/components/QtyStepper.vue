<script setup>
defineProps({
  modelValue: { type: Number, default: 1 },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="stepper">
    <button type="button" @click="$emit('update:modelValue', Math.max(0, modelValue - 1))">−</button>
    <b>{{ modelValue }}</b>
    <button type="button" @click="$emit('update:modelValue', modelValue + 1)">+</button>
  </div>
</template>
