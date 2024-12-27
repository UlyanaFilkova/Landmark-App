<template>
  <div class="input-wrapper">
    <div class="input-container">
      <label :for="id">{{ label }}</label>
      <input
        :id="id"
        :value="modelValue"
        @input="handleInput"
        :type="type"
        :placeholder="placeholder"
        :step="step"
        :min="min"
        :max="max"
        :maxlength="maxlength"
        :required="required"
      />
    </div>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps({
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text',
  },
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  step: Number,
  min: Number,
  max: Number,
  maxlength: Number,
  required: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<style scoped>
.input-wrapper {
  margin-bottom: 15px;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 10px;
  border: none;
  outline: 1px solid #555;
  border-radius: 5px;
}

input:focus {
  outline: 1.5px solid #333;
}

.error-message {
  color: red;
  font-size: 12px;
}
</style>
