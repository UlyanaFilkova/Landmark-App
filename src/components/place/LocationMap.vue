<template>
    <div class="location-input">
      <div class="form-group form-group-inline">
        <label>Location</label>
        <input
          :value="latitude"
          type="number"
          step="any"
          placeholder="Latitude"
          readonly
        />
        <input
          :value="longitude"
          type="number"
          step="any"
          placeholder="Longitude"
          readonly
        />
        <p v-if="locationInvalid" class="error-message">
          Latitude must be between -90 and 90 and Longitude between -180 and 180.
        </p>
      </div>
  
      <div ref="mapContainer" id="map" class="map-container"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import L from 'leaflet'
  
  const props = defineProps({
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    locationInvalid: {
      type: Boolean,
      default: false,
    },
  })
  
  const mapContainer = ref<HTMLDivElement | null>(null)
  const map = ref<L.Map | null>(null)
  const marker = ref<L.Marker | null>(null)
  
  const updateMapCenter = (lat: number, lng: number) => {
    if (map.value) {
      map.value.setView([lat, lng], map.value.getZoom())
      if (marker.value) {
        marker.value.setLatLng([lat, lng])
      } else {
        marker.value = L.marker([lat, lng]).addTo(map.value)
      }
    }
  }
  
  watch(
    () => [props.latitude, props.longitude],
    ([newLat, newLng]) => {
      updateMapCenter(newLat, newLng)
    },
  )
  
  onMounted(() => {
    if (mapContainer.value) {
      map.value = L.map(mapContainer.value).setView([props.latitude, props.longitude], 16)
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)
      updateMapCenter(props.latitude, props.longitude)
    }
  })
  </script>
  
  <style scoped>
  .location-input {
    margin-bottom: 20px;
  }
  
  .map-container {
    height: 300px;
    width: 100%;
    border: 3px solid #aaa;
    border-radius: 5px;
    margin-top: 20px;
  }
  
  .error-message {
    color: red;
    font-size: 12px;
  }
  </style>
  