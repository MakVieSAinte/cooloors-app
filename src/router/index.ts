import { createRouter, createWebHistory } from 'vue-router'

declare global {
  interface Window {
    va?: (event: 'pageview', data?: { url?: string; title?: string }) => void
  }
}  
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/share/:colors',
      name: 'SharePalette',
      component: () => import('../views/SharePaletteView.vue'),
    },
  ],
})

// Vercel Web Analytics: envoi d'un pageview sur chaque navigation SPA en production
router.afterEach((to) => {
  if (import.meta.env.PROD && typeof window !== 'undefined' && typeof window.va === 'function') {
    window.va('pageview', { url: to.fullPath, title: document.title })
  }
})

export default router
