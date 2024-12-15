<template>
  <div ref="mapContainer" id="map" class="map-container"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, createApp } from 'vue'
import PopUp from '@/components/map/PopUp.vue'
import L from 'leaflet'

const mapContainer = ref<HTMLDivElement | null>(null)

const createPopUp = (title: string, link: string, rating: number) => {
  const popupContainer = document.createElement('div')
  const app = createApp(PopUp, { title, link, rating })
  app.mount(popupContainer)

  return popupContainer
}

onMounted(() => {
  if (mapContainer.value) {
    const map = L.map(mapContainer.value).setView([53.9, 27.5667], 11)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

    L.marker([53.9, 27.5667])
      .addTo(map)
      .bindPopup(createPopUp('Минск', 'https://example.com', 4.5))
  }
})
</script>

<style scoped>
.map-container {
  height: 70vh;
  width: 100%;
  border: 3px solid #aaa;
  border-radius: 5px;
}
</style>
