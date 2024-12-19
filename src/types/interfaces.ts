export interface Place {
  title: string
  description: string
  location: [number, number]
  rating: number
  authorId: string
}

export interface FullUser {
  id: string
  username: string
  password: string
  role: number
}

export interface User {
  id: string
  role: number
}

export interface Rating {
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