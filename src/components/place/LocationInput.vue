<template>
  <div class="location-input">
    <div class="form-group form-group-inline">
      <label>Location</label>
      <input
        :value="latitude"
        @input="updateLatitude($event)"
        type="number"
        step="any"
        placeholder="Latitude"
        required
        min="-90"
        max="90"
      />
      <input
        :value="longitude"
        @input="updateLongitude($event)"
        type="number"
        step="any"
        placeholder="Longitude"
        required
        min="-180"
        max="180"
      />
      <p v-if="locationInvalid" class="error-message">
        Latitude must be between -90 and 90 and Longitude between -180 and 180.
      </p>
    </div>

    <div ref="mapContainer" id="map" class="map-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
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

const emit = defineEmits(['update:latitude', 'update:longitude'])

const mapContainer = ref<HTMLDivElement | null>(null)
const map = ref<L.Map | null>(null)
const marker = ref<L.Marker | null>(null)

const updateLatitude = (event: Event) => {
  emit('update:latitude', parseFloat((event.target as HTMLInputElement).value))
}

const updateLongitude = (event: Event) => {
  emit('update:longitude', parseFloat((event.target as HTMLInputElement).value))
}

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
    map.value = L.map(mapContainer.value).setView([props.latitude, props.longitude], 11)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)

    map.value.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      emit('update:latitude', lat)
      emit('update:longitude', lng)

      if (marker.value) {
        marker.value.setLatLng(e.latlng)
      } else {
        marker.value = L.marker(e.latlng).addTo(map.value)
      }
    })
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
