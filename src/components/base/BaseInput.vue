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
import { defineProps, defineEmits, withDefaults } from 'vue'

interface Props {
  modelValue: string | number
  type?: string
  id: string
  label: string
  placeholder?: string
  step?: number
  min?: number
  max?: number
  maxlength?: number
  required?: boolean
  errorMessage?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  required: false,
  errorMessage: '',
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
  outline: 1px solid var(--color-14);
  border-radius: 5px;
}

input:focus {
  outline: 1.5px solid var(--color-14-hover);
}

.error-message {
  color: var(--color-invalid-input);
  font-size: 12px;
}
</style>
