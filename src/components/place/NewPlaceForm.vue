<template>
  <div class="new-place-form">
    <h2>Add a New Place</h2>

    <form @submit.prevent="handleSubmit">
      <BaseInput
        v-model:modelValue="formData.title"
        type="text"
        id="title"
        label="Place Title"
        
        :maxlength="100"
        :required="true"
      />

      <BaseInput
        v-model:modelValue="formData.description"
        type="text"
        id="description"
        label="Description"
        
        :maxlength="1000"
        :required="true"
      />

      <BaseInput
        v-model:modelValue="formData.rating"
        type="number"
        id="rating"
        label="Your Rating"
        :min="1"
        :max="5"
        :step="0.1"
        placeholder="Rate the place (1.0-5.0)"
      />

      <LocationInput v-model:latitude="formData.latitude" v-model:longitude="formData.longitude" />

      <FileInput
        v-model:modelValue="formData.photos"
        id="photos"
        label="Upload Photos"
        :maxFiles="5"
      />

      <button type="submit">Add Place</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import L from 'leaflet'
import { Place } from '@/types/interfaces'
import LocationInput from '@/components/place/LocationInput.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import FileInput from '@/components/base/FileInput.vue'

const formData = ref({
  id: '',
  title: '',
  description: '',
  latitude: 53.9,
  longitude: 27.5667,
  photos: [] as File[],
  rating: 1,
  authorId: '',
})

const mapContainer = ref<HTMLDivElement | null>(null)
const map = ref<L.Map>()
const marker = ref<L.Marker>()

const isPhotoLimitReached = computed(() => formData.value.photos.length >= 5)

const locationInvalid = computed(
  () =>
    formData.value.latitude < -90 ||
    formData.value.latitude > 90 ||
    formData.value.longitude < -180 ||
    formData.value.longitude > 180,
)
const photoTypeInvalid = ref(false)

const handlePhotoChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const files = Array.from(input.files)
    const invalidFiles = files.filter((file) => !file.type.startsWith('image/'))
    if (invalidFiles.length > 0) {
      photoTypeInvalid.value = true
      return
    }
    photoTypeInvalid.value = false
    const totalPhotos = formData.value.photos.length + files.length
    if (totalPhotos > 5) {
      alert('You can upload up to 5 photos.')
      return
    }
    formData.value.photos.push(...files)
    input.value = ''
  }
}

const removePhoto = (index: number) => {
  formData.value.photos.splice(index, 1)
}

const handleSubmit = () => {
  if (
    formData.value.title &&
    formData.value.description &&
    !locationInvalid.value &&
    formData.value.rating >= 1 &&
    formData.value.rating <= 5 &&
    formData.value.photos.length <= 5 &&
    !photoTypeInvalid.value
  ) {
    const place: Place = {
      ...formData.value,
      location: [formData.value.latitude, formData.value.longitude],
    }
    console.log('New Place Data:', place)
  } else {
    alert('Please fill out all fields correctly.')
  }
}

const triggerFileInput = () => {
  const fileInput = document.getElementById('photos') as HTMLInputElement
  if (fileInput) {
    fileInput.click()
  }
}

onMounted(() => {
  if (mapContainer.value) {
    map.value = L.map(mapContainer.value).setView([53.9, 27.5667], 11)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)

    map.value.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      formData.value.latitude = lat
      formData.value.longitude = lng

      if (marker.value) {
        marker.value.setLatLng(e.latlng)
      } else {
        marker.value = L.marker(e.latlng).addTo(map.value)
      }
    })
  }
})
</script>

<style scoped>
.new-place-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.new-place-form h2 {
  text-align: center;
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

.map-container {
  height: 300px;
  width: 100%;
  border: 3px solid #aaa;
  border-radius: 5px;
  margin-top: 20px;
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
</style>
