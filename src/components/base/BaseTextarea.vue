<template>
  <div class="input-group">
    <label v-if="label" :for="name">{{ label }}:</label>
    <textarea
      :name="name"
      :value="modelValue"
      @input="handleInput"
      :required="required"
      :maxlength="maxlength"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps({
    modelValue: {
      type: [String],
      default: '',
    },
    label: {
      type: String,
    },
    name: {
      type: String,
    },
    required: {
      type: Boolean,
      default: false,
    },
    maxlength: {
      type: Number,
      default: 1000,
    },
})
const emit = defineEmits(['update:modelValue'])

const handleInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<style scoped>
.input-group label {
  display: block;
  margin-bottom: 5px;
}
.input-group textarea {
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  min-height: 100px;
  padding: 10px;
  border: none;
  outline: 1px solid var(--color-14);
  border-radius: 8px;
  display: block;
  margin-bottom: 20px;
}
.input-group textarea:focus {
  outline: 1.5px solid var(--color-14-hover);
}
</style>
