<template>
  <div class="place-container">
    <BaseLoader v-if="isLoading" />
    <PlaceViewHeader v-if="place" :place="place" />
    <PlaceBlock :place="place" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue'
import { useMapStore } from '@/stores/mapStore'
import { useRoute } from 'vue-router'

import PlaceViewHeader from '@/components/place/PlaceViewHeader.vue'
import PlaceBlock from '@/components/place/PlaceBlock.vue'
import BaseLoader from '@/components/base/BaseLoader.vue'

import { getPlaceById } from '@/services/place.ts'

import type { Place } from '@/types/interfaces.ts'

const store = useMapStore()
const isLoading = ref(true)
const route = useRoute()
const place = ref<Place | null>(null)

const placeId = route.params.id as string

const loadPlace = async (placeId: string) => {
  try {
    place.value = await getPlaceById(placeId)
  } catch (error) {
    console.error('Failed to load place:', error)
  }
}

const loadData = async () => {
  isLoading.value = true
  if (store.getPlaces.length === 0) {
    await store.loadInitialData()
  }
  isLoading.value = false
}

onBeforeMount(() => {
  loadPlace(placeId)
  loadData()
})

watch(
  () => store.isDataLoaded,
  (newValue) => {
    if (newValue) {
      loadPlace(placeId)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.place-container {
  width: min(762px, 95%);
}

@media (max-width: 576px) {
  .place-container {
    margin: 0 15px;
  }
}

.place-header {
  padding: 15px 20px 0 20px;
}
</style>
