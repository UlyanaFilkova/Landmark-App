<template>
  <div class="file-input">
    <label>{{ label }}</label>
    <div
      class="drop-area"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
      :class="{ dragover: isDragOver }"
    >
      <input
        @change="handleFileChange"
        type="file"
        :id="id"
        :accept="accept"
        :multiple="multiple"
        :disabled="isDisabled"
      />
      <BaseButton
        type="button"
        @click="triggerFileInput"
        :disabled="isDisabled"
        :text="buttonText"
        class="small-button grey"
      >
      </BaseButton>
      <p v-if="isFileLimitReached" class="warning-message">{{ warningMessage }}</p>
      <p class="drop-area-text">Drag and drop files here, or click the button to upload.</p>
    </div>
    <div v-if="modelValue.length > 0">
      <label>Uploaded files:</label>
      <ul>
        <li v-for="(file, index) in modelValue" :key="index">
          <div class="file-container">
            <img :src="getFileUrl(file)" @click="showImage(index)" class="uploaded-image" />
            {{ file.name }}
          </div>

          <button type="button" @click="removeFile(index)">✖</button>
        </li>
      </ul>
    </div>
    <p v-if="fileTypeInvalid" class="error-message">{{ errorMessage }}</p>
    <vue-easy-lightbox
      :visible="visible"
      :imgs="imageUrls"
      :index="currentImageIndex"
      @hide="handleHide"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import VueEasyLightbox from 'vue-easy-lightbox'

const props = defineProps({
  modelValue: {
    type: Array as () => File[],
    default: () => [],
  },
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  accept: {
    type: String,
    default: 'image/*',
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  maxFiles: {
    type: Number,
    default: 5,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  buttonText: {
    type: String,
    default: 'Choose Files',
  },
  isFileLimitReached: {
    type: Boolean,
    default: false,
  },
  warningMessage: {
    type: String,
    default: '',
  },
  fileTypeInvalid: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const isDragOver = ref(false)
const visible = ref(false)
const currentImageIndex = ref(0)
const imageUrls = computed(() => props.modelValue.map((file) => URL.createObjectURL(file)))

const getFileUrl = (file: File) => URL.createObjectURL(file)

const showImage = (index: number) => {
  currentImageIndex.value = index
  visible.value = true
}

const handleHide = () => {
  visible.value = false
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const newFiles = Array.from(input.files)
    const updatedFiles = [...props.modelValue, ...newFiles]
    emit('update:modelValue', updatedFiles)
  }
}

const removeFile = (index: number) => {
  const newFiles = [...props.modelValue]
  newFiles.splice(index, 1)
  emit('update:modelValue', newFiles)
}

const triggerFileInput = () => {
  const fileInput = document.getElementById(props.id) as HTMLInputElement
  if (fileInput) {
    fileInput.click()
  }
}

const handleDragOver = () => {
  if (!props.isDisabled) {
    isDragOver.value = true
  }
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  if (!props.isDisabled && event.dataTransfer && event.dataTransfer.files.length > 0) {
    const newFiles = Array.from(event.dataTransfer.files)
    const updatedFiles = [...props.modelValue, ...newFiles]
    emit('update:modelValue', updatedFiles)
  }
}
</script>

<style scoped>
.file-input {
  margin-bottom: 15px;
}

.drop-area {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border: 2px dashed #ccc;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 10px;
}

.drop-area.dragover {
  background-color: #f0f0f0;
  border-color: #333;
}

.drop-area input[type='file'] {
  position: absolute;
  cursor: pointer;
  opacity: 0;
  right: 0;
  top: 0;
}

.drop-area-text {
  margin-top: 10px;
  font-size: 14px;
  color: #555;
}

ul {
  padding: 0;
  list-style: none;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.file-container {
  display: flex;
  align-items: center;
}

li button {
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  font-size: 16px;
}

.error-message {
  color: red;
  font-size: 12px;
}

.warning-message {
  color: #555;
  font-size: 12px;
  margin-top: 5px;
}

label {
  font-weight: 600;
  display: block;
  margin-bottom: 10px;
}

.uploaded-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 3px;
}
</style>
