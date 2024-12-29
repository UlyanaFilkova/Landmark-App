import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { getPlacesData, getRatingsData } from '@/services/map'
import { addPlace, addRating, updatePlace, deletePlace } from '@/services/place'

import { useUserStore } from './userStore'

import type { Place, Rating } from '@/types/interfaces'

export const useMapStore = defineStore('place', () => {
  const userStore = useUserStore()
  const userId = computed(() => userStore.userId)

  const places = ref<Place[]>([])
  const ratings = ref<Rating[]>([])
  const isDataLoaded = ref(false)

  const getPlaces = computed(() => places.value)
  const getRatings = computed(() => ratings.value)

  const getCurrentPlaceUserRating = (placeId: string) => {
    const userRating = ratings.value.find(
      (rating) => rating.placeId === placeId && rating.userId === userId.value,
    )
    return userRating ? userRating.rating : 0
  }

  const fetchPlaces = async () => {
    try {
      const fetchedPlaces = await getPlacesData()
      places.value = fetchedPlaces
      places.value.forEach((places) => (places.rating = parseFloat(places.rating.toFixed(1))))
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

  const setNewUserRating = async (ratingValue: number, place: Place) => {
    if (!userId.value || !place) return

    const rating: Omit<Rating, 'id'> = {
      rating: ratingValue,
      userId: userId.value,
      placeId: place.id,
    }
    isDataLoaded.value = false
    await addRating(rating)
    await Promise.all([fetchRatings(), fetchPlaces()])

    isDataLoaded.value = true
  }

  const loadUserRating = (place: Place) => {
    if (place) {
      const userRating = ratings.value.find(
        (rating) => rating.placeId === place!.id && rating.userId === userId.value,
      )
      if (userRating) {
        return userRating.rating
      } else {
        return 0
      }
    } else {
      console.error('place is not provided')
    }
  }

  const loadInitialData = async () => {
    await Promise.all([fetchPlaces(), userStore.fetchUser(), fetchRatings()])
    isDataLoaded.value = true
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

  const editPlace = async (placeId: string, placeData: Omit<Place, 'authorId' | 'id'>) => {
    try {
      if (!userId.value || !placeId) {
        throw new Error('User ID or Place ID is missing')
      }

      const response = await updatePlace(placeId, {
        ...placeData,
        authorId: userId.value,
      })

      if (response === 'success') {
        const placeIndex = places.value.findIndex((place) => place.id === placeId)
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
        return 'success'
      }
      return 'Error deleting place'
    } catch (error) {
      console.error('Error deleting place:', error)
      return 'Error deleting place'
    }
  }

  const resetStore = () => {
    places.value = []
    ratings.value = []
  }

  return {
    isDataLoaded,
    getPlaces,
    getRatings,
    getCurrentPlaceUserRating,
    fetchPlaces,
    fetchRatings,
    loadInitialData,
    loadUserRating,
    setNewUserRating,
    addNewPlace,
    editPlace,
    removePlace,
    resetStore,
  }
})
