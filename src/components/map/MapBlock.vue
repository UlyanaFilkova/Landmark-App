<template>
  <div ref="mapContainer" id="map" class="map-container"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, createApp, watch } from 'vue'
import PopUp from '@/components/map/PopUp.vue'
import { useMapStore } from '@/stores/store'
import L from 'leaflet'
import { Place } from '@/types/interfaces'

const store = useMapStore()

const mapContainer = ref<HTMLDivElement | null>(null)
const map = ref<L.Map>()

const createPopUp = (title: string, link: string, rating: number) => {
  const popupContainer = document.createElement('div')
  const app = createApp(PopUp, { title, link, rating })
  app.mount(popupContainer)

  return popupContainer
}

const places = ref<Place[]>([])

onMounted(async () => {
  await store.fetchPlaces()
  places.value = store.getPlaces

  if (mapContainer.value) {
    map.value = L.map(mapContainer.value).setView([53.9, 27.5667], 11)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)

    if (places.value.length > 0) {
      places.value.forEach((place) => {
        L.marker(place.location)
          .addTo(map.value!)
          .bindPopup(createPopUp(place.title, 'https://example.com', place.rating))
      })
    }
  }
})

watch(
  places,
  (newPlaces) => {
    if (map.value && newPlaces.length > 0) {
      newPlaces.forEach((place) => {
        L.marker(place.location)
          .addTo(map.value!)
          .bindPopup(createPopUp(place.title, 'https://example.com', place.rating))
      })
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.map-container {
  height: 70vh;
  width: 100%;
  border: 3px solid #aaa;
  border-radius: 5px;
}
</style>
