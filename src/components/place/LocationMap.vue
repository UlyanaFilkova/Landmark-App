<template>
  <div class="location-input">
    <div class="form-group form-group-inline">
      <div class="groups">
        <div class="group">
          <label>Latitude:</label>
          <div>{{ latitude }}</div>
        </div>
        <div class="group">
          <label>Longitude:</label>
          <div>{{ longitude }}</div>
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
  border: 3px solid var(--color-forth);
  border-radius: 5px;
  margin-top: 20px;
}

.error-message {
  color: var(--color-invalid-input);
  font-size: 12px;
}

.main-label {
  font-weight: 600;
  margin-bottom: 20px;
  display: block;
}

.groups {
  display: flex;
  gap: 10%;
  justify-content: center;
  margin-left: 10px;
}

@media (max-width: 576px) {
  .groups {
    display: flex;
    flex-direction: column;
    gap: 10%;
    justify-content: start;
  }
}

.group {
  display: flex;
  gap: 10%;
  justify-content: center;
}

@media (max-width: 300px) {
  .groups {
    gap: 20px;
    align-items: center;
  }
  .group {
    flex-direction: column;
  }
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
}

input {
  width: 90%;
  padding: 10px;
  border: none;
  outline: 1px solid var(--color-14);
  border-radius: 5px;
  cursor: auto;
}
</style>
