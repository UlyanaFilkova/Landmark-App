<template>
  <div class="popup-content">
    <RouterLink to="/place" target="_blank" class="popup-title" @click="handlePopupClick">{{
      props.place.title
    }}</RouterLink>
    <StarRating :rating="place.rating" readonly />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useMapStore } from '@/stores/store'
import { Place } from '@/types/interfaces'
import StarRating from '@/components/base/StarRating.vue'

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
  font-size: 18px;
  text-decoration: none;
  color: #004085; 
  margin-bottom: 7px;
  display: block;
}

.popup-title:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
