<template>
  <div ref="mapContainer" id="map" class="map-container"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { tileLayer, marker, map, Map, MarkerClusterGroup, Marker } from 'leaflet'
import type { LeafletMouseEvent } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import { convertBase64ToFiles, getFileUrl } from '@/utils/typeConversion.ts'

import type { MapPoint } from '@/types/interfaces.ts'

const props = defineProps<{
  points: MapPoint[]
  readonly: boolean
  single: boolean
}>()

const emit = defineEmits(['update:сoordinates'])

const mapContainer = ref<HTMLDivElement | null>(null)
const mapEntity = ref<Map>()
const markers = ref<MarkerClusterGroup>()
const markerEntity = ref<Marker | null>(null)

const latitude = ref(props.points[0]?.location[0] || 53.9)
const longitude = ref(props.points[0]?.location[1] || 27.5667)

const createPopUp = (point: MapPoint) => {
  const popupContainer = document.createElement('div')

  const photos = point.photos ? convertBase64ToFiles(point.photos) : []

  const htmlContent = `
    <div class="popup-content">
      <a href="/place/${point.id}" target="_blank" class="popup-title">
        ${point.title}
      </a>
      <div class="star-rating" style="pointer-events: none;">
        Rating: ${point.rating}<span class="star">★</span>
      </div>
      ${
        photos.length > 0
          ? `<div class="place-photo-wrapper">
            <img src="${getFileUrl(photos[0])}" class="place-photo" />
          </div>`
          : ''
      }
    </div>
  `
  popupContainer.innerHTML = htmlContent

  return popupContainer
}

const addMarkers = (points: MapPoint[]) => {
  if (mapEntity.value) {
    markers.value?.clearLayers()
    points.forEach((point) => {
      const markerEntity = props.single
        ? marker(point.location)
        : marker(point.location).bindPopup(createPopUp(point))
      markers.value?.addLayer(markerEntity)
    })
  }
}

const initializeGeneralMap = () => {
  if (mapContainer.value) {
    mapEntity.value = map(mapContainer.value).setView([53.9, 27.5667], 11)

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapEntity.value)

    if (!props.single) {
      markers.value = new MarkerClusterGroup()
      mapEntity.value.addLayer(markers.value)

      addMarkers(props.points)
    }

    if (!props.readonly) {
      mapEntity.value.on('click', (e: LeafletMouseEvent) => {
        const { lat, lng } = e.latlng

        latitude.value = lat
        longitude.value = lng
        updateCoordinates(lat, lng)

        if (mapEntity.value) {
          if (markerEntity.value) {
            markerEntity.value.setLatLng(e.latlng)
          } else {
            markerEntity.value = marker(e.latlng).addTo(mapEntity.value)
          }
          mapEntity.value.setView([lat, lng], mapEntity.value.getZoom())
        }
      })
    }
  }
}

const updateMapCenter = (lat: number, lng: number) => {
  if (mapEntity.value) {
    mapEntity.value.setView([lat, lng], mapEntity.value.getZoom())
    if (markerEntity.value) {
      markerEntity.value.setLatLng([lat, lng])
    } else {
      markerEntity.value = marker([lat, lng]).addTo(mapEntity.value)
    }
  }
}

const updateCoordinates = (lat: number, lon: number) => {
  emit('update:сoordinates', [lat, lon])
}

const handleMapMove = () => {
  if (!mapEntity.value && props.single) {
    addMarkers(props.points)
  }
}

const addMapMoveEvents = () => {
  if (mapEntity.value) {
    mapEntity.value.on('moveend', handleMapMove)
    mapEntity.value.on('zoomend', handleMapMove)
  }
}

watch(
  () => [latitude, longitude],
  ([newLat, newLng]) => {
    updateMapCenter(newLat.value, newLng.value)
  },
)

watch(
  () => props.points,
  (newPointsValue) => {
    if (props.single) {
      latitude.value = newPointsValue[0].location[0]
      longitude.value = newPointsValue[0].location[1]
      updateMapCenter(newPointsValue[0].location[0], newPointsValue[0].location[1])
    } else {
      addMarkers(newPointsValue)
    }
  },
  { immediate: true },
)

onMounted(() => {
  initializeGeneralMap()
  addMapMoveEvents()
})
</script>

<style scoped>
.map-container {
  height: 70vh;
  max-height: 600px;
  width: 100%;
  border: 3px solid var(--color-forth);
  border-radius: 5px;
}

@media (max-width: 576px) {
  .map-container {
    height: min(70vh, 100vw);
  }
}

.leaflet-popup-close-button span {
  display: block;
  font-size: 28px;
  width: 12px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: transparent;
  color: var(--color-delete-span);
}

.leaflet-popup-close-button:hover span {
  display: block;
  color: var(--color-delete-span-hover);
}

.popup-content {
  min-width: 100px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.popup-title {
  font-weight: bold;
  font-size: 18px;
  text-decoration: none;
  color: var(--color-delete-span);
  display: block;
}

.popup-title:hover {
  text-decoration: underline;
  cursor: pointer;
}

.place-photo-wrapper {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.place-photo {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
  border-radius: 8px;
  max-height: 100px;
  object-fit: cover;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.star-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 14px;
}

.star-rating .star {
  font-size: 20px;
  color: #ffd700;
}
</style>
