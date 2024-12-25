<template>
  <div class="only-my-places" @click="handleCheckboxChange">
    <CustomCheckbox :checked="checkboxChecked" /><span>Only my places</span>
  </div>
  <div ref="mapContainer" id="map" class="map-container"></div>
</template>

<script setup lang="ts">
import { useMap } from '@/composables/useMap.ts'
import CustomCheckbox from '@/components/base/CustomCheckbox.vue'

const { mapContainer, checkboxChecked, handleCheckboxChange } = useMap()
</script>

<style>
.map-container {
  height: 70vh;
  max-height: 600px;
  width: 100%;
  border: 3px solid #aaa;
  border-radius: 5px;
}

.only-my-places {
  cursor: pointer;
  display: flex;
  gap: 10px;
  margin: 10px 0 15px 0;
  align-items: center;
}

::v-deep .leaflet-popup-close-button span {
  display: block;
  font-size: 28px;
  width: 12px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: transparent;
  color: #004085;
}

::v-deep .leaflet-popup-close-button:hover span {
  display: block;
  color: #e00000;
}

.popup-content {
  min-width: 100px;
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

<!-- <template>
  <div class="only-my-places" @click="handleCheckboxChange">
    <CustomCheckbox :checked="checkboxChecked" /><span>Only my places</span>
  </div>
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
import CustomCheckbox from '@/components/base/CustomCheckbox.vue'
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
  if (map.value) {
    markers.value?.clearLayers()
    places.forEach((place) => {
      const marker = L.marker(place.location).bindPopup(createPopUp(place))
      markers.value?.addLayer(marker)
    })
  }
}

const places = computed(() => store.getFilteredPlaces)

const checkboxChecked = ref<Boolean>(false)

const initializeMap = async () => {
  if (mapContainer.value) {
    map.value = L.map(mapContainer.value).setView([53.9, 27.5667], 11)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)
    

    markers.value = L.markerClusterGroup()
    map.value.addLayer(markers.value)

    addMarkers(places.value)
  }
}

const handleCheckboxChange = () => {
  checkboxChecked.value = !checkboxChecked.value
  store.setOnlyUserPlaces(checkboxChecked.value)
}

watch(
  () => store.getFilteredPlaces,
  (newPlaces) => {
    addMarkers(newPlaces)
    setTimeout(() => {
      if (map.value) {
        map.value.invalidateSize()
      }
    }, 200) 
  },
  { immediate: true },
)

onMounted(async () => {
  checkboxChecked.value = store.getOnlyUserPlaces
  initializeMap()
})
</script>

<style scoped>
.map-container {
  height: 70vh;
  max-height: 600px;
  width: 100%;
  border: 3px solid #aaa;
  border-radius: 5px;
}

.only-my-places {
  cursor: pointer;
  display: flex;
  gap: 10px;
  margin: 10px 0 15px 0;
  align-items: center;
}
</style> -->
