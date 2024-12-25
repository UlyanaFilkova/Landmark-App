import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('userId') !== null

  if (isAuthenticated && (to.name === 'login' || to.name === 'registration' || to.name === '')) {
    return next({ name: 'generalMap' })
  }

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    return next({ name: 'login' })
  }

  next()
})

export default router
