import { firestore, collection, addDoc, query, where, getDocs } from '@/services/firebase.config.js'

interface Place {
  title: string
  description: string
  location: [number, number]
  rating: number
  authorId: string
}
interface Rating {
  rating: number
  placeId: string
  userId: string
}

const placesCollection = collection(firestore, 'places')
const ratingsCollection = collection(firestore, 'ratings')

export const getPlacesData = async (): Promise<Place[]> => {
  try {
    const querySnapshot = await getDocs(placesCollection)
    const places: Place[] = querySnapshot.docs.map((doc) => doc.data() as Place)
    return places
  } catch (error) {
    console.error('Error getting places:', error)
    throw new Error('Error getting places')
  }
}

export const getRatingsData = async (): Promise<Rating[]> => {
  try {
    const querySnapshot = await getDocs(ratingsCollection)
    const ratings: Rating[] = querySnapshot.docs.map((doc) => doc.data() as Rating)
    return ratings
  } catch (error) {
    console.error('Error getting ratings:', error)
    throw new Error('Error getting ratings')
  }
}
