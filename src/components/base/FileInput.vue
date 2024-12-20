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
        :disabled="isDisabled"
      />
      <button type="button" @click="triggerFileInput" :disabled="isDisabled">
        {{ buttonText }}
      </button>
      <p v-if="isFileLimitReached" class="warning-message">{{ warningMessage }}</p>
    </div>
    <div v-if="modelValue.length > 0">
      <p>Uploaded files:</p>
      <ul>
        <li v-for="(file, index) in modelValue" :key="index">
          {{ file.name }}
          <button type="button" @click="removeFile(index)">✖</button>
        </li>
      </ul>
    </div>
    <p v-if="fileTypeInvalid" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

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
