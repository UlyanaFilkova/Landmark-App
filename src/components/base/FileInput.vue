<template>
  <div class="file-input">
    <label>{{ label }}</label>
    <div class="custom-file-upload">
      <input
        @change="handleFileChange"
        type="file"
        :id="id"
        :accept="accept"
        :multiple="multiple"
        :disabled="isPhotoLimitReached"
      />
      <button type="button" @click="triggerFileInput" :disabled="isPhotoLimitReached">
        {{ buttonText }}
      </button>
      <p v-if="isPhotoLimitReached" class="warning-message">{{ warningMessage }}</p>
    </div>
    <div v-if="files.length > 0">
      <p>Uploaded files:</p>
      <ul>
        <li v-for="(file, index) in files" :key="index">
          {{ file.name }}
          <button type="button" @click="removeFile(index)">✖</button>
        </li>
      </ul>
    </div>
    <p v-if="fileTypeInvalid" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
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
    default: 'One or more files are not valid images.',
  },
  buttonText: {
    type: String,
    default: 'Choose Files',
  },
})

const emit = defineEmits(['update:modelValue'])
const warningMessage = 'Maximum 5 photos'

const files = ref<File[]>([])
const fileTypeInvalid = ref(false)

const isPhotoLimitReached = computed(() => files.value.length >= props.maxFiles)

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const newFiles = Array.from(input.files)
    const invalidFiles = newFiles.filter((file) => !file.type.startsWith('image/'))
    if (invalidFiles.length > 0) {
      fileTypeInvalid.value = true
      return
    }
    fileTypeInvalid.value = false
    const totalFiles = files.value.length + newFiles.length
    if (totalFiles > props.maxFiles) {
      alert(`You can upload up to ${props.maxFiles} files.`)
      return
    }
    files.value.push(...newFiles)
    input.value = ''
    emit('update:modelValue', files.value)
  }
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
  emit('update:modelValue', files.value)
}

const triggerFileInput = () => {
  const fileInput = document.getElementById(props.id) as HTMLInputElement
  if (fileInput) {
    fileInput.click()
  }
}

watch(
  () => props.modelValue,
  (newVal) => {
    files.value = newVal as File[]
  },
  { immediate: true },
)
</script>

<style scoped>
.file-input {
  margin-bottom: 15px;
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
}
</style>
