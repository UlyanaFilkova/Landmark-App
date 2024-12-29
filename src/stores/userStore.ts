import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getUserById, checkUserAuthentication } from '@/services/user'
import router from '@/router'
import { useMapStore } from './mapStore'
import type { User } from '@/types/interfaces'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | undefined>(undefined)

  const userId = ref<string>('')
  const getUser = computed(() => user.value)

  const fetchUser = async () => {
    try {
      userId.value = checkUserAuthentication() || ''
      if (userId.value) {
        user.value = (await getUserById(userId.value)) as User
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const logout = () => {
    resetStore()
    useMapStore().resetStore()
    localStorage.removeItem('userId')
    router.push({ name: 'login' })
  }

  const resetStore = () => {
    user.value = undefined
  }

  return {
    getUser,
    userId,
    fetchUser,
    logout,
  }
})
