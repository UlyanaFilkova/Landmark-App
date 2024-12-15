import { firestore, collection, addDoc, query, where, getDocs } from '@/services/firebase.config.js'

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
      const userData = querySnapshot.docs[0].data() as User

      if (userData.password === password) {
        // if passwords match
        localStorage.setItem('userId', userData.id)
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
