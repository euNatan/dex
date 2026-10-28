<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCollectionStore } from '../stores/collection'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const collection = useCollectionStore()
const message = ref('Autenticando...')

onMounted(async () => {
  if (route.query.auth_error) {
    message.value = 'Falha na autenticação. Tente entrar de novo.'
    window.setTimeout(() => router.replace({ name: 'login' }), 1600)
    return
  }

  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const token = hash.get('token')
  if (!token) {
    message.value = 'Token ausente. Redirecionando...'
    window.setTimeout(() => router.replace({ name: 'login' }), 1200)
    return
  }

  auth.acceptToken(token)
  history.replaceState(null, '', '/auth/callback')
  await collection.loadConditions()
  await collection.refresh()
  router.replace({ name: 'home' })
})
</script>

<template>
  <section class="empty">{{ message }}</section>
</template>
