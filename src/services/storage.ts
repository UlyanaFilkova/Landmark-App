import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import {
  addDoc,
  collection,
  Firestore,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
} from 'firebase/firestore'
import { storage, firestore } from '@/services/firebase.config.js'

async function fetchImages(placeId: number) {
  try {
    const q = query(collection(firestore, 'places'), where('id', '==', placeId))
    const snapshot = await getDocs(q)
    console.log(snapshot.docs)
    const images = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return images
  } catch (error) {
    console.error('Ошибка при получении изображений: ', error)
    throw error
  }
}

async function uploadImage(file: File, placeId: string): Promise<string> {
  const storageRef = ref(storage, `images/${file.name}`)

  try {
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)

    const q = query(collection(firestore, 'places'), where('id', '==', placeId))
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      const placeDocRef = doc(firestore, 'places', snapshot.docs[0].id)

      await updateDoc(placeDocRef, {
        images: arrayUnion({ url: downloadURL }),
      })

      return placeDocRef.id
    } else {
      throw new Error('Place not found')
    }
  } catch (error) {
    console.error('Ошибка при загрузке изображения: ', error)
    throw error
  }
}

export { uploadImage }
