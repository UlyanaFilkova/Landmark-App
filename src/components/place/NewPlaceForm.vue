<template>
  <h2>{{ headerText }}</h2>
  <form @submit.prevent="handleSubmit" class="new-place-form">
    <BaseInput
      v-model:modelValue="formData.title"
      type="text"
      id="title"
      label="Title"
      :maxlength="70"
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
    <StarRating
      :rating="formData.rating"
      :readonly="false"
      @update:rating="updateRating"
      :increment="0.5"
      :starSize="30"
      textClass="big"
      class="star-rating"
    />

    <FileInput
      v-model:modelValue="formData.photos"
      id="photos"
      label="Photos:"
      :maxFiles="5"
      :isFileLimitReached="isFileLimitReached"
      :warningMessage="'Maximum 5 photos'"
      :fileTypeInvalid="fileTypeInvalid"
      :errorMessage="'One or more files are not valid images'"
      :isDisabled="isFileLimitReached || fileTypeInvalid"
    />

    <BaseButton
      :text="buttonText"
      class="medium-button"
      :disabled="isSubmitButtonDisabled"
    ></BaseButton>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import LocationInput from '@/components/place/LocationInput.vue'
import StarRating from '@/components/base/StarRating.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import FileInput from '@/components/base/FileInput.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'

import { useMapStore } from '@/stores/mapStore.ts'
import { convertFilesToBase64, convertBase64ToFiles } from '@/utils/typeConversion.ts'

import type { Place } from '@/types/interfaces.ts'

const store = useMapStore()
const router = useRouter()

const props = defineProps<{
  isEditing: boolean
  place?: Place | null
}>()

const initialFormData = {
  title: '',
  description: '',
  latitude: 53.9,
  longitude: 27.5667,
  photos: [] as File[],
  rating: store.getCurrentPlaceUserRating || 5,
}

const headerText = ref('')
const buttonText = ref('Add place')

const formData = ref({ ...initialFormData })
const originalFormData = ref({ ...initialFormData })

const locationInvalid = computed(
  () =>
    formData.value.latitude < -90 ||
    formData.value.latitude > 90 ||
    formData.value.longitude < -180 ||
    formData.value.longitude > 180,
)

const isFileLimitReached = computed(() => formData.value.photos.length >= 5)
const fileTypeInvalid = ref(false)

const isSubmitButtonDisabled = computed(() => {
  if (props.isEditing) {
    return !isFormDataChanged.value || !isFormValid.value
  } else {
    return !isFormValid.value
  }
})

const isFormDataChanged = computed(() => {
  return (
    formData.value.title !== originalFormData.value.title ||
    formData.value.description !== originalFormData.value.description ||
    formData.value.latitude !== originalFormData.value.latitude ||
    formData.value.longitude !== originalFormData.value.longitude ||
    formData.value.rating !== originalFormData.value.rating ||
    !areFilesEqual(formData.value.photos, originalFormData.value.photos)
  )
})

const isFormValid = computed(() => {
  return (
    formData.value.title &&
    formData.value.description &&
    !locationInvalid.value &&
    formData.value.rating >= 0 &&
    formData.value.rating <= 5 &&
    formData.value.photos.length <= 5 &&
    !fileTypeInvalid.value
  )
})

const areFilesEqual = (files1: File[], files2: File[]) => {
  if (files1.length !== files2.length) return false
  for (let i = 0; i < files1.length; i++) {
    if (files1[i].name !== files2[i].name || files1[i].size !== files2[i].size) return false
  }
  return true
}

const updateRating = (value: number) => {
  formData.value.rating = value
}

const handleSubmit = async () => {
  if (isFormValid.value) {
    try {
      const base64Photos = await convertFilesToBase64(formData.value.photos)

      const place: Omit<Place, 'authorId' | 'id'> = {
        title: formData.value.title,
        description: formData.value.description,
        rating: formData.value.rating,
        photos: base64Photos,
        location: [formData.value.latitude, formData.value.longitude],
        voices: 1,
      }

      const result = props.isEditing ? await store.editPlace(place) : await store.addNewPlace(place)
      if (result === 'success') {
        router.push({ name: 'generalMap' })
        clearForm()
      }
    } catch (error) {
      console.error('Error converting files to Base64:', error)
    }
  } else {
    alert('Please fill out all fields correctly.')
  }
}

const clearForm = (): void => {
  formData.value = { ...initialFormData }
}

const loadCurrentPlace = () => {
  if (props.isEditing && props.place) {
    formData.value.title = props.place.title
    formData.value.description = props.place.description
    formData.value.latitude = props.place.location[0]
    formData.value.longitude = props.place.location[1]
    formData.value.rating = store.getCurrentPlaceUserRating || 0
    formData.value.photos = convertBase64ToFiles(props.place.photos || [])

    originalFormData.value = { ...formData.value }
    headerText.value = 'Edit place'
    buttonText.value = 'Save place'
  } else {
    headerText.value = 'Add a new place'
  }
}

watch(
  () => props.place,
  () => {
    if (props.place != null) {
      loadCurrentPlace()
    }
  },
  { immediate: true },
)
</script>

<style scoped>
h2 {
  text-align: center;
  font-size: 24px;
  margin: -20px 0 20px 0;
}
.new-place-form {
  margin: 0 auto 30px;
  padding: 20px;
  border: 1px solid var(--color-block-border);
  border-radius: 8px;
  background-color: var(--color-block-background);
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
  border: 1px solid var(--color-border-one);
  border-radius: 4px;
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

.error-message {
  color: var(--color-invalid-input);
  font-size: 12px;
}

.star-rating {
  margin-bottom: 10px;
}
</style>
