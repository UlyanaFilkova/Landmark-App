<template>
  <div v-if="place" class="place-details">
    <div class="description">{{ place.description }}</div>

    <div class="ratings">
      <div class="average-rating">
        <h3>Average Rating</h3>
        <StarRating :rating="place.rating" readonly />
      </div>

      <!-- <div class="user-rating">
          <h3>Your Rating</h3>
          <StarRating v-model="userRating" @rate="handleRating" />
        </div> -->
    </div>

    <div class="location">
      <h3>Location</h3>
      <div class="map-container">
        <LocationMap :latitude="place.location[0]" :longitude="place.location[1]" />
      </div>
    </div>

    <div class="photos">
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
import { useMapStore } from '@/stores/store'

const store = useMapStore()

const place = ref<Place | null>(null)
const photoViewerVisible = ref(false)
const photoViewerIndex = ref(0)

watch(
  () => store.getCurrentPlace,
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
</script>

<style scoped>
.place-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.place-details h2 {
  text-align: center;
  margin-bottom: 20px;
}

.description {
  margin-bottom: 20px;
  font-size: 16px;
}

.ratings {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.location {
  margin-bottom: 20px;
}

.map-container {
  height: 300px;
  width: 100%;
  border: 3px solid #aaa;
  border-radius: 5px;
}

.photos {
  margin-bottom: 20px;
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
