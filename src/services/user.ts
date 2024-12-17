import {
  firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from '@/services/firebase.config.js'

interface User {
  id: string
  username: string
  password: string
  role: number
}

const usersCollection = collection(firestore, 'users')

export const checkUser = async (username: string, password: string): Promise<string> => {
  try {
    const q = query(usersCollection, where('username', '==', username))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]
      const userData = userDoc.data() as User

      const userId = userDoc.id

      if (userData.password === password) {
        // if passwords match
        localStorage.setItem('userId', userId)
        return ''
      }
    }
    // If the user is not found or the passwords do not match
    return 'Invalid email or password'
  } catch (error) {
    console.error('Error checking user:', error)
    return 'Error checking user'
  }
}

export const registerUser = async (username: string, password: string): Promise<boolean> => {
  try {
    const newUser: Omit<User, 'id'> = {
      username,
      password,
      role: 2,
    }

    const docRef = await addDoc(usersCollection, newUser)

    if (!docRef) {
      return false
    }

    localStorage.setItem('userId', docRef.id)
    return true
  } catch (error) {
    console.error('Error registering user:', error)
    return false
  }
}

export const checkUsernameExists = async (username: string): Promise<boolean> => {
  try {
    const q = query(usersCollection, where('username', '==', username))
    const querySnapshot = await getDocs(q)
    return !querySnapshot.empty // true if user exists
  } catch (error) {
    console.error('Error checking username existence:', error)
    return false
  }
}

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDocRef = doc(firestore, `users/${userId}`)
    const userDocSnap = await getDoc(userDocRef)
    if (userDocSnap.exists()) {
      console.log(userDocSnap)
      const userData = userDocSnap.data()
      return { id: userDocSnap.id, role: userData.role } as User
    } else {
      return null
    }
  } catch (error) {
    console.error('Error getting user by ID:', error)
    throw new Error('Error getting user by ID')
  }
}
