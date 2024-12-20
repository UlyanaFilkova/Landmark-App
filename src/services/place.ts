import { firestore, collection, addDoc, query, where, getDocs } from '@/services/firebase.config.js'
import { Place, Rating } from '@/types/interfaces'

const placesCollection = collection(firestore, 'places')
const ratingsCollection = collection(firestore, 'ratings')

export const addPlace = async (place: Omit<Place, 'id'>): Promise<{ id: string }> => {
    try {
      const docRef = await addDoc(placesCollection, place)
      return { id: docRef.id }
    } catch (error) {
      console.error('Error adding place:', error)
      throw new Error('Error adding place to Firestore')
    }
  }