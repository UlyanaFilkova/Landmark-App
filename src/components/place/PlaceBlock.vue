<template>
  <div v-if="place" class="place-details">
    <h1 class="place-title">{{ place.title }}</h1>
    <div class="place-details-group">
      <h3>Description</h3>
      {{ place.description }}
    </div>

    <div class="ratings place-details-group">
      <div class="average-rating">
        <h3>Rating</h3>
        <StarRating :rating="place.rating" readonly :starSize="30" textClass="big" />
        <span class="rating-voices">{{ place.voices }} voices</span>
      </div>

      <div v-if="!isAdmin" class="user-rating">
        <h3>Your Rating</h3>
        <StarRating
          :rating="userRating"
          :readonly="false"
          @update:rating="updateUserRating"
          :increment="0.5"
          :starSize="30"
          textClass="big"
        />
      </div>
    </div>

    <div class="place-details-group">
      <h3>Location</h3>
      <LocationMap :latitude="place.location[0]" :longitude="place.location[1]" />
    </div>

    <div class="place-details-group">
      <h3>Photos</h3>
      <div class="photo-grid">
        <img
          v-for="(photo, index) in place.photos"
          :key="index"
          :src="photo"
          @click="openPhotoViewer(index)"
          class="photo-thumbnail"
        />
      </div>
      <div v-if="place.photos.length === 0">No photos</div>
    </div>

    <vue-easy-lightbox
      :visible="photoViewerVisible"
      :imgs="place.photos"
      :index="photoViewerIndex"
      @hide="photoViewerVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import VueEasyLightbox from 'vue-easy-lightbox'

import StarRating from '@/components/base/StarRating.vue'
import LocationMap from '@/components/place/LocationMap.vue'

import { useMapStore } from '@/stores/mapStore.ts'
import { useUserStore } from '@/stores/userStore.ts'

import type { Place } from '@/types/interfaces.ts'

const props = defineProps<{ place: Place | null }>()

const mapStore = useMapStore()
const userStore = useUserStore()

const photoViewerVisible = ref<boolean>(false)
const photoViewerIndex = ref<number>(0)
const userRating = ref<number>(0)

const isAdmin = computed<boolean>(() => {
  return userStore.getUser?.role === 1
})

const openPhotoViewer = (index: number) => {
  photoViewerIndex.value = index
  photoViewerVisible.value = true
}

const updateUserRating = (value: number) => {
  if (props.place) {
    userRating.value = value
    mapStore.setNewUserRating(value, props.place)
  }
}

watchEffect(() => {
  if (props.place && mapStore.isDataLoaded) {
    userRating.value = mapStore.getCurrentPlaceUserRating(props.place.id)
  }
})
</script>

<style scoped>
.place-details {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.place-title {
  text-align: center;
  padding: 5px 40px 20px;
}

.description {
  font-size: 16px;
}

.ratings {
  display: flex;
  justify-content: center;
  gap: 20%;
}

@media (max-width: 576px) {
  .ratings {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
.rating-voices {
  font-size: 14px;
  margin: 5px 0 0 0;
}
h3 {
  font-weight: 500;
  margin-bottom: 10px;
}

.place-details-group {
  margin-bottom: 30px;
}

.photo-grid {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.photo-thumbnail {
  width: 100px;
  height: 100px;
  object-fit: cover;
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid var(--color-border-one);
}

.photo-thumbnail:hover {
  border-color: var(--color-border-two);
}
</style>
