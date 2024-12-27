<template>
  <div class="location-input">
    <div class="form-group form-group-inline">
      <div class="inputs">
        <div class="input-group">
          <label>Latitude:</label>
          <input :value="latitude" type="number" step="any" placeholder="Latitude" readonly />
        </div>
        <div class="input-group">
          <label>Longitude:</label>
          <input :value="longitude" type="number" step="any" placeholder="Longitude" readonly />
        </div>
      </div>
    </div>

    <div ref="mapContainer" id="map" class="map-container"></div>
  </div>
</template>

<script setup lang="ts">
import { usePlaceMap } from '@/composables/usePlaceMap.ts'

const props = defineProps({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
})

const { mapContainer } = usePlaceMap(props.latitude, props.longitude, true)
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

.main-label {
  font-weight: 600;
  margin-bottom: 20px;
  display: block;
}

.inputs {
  display: flex;
  gap: 10%;
  justify-content: center;
}

label {
  display: block;
  margin-bottom: 10px;
}

input {
  width: 90%;
  padding: 10px;
  border: none;
  outline: 1px solid #555;
  border-radius: 5px;
  cursor: auto;
}
</style>
