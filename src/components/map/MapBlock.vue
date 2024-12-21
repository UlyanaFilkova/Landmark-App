<template>
  <div ref="mapContainer" id="map" class="map-container"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, createApp, watch, computed } from 'vue'
import * as L from 'leaflet' 
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'

import { Place } from '@/types/interfaces'
import PopUp from '@/components/map/PopUp.vue'
import { useMapStore } from '@/stores/store'
import router from '@/router'

const store = useMapStore()

const mapContainer = ref<HTMLDivElement | null>(null)
const map = ref<L.Map>()
const markers = ref<L.MarkerClusterGroup>()

const createPopUp = (place: Place) => {
  const popupContainer = document.createElement('div')
  const app = createApp(PopUp, { place })
  app.use(router)
  app.mount(popupContainer)

  return popupContainer
}

const addMarkers = (places: Place[]) => {
  // if (map.value && places.length > 0) {
  //   places.forEach((place) => {
  //     L.marker(place.location).addTo(map.value!).bindPopup(createPopUp(place))
  //   })
  // }
  if (map.value && places.length > 0) {
    markers.value?.clearLayers()
    places.forEach((place) => {
      const marker = L.marker(place.location).bindPopup(createPopUp(place))
      markers.value?.addLayer(marker)
    })
  }
}

const places = computed(() => store.getPlaces)

onMounted(async () => {
  if (mapContainer.value) {
    map.value = L.map(mapContainer.value).setView([53.9, 27.5667], 11)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)

    markers.value = L.markerClusterGroup()
    map.value.addLayer(markers.value)

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
