<template>
  <div class="place-view">
    <PlaceAddHeader class="place-header" :place="place" />
    <NewPlaceForm :isEditing="true" :place="place" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'

import NewPlaceForm from '@/components/place/NewPlaceForm.vue'
import PlaceAddHeader from '@/components/place/PlaceAddHeader.vue'

import { useMapStore } from '@/stores/mapStore'
import { useRoute } from 'vue-router'

import { getPlaceById } from '@/services/place.ts'

import type { Place } from '@/types/interfaces.ts'

const store = useMapStore()
const route = useRoute()
const isLoading = ref(true)
const placeId = route.params.id as string
const place = ref<Place | null>(null)

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
</script>

<style scoped>
.place-view {
  width: 90%;
  max-width: 600px;
}

@media (max-width: 576px) {
  .place-header {
    margin-bottom: 10px;
  }
}
</style>
