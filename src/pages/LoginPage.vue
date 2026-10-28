<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { isMock } from '../lib/env'
import { useAuthStore } from '../stores/auth'
import { useCollectionStore } from '../stores/collection'

const auth = useAuthStore()
const collection = useCollectionStore()
const router = useRouter()
const pasted = ref('')
const error = ref('')

async function usePastedToken() {
  const token = pasted.value.trim()
  if (!token) {
    error.value = 'Cole um JWT da Liga BRA para continuar.'
    return
  }
  auth.acceptToken(token)
  await collection.loadConditions()
  await collection.refresh()
  router.replace({ name: 'home' })
}
</script>

<template>
  <section>
    <div class="page-title">
      <div>
        <h1>Entrar</h1>
        <p>Use a mesma conta da Liga BRA para ver o valor das suas cartas.</p>
      </div>
    </div>

    <div class="panel" style="padding:18px">
      <p class="muted">O Dex autentica no Keycloak da Liga e recebe o JWT da API.</p>
      <div style="height:16px" />
      <button class="btn btn-primary" type="button" @click="auth.loginWithLiga()">
        Entrar com Liga BRA
      </button>
    </div>

    <div v-if="!isMock()" class="panel" style="padding:18px;margin-top:12px">
      <div class="tiny">Desenvolvimento</div>
      <p class="muted">Se o Keycloak não estiver acessível daqui, cole o token da sessão da loja.</p>
      <textarea v-model="pasted" class="search" style="width:100%;min-height:90px;margin:10px 0;padding:10px" placeholder="eyJ..." />
      <p v-if="error" class="tiny" style="color:var(--bra-red)">{{ error }}</p>
      <button class="btn btn-ghost" type="button" @click="usePastedToken">Usar token</button>
    </div>
  </section>
</template>
