import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { isMock, ligaOrigin } from '../lib/env'
import { apiRepo } from '../services/apiRepo'
import { clearToken, getToken, setToken } from '../services/session'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getToken())

  const loggedIn = computed(() => isMock() || Boolean(token.value))

  function loginWithLiga() {
    const returnTo = encodeURIComponent(window.location.origin)
    window.location.href = `${ligaOrigin()}/auth/login?return_to=${returnTo}`
  }

  function acceptToken(nextToken) {
    setToken(nextToken)
    token.value = nextToken
  }

  async function logout() {
    if (!isMock() && token.value) {
      await apiRepo.logout()
    }
    clearToken()
    token.value = ''
  }

  return {
    token,
    loggedIn,
    loginWithLiga,
    acceptToken,
    logout,
  }
})
