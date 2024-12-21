<template>
  <h2>Add a new place</h2>
  <form @submit.prevent="handleSubmit" class="new-place-form">
    <BaseInput
      v-model:modelValue="formData.title"
      type="text"
      id="title"
      label="Title"
      :maxlength="100"
      :required="true"
    />

    <BaseTextarea
      v-model:modelValue="formData.description"
      type="text"
      id="description"
      label="Description"
      :maxlength="1000"
      :required="true"
    />

    <LocationInput
      v-model:latitude="formData.latitude"
      v-model:longitude="formData.longitude"
      :locationInvalid="locationInvalid"
    />

    <label>Rating:</label>
    <StarRating :rating="formData.rating" :readonly="false" @update:rating="updateRating" class="star-rating"/>

    <FileInput
      v-model:modelValue="formData.photos"
      id="photos"
      label="Upload Photos:"
      :maxFiles="5"
      :isFileLimitReached="isFileLimitReached"
      :warningMessage="'Maximum 5 photos'"
      :fileTypeInvalid="fileTypeInvalid"
      :errorMessage="'One or more files are not valid images'"
      :isDisabled="isFileLimitReached || fileTypeInvalid"
    />

    <button type="submit">Add Place</button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Place } from '@/types/interfaces'
import LocationInput from '@/components/place/LocationInput.vue'
import StarRating from '@/components/base/StarRating.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import FileInput from '@/components/base/FileInput.vue'
import { useMapStore } from '@/stores/store'
import { useRouter } from 'vue-router'
import BaseTextarea from '@/components/base/BaseTextarea.vue'

const initialFormData = {
  title: '',
  description: '',
  latitude: 53.9,
  longitude: 27.5667,
  photos: [] as File[],
  rating: 5,
}

const formData = ref({ ...initialFormData })

const locationInvalid = computed(
  () =>
    formData.value.latitude < -90 ||
    formData.value.latitude > 90 ||
    formData.value.longitude < -180 ||
    formData.value.longitude > 180,
)

const isFileLimitReached = computed(() => formData.value.photos.length >= 5)
const fileTypeInvalid = ref(false)

const updateRating = (value: number) => {
  formData.value.rating = value
}

const store = useMapStore()
const router = useRouter()

const handleSubmit = async () => {
  if (
    formData.value.title &&
    formData.value.description &&
    !locationInvalid.value &&
    formData.value.rating >= 1 &&
    formData.value.rating <= 5 &&
    formData.value.photos.length <= 5 &&
    !fileTypeInvalid.value
  )
    try {
      const base64Photos = await convertFilesToBase64(formData.value.photos)

      const place: Omit<Place, 'authorId' | 'id'> = {
        title: formData.value.title,
        description: formData.value.description,
        rating: formData.value.rating,
        photos: base64Photos,
        location: [formData.value.latitude, formData.value.longitude],
      }

      const result = await store.addNewPlace(place)
      if (result === 'success') {
        router.push({ name: 'generalMap' })
        clearForm()
      }
    } catch (error) {
      console.error('Error converting files to Base64:', error)
    }
  else {
    alert('Please fill out all fields correctly.')
  }
}

const convertFilesToBase64 = (files: File[]): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    if (files.length === 0) {
      resolve([])
      return
    }

    const base64Files: string[] = []
    let processedCount = 0

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        base64Files.push(reader.result as string)
        processedCount++
        if (processedCount === files.length) {
          resolve(base64Files)
        }
      }

      reader.onerror = (error) => {
        reject(error)
      }

      reader.readAsDataURL(file)
    })
  })
}

const clearForm = (): void => {
  formData.value = { ...initialFormData }
}
</script>

<style scoped>
h2 {
  text-align: center;
  font-size: 24px;
  margin: -10px 0 20px 0;
}
.new-place-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

.form-group-inline {
  display: flex;
  gap: 10px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

.custom-file-upload {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.custom-file-upload input[type='file'] {
  position: absolute;
  opacity: 0;
  right: 0;
  top: 0;
}

ul {
  padding: 0;
  list-style: none;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

li button {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 16px;
}

.error-message {
  color: red;
  font-size: 12px;
}

.star-rating{
  margin-bottom: 10px;
}
</style>
