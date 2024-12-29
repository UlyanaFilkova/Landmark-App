import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { getUserById, checkUserAuthentication } from '@/services/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  },
})

router.beforeEach(async (to, from, next) => {
  const userId = (await checkUserAuthentication()) || ''
  const isUserAuthenticated = userId.length > 0

  if (
    isUserAuthenticated &&
    (to.name === 'login' || to.name === 'registration' || to.name === '')
  ) {
    return next({ name: 'generalMap' })
  }

  if (to.matched.some((record) => record.meta.requiresAuth) && !isUserAuthenticated) {
    return next({ name: 'login' })
  }

  next()
})

export default router
