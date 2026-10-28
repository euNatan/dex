import axios from 'axios'
import { ligaApi } from '../lib/env'
import { clearToken, getToken, setToken } from './session'

const http = axios.create({
  baseURL: ligaApi(),
  headers: { Accept: 'application/json' },
})

let refreshInFlight = null

http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const config = error.config || {}

    if (status !== 401 || config.skipAuthRetry || config.authRetried) {
      if (status === 401 && !config.skipAuthRetry) {
        redirectToLogin()
      }
      return Promise.reject(error)
    }

    try {
      await refreshAccessToken()
      config.authRetried = true
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${getToken()}`,
      }
      return http.request(config)
    } catch {
      redirectToLogin()
      return Promise.reject(error)
    }
  },
)

export async function refreshAccessToken() {
  if (refreshInFlight) return refreshInFlight

  refreshInFlight = http
    .post('/v1/refresh', {}, { skipAuthRetry: true })
    .then((res) => {
      const token = res?.data?.token
      if (!token) throw new Error('Refresh sem token')
      setToken(token)
      return token
    })
    .finally(() => {
      refreshInFlight = null
    })

  return refreshInFlight
}

function redirectToLogin() {
  clearToken()
  if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/auth/callback')) {
    window.location.href = '/login'
  }
}

export default http
