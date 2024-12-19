<template>
  <div ref="mapContainer" id="map" class="map-container"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, createApp, watch, computed } from 'vue'
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

const addMarkers = (places: Place[]) => {
  if (map.value && places.length > 0) {
    places.forEach((place) => {
      L.marker(place.location)
        .addTo(map.value!)
        .bindPopup(createPopUp(place.title, 'https://example.com', place.rating))
    })
  }
}

const places = computed(() => store.getPlaces)

onMounted(async () => {
  if (mapContainer.value) {
    map.value = L.map(mapContainer.value).setView([53.9, 27.5667], 11)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)

    addMarkers(places.value)
  }
})

watch(
  places,
  (newPlaces) => {
    addMarkers(newPlaces)
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
