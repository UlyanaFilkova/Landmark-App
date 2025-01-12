<template>
  <div class="file-input">
    <label>{{ t('inputs.fileInput.label') }}:</label>
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
        :text="t('inputs.fileInput.buttonText')"
        class="small-button grey"
      >
      </BaseButton>
      <p v-if="isFileLimitReached" class="warning-message">
        {{ t('inputs.fileInput.warningMessage') }}
      </p>
      <p class="drop-area-text">{{ t('inputs.fileInput.dragAndDropText') }}</p>
    </div>
    <div v-if="modelValue.length > 0">
      <label>{{ t('inputs.fileInput.uploadedFiles') }}:</label>
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
    <p v-if="fileTypeInvalid" class="error-message">{{ t('inputs.fileInput.errorMessage') }}</p>
    <p v-if="fileSizeError" class="error-message">{{ t('inputs.fileInput.fileSizeError') }}</p>
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
import VueEasyLightbox from 'vue-easy-lightbox'
import { useI18n } from 'vue-i18n'

import BaseButton from '@/components/base/BaseButton.vue'

import { convertFileToBase64, getFileUrl } from '@/utils/typeConversion.ts'

const { t } = useI18n()

interface Props {
  modelValue: File[]
  id: string
  accept?: string
  multiple?: boolean
  maxFiles?: number
  isFileLimitReached?: boolean
  fileTypeInvalid?: boolean
  isDisabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [] as File[],
  accept: 'image/*',
  multiple: true,
  maxFiles: 5,
  isFileLimitReached: false,
  fileTypeInvalid: false,
  isDisabled: false,
})

const emit = defineEmits(['update:modelValue'])

const isDragOver = ref(false)
const visible = ref(false)
const currentImageIndex = ref(0)

const fileSizeError = ref(false)

const imageUrls = computed(() => props.modelValue.map((file) => URL.createObjectURL(file)))

const showImage = (index: number) => {
  currentImageIndex.value = index
  visible.value = true
}

const handleHide = () => {
  visible.value = false
}

const removeFile = (index: number) => {
  const newFiles = [...props.modelValue]
  newFiles.splice(index, 1)
  emit('update:modelValue', newFiles)

  if (newFiles.length === 0) {
    fileSizeError.value = false
  }
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
    handleuploadedFile(newFiles)
  }
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const newFiles = Array.from(input.files)
    handleuploadedFile(newFiles)
  }
}

const handleuploadedFile = (newFiles: File[]) => {
  fileSizeError.value = false
  const validFiles = newFiles.filter(async (file) => {
    const base64String = await convertFileToBase64(file)
    if (base64String.length >= 1048576) {
      fileSizeError.value = true
      return false
    }
    return true
  })
  if (validFiles.length > 0) {
    fileSizeError.value = false
    const updatedFiles = [...props.modelValue, ...validFiles]
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
  border: 2px dashed var(--color-border-one);
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 10px;
}

.drop-area.dragover {
  background-color: var(--color-light-backgroud);
  border-color: var(--color-14-hover);
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
  color: var(--color-14);
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
  color: var(--color-14);
  cursor: pointer;
  font-size: 16px;
}

.error-message {
  color: var(--color-invalid-input);
  font-size: 12px;
}

.warning-message {
  color: var(--color-14);
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
