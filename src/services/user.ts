import {
  firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from '@/firebase/firebase.config'
import { auth } from '@/firebase/firebase.config'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getIdToken,
  onAuthStateChanged,
} from 'firebase/auth'

import type { User as FBUser } from 'firebase/auth'
import type { FullUser, User } from '@/types/interfaces'

const usersCollection = collection(firestore, 'users')

const saveTokenInCookies = async (user: FBUser) => {
  const idToken = await getIdToken(user)
  document.cookie = `idToken=${idToken}; path=/; Secure; SameSite=Strict`
}

const getTokenFromCookies = () => {
  const name = 'idToken='
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

export const checkUserAuthentication = async (): Promise<string | void> => {
  const idToken = getTokenFromCookies()

  if (idToken) {
    return new Promise<string>((resolve, reject) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const token = await user.getIdToken()
            if (token === idToken) {
              const userId = user.uid

              resolve(userId)
            } else {
              console.log('Token mismatch')
              reject('Token mismatch')
            }
          } catch (error) {
            console.error('Error verifying token', error)
            reject('Error verifying token')
          }
        } else {
          console.log('User not authenticated')
          reject('User not authenticated')
        }
      })
    })
  } else {
    console.log('Token not found in cookies')
  }
}

export const checkUser = async (username: string, password: string): Promise<string> => {
  try {
    const q = query(usersCollection, where('username', '==', username))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]
      const userData = userDoc.data() as FullUser

      const email = userData.username
      try {
        await signOut(auth)

        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        await saveTokenInCookies(user)
        return ''
      } catch {
        return 'Invalid email or password'
      }
    }

    return 'Invalid email or password'
  } catch (error) {
    console.error('Error checking user:', error)
    return 'Error checking user'
  }
}

// export const checkUser = async (username: string, password: string): Promise<string> => {
//   try {
//     const q = query(usersCollection, where('username', '==', username))
//     const querySnapshot = await getDocs(q)

//     if (!querySnapshot.empty) {
//       const userDoc = querySnapshot.docs[0]
//       const userData = userDoc.data() as FullUser

//       const userId = userDoc.id

//       if (userData.password === password) {
//         // if passwords match
//         localStorage.setItem('userId', userId)
//         return ''
//       }
//     }
//     // If the user is not found or the passwords do not match
//     return 'Invalid email or password'
//   } catch (error) {
//     console.error('Error checking user:', error)
//     return 'Error checking user'
//   }
// }

export const registerUser = async (username: string, password: string): Promise<boolean> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, username, password)
    const uid = userCredential.user.uid

    const newUser: FullUser = {
      username,
      role: 2,
      uid,
    }

    await addDoc(usersCollection, { ...newUser })

    await saveTokenInCookies(userCredential.user)

    return true
  } catch (error) {
    console.error('Error registering user:', error)
    return false
  }
}

// export const registerUser = async (username: string, password: string): Promise<boolean> => {
//   try {
//     const newUser: Omit<FullUser, 'id'> = {
//       username,
//       password,
//       role: 2,
//     }

//     const docRef = await addDoc(usersCollection, newUser)

//     if (!docRef) {
//       return false
//     }

//     localStorage.setItem('userId', docRef.id)
//     return true
//   } catch (error) {
//     console.error('Error registering user:', error)
//     return false
//   }
// }

export const checkUsernameExists = async (username: string): Promise<boolean> => {
  try {
    const q = query(usersCollection, where('username', '==', username))
    const querySnapshot = await getDocs(q)
    return !querySnapshot.empty
  } catch (error) {
    console.error('Error checking username existence:', error)
    return false
  }
}

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const q = query(usersCollection, where('uid', '==', userId))
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]
      const userData = userDoc.data() as FullUser

      const id = userData.uid
      const role = userData.role
      return { id, role } as User
    } else {
      return null
    }
  } catch (error) {
    console.error('Error getting user by ID:', error)
    throw new Error('Error getting user by ID')
  }
}
