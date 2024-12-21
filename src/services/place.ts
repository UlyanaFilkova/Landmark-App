import { firestore, collection, addDoc, query, where, getDocs } from '@/services/firebase.config.js'
import { Place, Rating } from '@/types/interfaces'

const placesCollection = collection(firestore, 'places')
const ratingsCollection = collection(firestore, 'ratings')

export const addPlace = async (place: Omit<Place, 'id'>): Promise<{ id: string }> => {
  try {
    const placeDocRef = await addDoc(placesCollection, place)
    const rating: Omit<Rating, 'id'> = {
      rating: place.rating,
      userId: place.authorId,
      placeId: placeDocRef.id,
    }
    const ratingDocRef = await addDoc(ratingsCollection, rating)
    console.log(ratingDocRef.id)
    return { id: placeDocRef.id }
  } catch (error) {
    console.error('Error adding place:', error)
    throw new Error('Error adding place to Firestore')
  }
}
