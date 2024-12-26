<template>
  <div class="place-container">
    <BaseLoader v-if="isLoading" />
    <PlaceViewHeader />
    <PlaceBlock />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import PlaceViewHeader from '@/components/place/PlaceViewHeader.vue'
import PlaceBlock from '@/components/place/PlaceBlock.vue'
import BaseLoader from '@/components/base/BaseLoader.vue'
import { useMapStore } from '@/stores/mapStore'

const store = useMapStore()
const isLoading = ref(true)

const loadData = async () => {
  isLoading.value = true
  if (store.getPlaces.length === 0) {
    await store.loadInitialData()
  } else {
    store.loadCurrentPlace()
  }
  isLoading.value = false
}

onBeforeMount(() => {
  loadData()
})
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
