<template>
  <div class="star-rating">
    <label>Rating</label>
    <div class="stars">
      <span
        v-for="n in 5"
        :key="n"
        :class="['star', { filled: n <= internalRating }]"
        @click="updateRating(n)"
      >
        ★
      </span>{{ modelValue }}
    </div>
    <input type="hidden" :value="internalRating" />
    <div class="invalid-input" v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: number
  errorMessage?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const internalRating = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  internalRating.value = newValue
})

const updateRating = (value: number) => {
  internalRating.value = value
  emit('update:modelValue', value)
}
</script>

<style scoped>
.star-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px 0;
}

.stars {
  font-size: 2rem;
  cursor: pointer;
}

.star {
  color: #ccc;
  transition: color 0.2s;
}

.star.filled {
  color: gold;
}

.invalid-input {
  font-size: 12px;
  color: red;
  margin-top: 5px;
}
</style>
