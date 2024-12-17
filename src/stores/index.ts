import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getPlaces, getRatings } from '@/services/map'
import { getUserById } from '@/services/user'

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
  const ratings = ref<Rating[]>([])
  const user = ref<User>()
  const isLoading = ref<boolean>(false)

  const userId = computed(() => localStorage.getItem('userId'))

  const fetchPlaces = async () => {
    try {
      const fetchedPlaces = await getPlaces()
      places.value = fetchedPlaces
    } catch (error) {
      console.error(error)
    }
  }

  const fetchRatings = async () => {
    try {
      const fetchedRatings = await getRatings()
      ratings.value = fetchedRatings
    } catch (error) {
      console.error(error)
    }
  }

  const fetchUser = async () => {
    try {
      const userIdValue = userId.value
      if (userIdValue) {
        user.value = (await getUserById(userIdValue)) as User
        console.log(user)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const loadInitialData = async () => {
    console.log('start initialising')
    await fetchUser()
    await fetchPlaces()
    await fetchRatings()
  }

  return {
    places,
    ratings,
    isLoading,
    user,
    fetchPlaces,
    fetchRatings,
    loadInitialData,
  }
})
