import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getUserById } from '@/services/user'
import router from '@/router'
import { useMapStore } from './mapStore'
import type { User } from '@/types/interfaces'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | undefined>(undefined)

  const userId = computed(() => localStorage.getItem('userId'))
  const getUser = computed(() => user.value)

  const fetchUser = async () => {
    try {
      const userIdValue = userId.value
      if (userIdValue) {
        user.value = (await getUserById(userIdValue)) as User
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
    fetchUser,
    logout,
  }
})
