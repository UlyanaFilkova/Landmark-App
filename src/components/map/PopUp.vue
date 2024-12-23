<template>
  <div class="popup-content">
    <RouterLink to="/place" target="_blank" class="popup-title" @click="handlePopupClick">{{
      props.place.title
    }}</RouterLink>
    <StarRating :rating="place.rating" readonly />
    <div v-if="photos.length > 0">
      <img :src="getFileUrl(photos[0])" class="place-photo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useMapStore } from '@/stores/store'
import { Place } from '@/types/interfaces'
import StarRating from '@/components/base/StarRating.vue'
import { convertBase64ToFiles } from '@/utils/typeConversion.js'

const props = defineProps<{
  place: Place
}>()

const photos = convertBase64ToFiles(props.place.photos || [])

const getFileUrl = (file: File) => URL.createObjectURL(file)

const store = useMapStore()

const handlePopupClick = () => {
  store.setCurrentPlace(props.place)
}
</script>

<style>
.popup-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popup-title {
  font-weight: bold;
  font-size: 18px;
  text-decoration: none;
  color: #004085;
  display: block;
}

.popup-title:hover {
  text-decoration: underline;
  cursor: pointer;
}

.place-photo {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
  border-radius: 8px;
}
</style>
