<template>
  <div class="map-content">
    <div class="only-my-places" @click="handleCheckboxChange">
      <CustomCheckbox :checked="checkboxChecked" /><span>Only my places</span>
    </div>
    <div ref="mapContainer" id="map" class="map-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import CustomCheckbox from '@/components/base/CustomCheckbox.vue'

import { useMap } from '@/composables/useMap.ts'
import { useMapStore } from '@/stores/mapStore.ts'

const store = useMapStore()

const places = computed(() => store.getFilteredPlaces)

const { mapContainer } = useMap(places)

const checkboxChecked = ref<boolean>(false)

const handleCheckboxChange = () => {
  checkboxChecked.value = !checkboxChecked.value
  store.setOnlyUserPlaces(checkboxChecked.value)
}
</script>

<style>
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

.only-my-places {
  cursor: pointer;
  display: flex;
  gap: 10px;
  margin: 10px 0 15px 0;
  align-items: center;
  justify-content: center;
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
  gap: 10px;
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

.place-photo {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
  border-radius: 8px;
}
</style>
