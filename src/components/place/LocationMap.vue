<template>
  <div class="location-input">
    <div class="form-group form-group-inline">
      <div class="groups">
        <div class="group">
          <label>Latitude:</label>
          <div>{{ place.location[0] }}</div>
        </div>
        <div class="group">
          <label>Longitude:</label>
          <div>{{ place.location[1] }}</div>
        </div>
      </div>
    </div>

    <MapComponent :places="[place]" :single="true" :readonly="true" />
  </div>
</template>

<script setup lang="ts">
import MapComponent from '@/components/common/MapComponent.vue'
import type { Place } from '@/types/interfaces.ts'

defineProps<{
  place: Place
}>()
</script>

<style scoped>
.location-input {
  margin-bottom: 20px;
}

.map-container {
  height: 50vh;
  width: 100%;
  border: 3px solid var(--color-forth);
  border-radius: 5px;
  margin-top: 20px;
}

@media (max-width: 576px) {
  .map-container {
    height: min(50vh, 100vw);
  }
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
