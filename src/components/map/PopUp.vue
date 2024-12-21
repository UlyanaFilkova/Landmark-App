<template>
  <div class="popup-content">
    <RouterLink to="/place" class="popup-title">{{ props.title }}</RouterLink>
    <div class="popup-rating">{{ props.rating }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  title: string
  rating: number
}>()
</script>

<style scoped>
.popup-content {
  text-align: center;
}

.popup-title {
  font-weight: bold;
  font-size: 16px;
  text-decoration: none;
  color: #004085;
}

.popup-title:hover {
  text-decoration: underline;
  cursor: pointer;
}

.popup-rating {
  margin-top: 5px;
  font-size: 14px;
  color: #555;
}
</style>
