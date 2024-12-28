<template>
  <div class="place-view">
    <PlaceAddHeader class="place-header" />
    <NewPlaceForm :isEditing="false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'

import NewPlaceForm from '@/components/place/NewPlaceForm.vue'
import PlaceAddHeader from '@/components/place/PlaceAddHeader.vue'

import { useMapStore } from '@/stores/mapStore'

const store = useMapStore()
const isLoading = ref(true)

const loadData = async () => {
  isLoading.value = true
  if (store.getPlaces.length === 0) {
    await store.loadInitialData()
  }
  isLoading.value = false
}

onBeforeMount(() => {
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
