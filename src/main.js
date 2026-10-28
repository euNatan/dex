import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { isMock } from './lib/env'
import router from './router'
import { getToken } from './services/session'
import { useCollectionStore } from './stores/collection'
import './style.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

const collection = useCollectionStore(pinia)
collection.loadConditions()
if (isMock() || getToken()) {
  collection.refresh()
}

app.mount('#app')
