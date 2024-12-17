import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Place {
  title: string
  description: string
  location: [number, number]
  rating: number
  authorId: string
}

interface User {
  id: string
  role: number
}

interface Rating {
  rating: number
  placeId: string
  userId: string
}

export const useMapStore = defineStore('map', () => {
  const places = ref<Place[]>([])

  const user = computed(() => localStorage.getItem('userId'))


  return {
    places,
    user,
  }
})
