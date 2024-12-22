import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getPlacesData, getRatingsData } from '@/services/map'
import { getUserById } from '@/services/user'
import { addPlace, addRating } from '@/services/place'
import { Place, User, Rating } from '@/types/interfaces'
import router from '@/router'

export const useMapStore = defineStore('map', () => {
  const places = ref<Place[]>([])
  const filteredPlaces = ref<Place[]>([])
  const ratings = ref<Rating[]>([])
  const user = ref<User>()
  const currentPlace = ref<Place | undefined>()
  const currentPlaceUserRating = ref<number>()
  const onlyUserPlaces = ref<Boolean>(false)

  const userId = computed(() => localStorage.getItem('userId'))
  const getPlaces = computed(() => places.value)
  const getFilteredPlaces = computed(() => filteredPlaces.value)
  const getRatings = computed(() => ratings.value)
  const getUser = computed(() => user.value)
  const getCurrentPlace = computed(() => currentPlace.value)
  const getOnlyUserPlaces = computed(() => onlyUserPlaces.value)
  const getCurrentPlaceUserRating = computed(() => currentPlaceUserRating.value)

  const fetchPlaces = async () => {
    try {
      const fetchedPlaces = await getPlacesData()
      places.value = fetchedPlaces
      places.value.forEach((places) => (places.rating = parseFloat(places.rating.toFixed(1))))
      filterPlaces()
    } catch (error) {
      console.error(error)
    }
  }

  const filterPlaces = () => {
    if (onlyUserPlaces.value) {
      filteredPlaces.value = places.value.filter((place) => place.authorId === userId.value)
    } else {
      filteredPlaces.value = places.value
    }
  }

  const fetchRatings = async () => {
    try {
      const fetchedRatings = await getRatingsData()
      ratings.value = fetchedRatings
      // ratings.value.forEach((rating) => (rating.rating = parseFloat(rating.rating.toFixed(1))))
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

  const setNewCurrentPlaceUserRating = async (value: number) => {
    currentPlaceUserRating.value = value
    const rating: Omit<Rating, 'id'> = {
      rating: value,
      userId: userId.value!,
      placeId: currentPlace.value!.id,
    }
    await addRating(rating)
    await fetchRatings()
  }

  const loadCurrentPlaceUserRating = () => {
    if (currentPlace.value) {
      const userRating = ratings.value.find(
        (rating) => rating.placeId === currentPlace.value!.id && rating.userId === user.value!.id,
      )
      if (userRating) {
        setNewCurrentPlaceUserRating(userRating.rating)
      }
    }
  }

  const loadInitialData = async () => {
    await fetchUser()
    await fetchPlaces()
    await fetchRatings()
    loadCurrentPlace()
  }

  const loadCurrentPlace = () => {
    const currentPlaceId = localStorage.getItem('currentPlaceId')
    if (currentPlaceId) {
      currentPlace.value = places.value.find((place) => place.id === currentPlaceId)
    }
    loadCurrentPlaceUserRating()
  }

  const addNewPlace = async (placeData: Omit<Place, 'authorId' | 'id'>) => {
    try {
      const authorId = userId.value
      if (!authorId) {
        throw new Error('User ID is missing')
      }

      const response = await addPlace({ ...placeData, authorId })

      if (response && response.id) {
        places.value.push({ ...placeData, authorId, id: response.id })
        return 'success'
      }
      return 'Error adding new place'
    } catch (error) {
      console.error('Error adding new place:', error)
    }
  }

  const setCurrentPlace = (place: Place) => {
    currentPlace.value = place
    localStorage.setItem('currentPlaceId', place.id)
  }
  const removeCurrentPlace = () => {
    currentPlace.value = undefined
    localStorage.removeItem('currentPlaceId')
  }
  const logout = () => {
    localStorage.removeItem('userId')
    router.push({ name: 'login' })
    resetStore()
  }
  const resetStore = () => {
    places.value = []
    ratings.value = []
    user.value = undefined
    currentPlace.value = undefined
  }
  const setOnlyUserPlaces = (value: Boolean) => {
    onlyUserPlaces.value = value
    filterPlaces()
  }

  return {
    getPlaces,
    getRatings,
    getUser,
    getCurrentPlace,
    getOnlyUserPlaces,
    getFilteredPlaces,
    getCurrentPlaceUserRating,
    fetchPlaces,
    fetchRatings,
    loadInitialData,
    loadCurrentPlace,
    addNewPlace,
    setCurrentPlace,
    removeCurrentPlace,
    logout,
    setOnlyUserPlaces,
    setNewCurrentPlaceUserRating,
  }
})
