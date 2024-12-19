<template>
  <div class="place-container">
    {{ place.title }}
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { Place } from '@/types/interfaces'

const props = defineProps<{
  place: Place
}>()

console.log(props.place.id)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped></style>
