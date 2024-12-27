<template>
  <div class="input-group">
    <input :type="type" :value="modelValue" @input="handleInput" :placeholder="placeholder" />
    <div class="invalid-input">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps<{
  modelValue: string
  placeholder: string
  type?: string
  errorMessage?: string
}>()

const emit = defineEmits(['update:modelValue'])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.input-group {
  margin: 15px 0 20px 0;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-border-one);
  border-radius: 5px;
}
.invalid-input {
  font-size: 12px;
  line-height: 12px;
  color: var(--color-invalid-input);
  margin-top: 5px;
}
</style>
