import {
  firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  doc,
} from '@/services/firebase.config.js'
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
    await addDoc(ratingsCollection, rating)
    return { id: placeDocRef.id }
  } catch (error) {
    console.error('Error adding place:', error)
    throw new Error('Error adding place to Firestore')
  }
}

export const addRating = async (rating: Omit<Rating, 'id'>): Promise<{ id: string }> => {
  try {
    const ratingsQuery = query(
      ratingsCollection,
      where('placeId', '==', rating.placeId),
      where('userId', '==', rating.userId),
    )
    const ratingsSnapshot = await getDocs(ratingsQuery)

    let isNewRating = false
    let ratingDocRef

    if (!ratingsSnapshot.empty) {
      ratingDocRef = ratingsSnapshot.docs[0].ref
      await updateDoc(ratingDocRef, { rating: rating.rating })
      isNewRating = false
    } else {
      ratingDocRef = await addDoc(ratingsCollection, rating)
      isNewRating = true
    }
    console.log(isNewRating)
    await updatePlaceRating(rating.placeId, isNewRating)
    return { id: ratingDocRef.id }
  } catch (error) {
    console.error('Error adding or updating rating:', error)
    throw new Error('Error adding or updating rating in Firestore')
  }
}

const updatePlaceRating = async (placeId: string, isNewRating: boolean) => {
  try {
    const ratingsQuery = query(ratingsCollection, where('placeId', '==', placeId))
    const ratingsSnapshot = await getDocs(ratingsQuery)

    if (ratingsSnapshot.empty) {
      console.warn(`No ratings found for place ${placeId}`)
      return
    }

    let totalRating = 0
    let ratingCount = 0

    ratingsSnapshot.forEach((doc) => {
      const ratingData = doc.data() as Rating
      totalRating += ratingData.rating
      ratingCount++
    })

    const averageRating = ratingCount ? totalRating / ratingCount : 0

    const metricRating = calculateMetricRating(averageRating, ratingCount)

    const placeDocRef = doc(firestore, `places/${placeId}`)
    const placeDoc = await getDoc(placeDocRef)

    if (placeDoc.exists()) {
      const placeData = placeDoc.data() as Place
      const newRatingCount = isNewRating ? placeData.voices + 1 : placeData.voices

      await updateDoc(placeDocRef, {
        rating: averageRating,
        voices: newRatingCount,
      })
    }
  } catch (error) {
    console.error('Error updating place rating:', error)
    throw new Error('Error updating place rating in Firestore')
  }
}

const calculateMetricRating = (averageRating: number, ratingCount: number): number => {
  const k = 0.1

  const metricRating = averageRating * (1 - Math.exp(-k * ratingCount))

  return metricRating
}
