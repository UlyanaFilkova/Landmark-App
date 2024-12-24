import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getPlacesData, getRatingsData } from '@/services/map'
import { addPlace, addRating, updatePlace, deletePlace } from '@/services/place'
import { Place, Rating } from '@/types/interfaces'
import { useUserStore } from './userStore'

export const useMapStore = defineStore('place', () => {
  const places = ref<Place[]>([])
  const filteredPlaces = ref<Place[]>([])
  const ratings = ref<Rating[]>([])
  const currentPlace = ref<Place | undefined>(undefined)
  const currentPlaceUserRating = ref<number | undefined>(undefined)
  const onlyUserPlaces = ref<boolean>(false)

  const userStore = useUserStore()
  const userId = computed(() => userStore.getUser?.id)

  const getPlaces = computed(() => places.value)
  const getFilteredPlaces = computed(() => filteredPlaces.value)
  const getRatings = computed(() => ratings.value)
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
    } catch (error) {
      console.error(error)
    }
  }

  const setNewCurrentPlaceUserRating = async (value: number) => {
    if (!userId.value || !currentPlace.value) return

    currentPlaceUserRating.value = value
    const rating: Omit<Rating, 'id'> = {
      rating: value,
      userId: userId.value,
      placeId: currentPlace.value.id,
    }
    await addRating(rating)
    await Promise.all([fetchRatings(), fetchPlaces()])
  }

  const loadCurrentPlaceUserRating = () => {
    if (currentPlace.value) {
      const userRating = ratings.value.find(
        (rating) => rating.placeId === currentPlace.value!.id && rating.userId === userId.value,
      )
      if (userRating) {
        currentPlaceUserRating.value = userRating.rating
      }
    }
  }

  const loadInitialData = async () => {
    await Promise.all([fetchPlaces(), userStore.fetchUser(), fetchRatings()])
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
      if (!userId.value) {
        throw new Error('User ID is missing')
      }

      const response = await addPlace({ ...placeData, authorId: userId.value })

      if (response && response.id) {
        places.value.push({ ...placeData, authorId: userId.value, id: response.id })
        return 'success'
      }
      return 'Error adding new place'
    } catch (error) {
      console.error('Error adding new place:', error)
    }
  }

  const editPlace = async (placeData: Omit<Place, 'authorId' | 'id'>) => {
    try {
      if (!userId.value || !currentPlace.value) {
        throw new Error('User ID or Place ID is missing')
      }

      const response = await updatePlace(currentPlace.value.id, { ...placeData, authorId: userId.value })

      if (response === 'success') {
        const placeIndex = places.value.findIndex((place) => place.id === currentPlace.value!.id)
        if (placeIndex !== -1) {
          places.value[placeIndex] = { ...places.value[placeIndex], ...placeData }
          return 'success'
        }
        return 'Error updating place locally'
      }
      return 'Error editing place'
    } catch (error) {
      console.error('Error editing place:', error)
    }
  }

  const removePlace = async (placeId: string) => {
    try {
      const response = await deletePlace(placeId)
      if (response === 'success') {
        places.value = places.value.filter((place) => place.id !== placeId)
        ratings.value = ratings.value.filter((rating) => rating.placeId !== placeId)
        if (currentPlace.value?.id === placeId) {
          removeCurrentPlace()
        }
        return 'success'
      }
      return 'Error deleting place'
    } catch (error) {
      console.error('Error deleting place:', error)
      return 'Error deleting place'
    }
  }

  const setCurrentPlace = (place: Place) => {
    currentPlace.value = place
    localStorage.setItem('currentPlaceId', place.id)
    loadCurrentPlaceUserRating()
  }

  const removeCurrentPlace = () => {
    currentPlace.value = undefined
    localStorage.removeItem('currentPlaceId')
    currentPlaceUserRating.value = 0
  }

  const setOnlyUserPlaces = (value: boolean) => {
    onlyUserPlaces.value = value
    filterPlaces()
  }

  return {
    getPlaces,
    getFilteredPlaces,
    getRatings,
    getCurrentPlace,
    getOnlyUserPlaces,
    getCurrentPlaceUserRating,
    fetchPlaces,
    fetchRatings,
    loadInitialData,
    loadCurrentPlace,
    addNewPlace,
    editPlace,
    setCurrentPlace,
    removeCurrentPlace,
    setOnlyUserPlaces,
    setNewCurrentPlaceUserRating,
    removePlace,
  }
})
