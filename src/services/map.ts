import { firestore, collection, query, where, getDocs } from '@/firebase/firebase.config'
import type { Place, Rating } from '@/types/interfaces'

const placesCollection = collection(firestore, 'places')
const ratingsCollection = collection(firestore, 'ratings')

export const getPlacesData = async (): Promise<Place[]> => {
  try {
    const querySnapshot = await getDocs(placesCollection)
    const places: Place[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Place
      data.id = doc.id
      return data
    })
    return places
  } catch (error) {
    console.error('Error getting places:', error)
    throw new Error('Error getting places')
  }
}

export const getFilteredPlacesData = async (userId: string): Promise<Place[]> => {
  try {
    const placesQuery = query(placesCollection, where('authorId', '==', userId))

    const querySnapshot = await getDocs(placesQuery)

    const places: Place[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Place
      data.id = doc.id
      return data
    })

    return places
  } catch (error) {
    console.error('Error getting filtered places:', error)
    throw new Error('Error getting filtered places')
  }
}

export const getRatingsData = async (): Promise<Rating[]> => {
  try {
    const querySnapshot = await getDocs(ratingsCollection)
    const ratings: Rating[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Rating
      data.id = doc.id
      return data
    })
    return ratings
  } catch (error) {
    console.error('Error getting ratings:', error)
    throw new Error('Error getting ratings')
  }
}
