<template>
  <div class="location-input">
    <div class="form-group form-group-inline">
      <label class="main-label">Location:</label>
      <div class="inputs">
        <div class="input-group">
          <label>Latitude:</label>
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
        </div>
        <div class="input-group">
          <label>Longitude:</label>
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
        </div>
      </div>
      <p v-if="locationInvalid" class="error-message">
        Latitude must be between -90 and 90 and Longitude between -180 and 180.
      </p>
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
  locationInvalid: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:latitude', 'update:longitude'])

const updateLatitude = (event: Event) => {
  emit('update:latitude', parseFloat((event.target as HTMLInputElement).value))
}

const updateLongitude = (event: Event) => {
  emit('update:longitude', parseFloat((event.target as HTMLInputElement).value))
}

const { mapContainer } = usePlaceMap(props.latitude, props.longitude, false, emit)
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
  gap: 20px;
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
}

input:focus {
  outline: 1.5px solid #333;
}
</style>
