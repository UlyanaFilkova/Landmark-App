export interface Place {
  id: string
  title: string
  description: string
  location: [number, number]
  photos: string[]
  rating: number
  voices: number
  authorId: string
}

export interface FullUser {
  uid: string
  username: string
  role: number
}

export interface User {
  id: string
  role: number
}

export interface Rating {
  id: string
  rating: number
  placeId: string
  userId: string
}

export interface InputField {
  model: string
  type: string
  placeholder: string
  name: string
  autocomplete: string
  required: boolean
  errorMessage: string
}
