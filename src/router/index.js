import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('userId') !== null

  // Redirect authenticated users from login/registration to home
  if (isAuthenticated && (to.name === 'login' || to.name === 'registration')) {
    return next({ name: 'home' })
  }
  // Redirect unauthenticated users to login if the route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    return next({ name: 'login' })
  }

  next()
})

export default router
