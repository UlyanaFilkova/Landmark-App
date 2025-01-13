<template>
  <div v-if="place" class="place-details">
    <h1 class="place-title">{{ place.title }}</h1>
    <div class="place-details-group">
      <h3>{{ t('place.description') }}</h3>
      {{ place.description }}
    </div>

    <div class="ratings place-details-group">
      <div class="average-rating">
        <h3>{{ t('place.rating') }}</h3>
        <StarRating :rating="place.rating" readonly :starSize="30" textClass="big" />
        <span class="rating-voices">{{ t('place.voices', { count: place.voices }) }}</span>
      </div>

      <div v-if="!isAdmin" class="user-rating">
        <h3>{{ t('place.yourRating') }}</h3>
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
      <h3>{{ t('place.location') }}</h3>
      <LocationData :place="place" />
    </div>

    <div class="place-details-group">
      <h3>{{ t('place.photos') }}</h3>
      <div class="photo-grid">
        <img
          v-for="(photo, index) in place.photos"
          :key="index"
          :src="photo"
          @click="openPhotoViewer(index)"
          class="photo-thumbnail"
        />
      </div>
      <div v-if="place.photos.length === 0">{{ t('place.noPhotos') }}</div>
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
import { useI18n } from 'vue-i18n'

import StarRating from '@/components/base/StarRating.vue'
import LocationData from '@/components/place/LocationData.vue'

import { useMapStore } from '@/stores/mapStore.ts'
import { useUserStore } from '@/stores/userStore.ts'

import type { Place } from '@/types/interfaces.ts'

const mapStore = useMapStore()
const userStore = useUserStore()
const { t } = useI18n()

const props = defineProps<{ place: Place | null }>()

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
  margin: 10px 0 20px 0;
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
