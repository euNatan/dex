import { createRouter, createWebHistory } from 'vue-router'
import { isMock } from '../lib/env'
import { getToken } from '../services/session'
import HomePage from '../pages/HomePage.vue'
import SetsPage from '../pages/SetsPage.vue'
import SetDetailPage from '../pages/SetDetailPage.vue'
import CardsPage from '../pages/CardsPage.vue'
import CardDetailPage from '../pages/CardDetailPage.vue'
import AddCardPage from '../pages/AddCardPage.vue'
import ExtrasPage from '../pages/ExtrasPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import AuthCallbackPage from '../pages/AuthCallbackPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage, meta: { title: 'Dex BRA' } },
    { path: '/sets', name: 'sets', component: SetsPage, meta: { title: 'Coleções' } },
    { path: '/sets/:code', name: 'set-detail', component: SetDetailPage, meta: { title: 'Coleção', back: true } },
    { path: '/cards', name: 'cards', component: CardsPage, meta: { title: 'Cartas' } },
    { path: '/cards/:id', name: 'card-detail', component: CardDetailPage, meta: { title: 'Carta', back: true } },
    { path: '/add', name: 'add', component: AddCardPage, meta: { title: 'Registrar' } },
    { path: '/extras', name: 'extras', component: ExtrasPage, meta: { title: 'Extras' } },
    { path: '/login', name: 'login', component: LoginPage, meta: { title: 'Entrar', public: true } },
    { path: '/auth/callback', name: 'auth-callback', component: AuthCallbackPage, meta: { title: 'Auth', public: true } },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (isMock() || to.meta.public) return true
  if (!getToken()) return { name: 'login' }
  return true
})

export default router
