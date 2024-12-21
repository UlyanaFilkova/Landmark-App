<template>
  <div class="popup-content">
    <RouterLink to="/place" class="popup-title" @click="handlePopupClick">{{
      props.place.title
    }}</RouterLink>
    <div class="popup-rating">{{ props.place.rating }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useMapStore } from '@/stores/store'
import { Place } from '@/types/interfaces'

const props = defineProps<{
  place: Place
}>()

const store = useMapStore()

const handlePopupClick = () => {
  store.setCurrentPlace(props.place)
}
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
