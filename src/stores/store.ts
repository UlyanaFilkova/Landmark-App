import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getPlacesData, getRatingsData } from '@/services/map'
import { getUserById } from '@/services/user'
import { Place, User } from '@/types/interfaces'


interface Rating {
  rating: number
  placeId: string
  userId: string
}

export const useMapStore = defineStore('map', () => {
  const places = ref<Place[]>([])
  const ratings = ref<Rating[]>([])
  const user = ref<User>()

  const userId = computed(() => localStorage.getItem('userId'))
  const getPlaces = computed(() => places.value)
  const getRatings = computed(() => ratings.value)
  const getUser = computed(() => user.value)

  const fetchPlaces = async () => {
    try {
      const fetchedPlaces = await getPlacesData()
      places.value = fetchedPlaces
    } catch (error) {
      console.error(error)
    }
  }

  const fetchRatings = async () => {
    try {
      const fetchedRatings = await getRatingsData()
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
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const loadInitialData = async () => {
    await fetchUser()
    await fetchPlaces()
    await fetchRatings()
  }

  return {
    getPlaces,
    getRatings,
    getUser,
    fetchPlaces,
    fetchRatings,
    loadInitialData,
  }
})
