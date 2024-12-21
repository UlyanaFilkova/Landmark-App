<template>
    <router-link :to="props.path" class="back-button">
      <BackIcon />
      Back
    </router-link>
</template>

<script setup lang="ts">
import BackIcon from '@/components/icons/BackIcon.vue'
import { defineProps } from 'vue'

const props = defineProps<{
  path: string
}>()
</script>

<style scoped>
.back-button {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  color: var(--color-text-second);
}

.back-button__icon svg {
  height: 24px;
  width: 24px;
  fill: var(--color-text-second);
}
.back-button:hover {
  color: var(--color-card-third);
  cursor: pointer;
}
.back-button:hover svg {
  fill: var(--color-card-third);
}</style>