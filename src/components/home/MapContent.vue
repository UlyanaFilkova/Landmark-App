<template>
  <div class="map-content">
    <div class="only-my-places" @click="handleCheckboxChange">
      <CustomCheckbox :checked="checkboxChecked" /><span>{{ t('common.titles.myPlaces') }}</span>
    </div>
    <MapComponent :points="points" :single="false" :readonly="true" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import CustomCheckbox from '@/components/base/CustomCheckbox.vue'
import MapComponent from '@/components/common/MapComponent.vue'
import { useUserStore } from '@/stores/userStore.ts'
import { getFilteredPlacesData } from '@/services/place'

import type { Place, MapPoint } from '@/types/interfaces.ts'

const { t } = useI18n()

const props = defineProps<{ places: Place[] }>()

const userStore = useUserStore()
const userId = computed<string | undefined>(() => userStore.getUser?.id)

const filteredPlaces = ref<Place[]>(props.places)

const points = computed<MapPoint[]>(() => {
  return filteredPlaces.value.map((place) => ({
    id: place.id,
    title: place.title,
    location: place.location,
    rating: place.rating,
    photos: place.photos,
  }))
})

watch(
  () => props.places,
  (newPlaces) => {
    filteredPlaces.value = newPlaces
  },
  { immediate: true },
)

const checkboxChecked = ref<boolean>(false)

const handleCheckboxChange = async () => {
  checkboxChecked.value = !checkboxChecked.value
  if (checkboxChecked.value && userId.value) {
    const resultPlaces = await getFilteredPlacesData(userId.value)
    filteredPlaces.value = resultPlaces
  } else {
    filteredPlaces.value = props.places
  }
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
