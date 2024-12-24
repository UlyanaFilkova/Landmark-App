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
        <StarRating :rating="place.rating" readonly />
        <span class="rating-voices">{{ place.voices }} voices</span>
      </div>

      <div v-if="!isAdmin" class="user-rating">
        <h3>Your Rating</h3>
        <StarRating
          :rating="userRating"
          :readonly="false"
          @update:rating="updateUserRating"
          class="star-rating"
        />
      </div>
    </div>

    <div class="place-details-group">
      <h3>Location</h3>
      <div class="map-container">
        <LocationMap :latitude="place.location[0]" :longitude="place.location[1]" />
      </div>
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
import { ref, watch, computed } from 'vue'
import { Place } from '@/types/interfaces'
import StarRating from '@/components/base/StarRating.vue'
import LocationMap from '@/components/place/LocationMap.vue'
import VueEasyLightbox from 'vue-easy-lightbox'
import { useMapStore } from '@/stores/mapStore'
import { useUserStore } from '@/stores/userStore'

const mapStore = useMapStore()
const userStore = useUserStore()

const place = ref<Place | null>(null)
const photoViewerVisible = ref(false)
const photoViewerIndex = ref(0)
const userRating = ref<number>(0)

const isAdmin = computed(() => {
  return userStore.getUser?.role === 1
})

watch(
  () => mapStore.getCurrentPlaceUserRating,
  (newValue) => {
    userRating.value = newValue || 0
  },
  { immediate: true },
)

watch(
  () => mapStore.getCurrentPlace,
  (newPlace) => {
    if (newPlace) {
      place.value = newPlace
      photoViewerVisible.value = false
    } else {
      place.value = null
    }
  },
  { immediate: true },
)

const openPhotoViewer = (index: number) => {
  photoViewerIndex.value = index
  photoViewerVisible.value = true
}

const updateUserRating = (value: number) => {
  userRating.value = value
  mapStore.setNewCurrentPlaceUserRating(value)
}
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
  gap: 20%;
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

.map-container {
  width: 100%;
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
  border: 1px solid #ccc;
}

.photo-thumbnail:hover {
  border-color: #888;
}
</style>
