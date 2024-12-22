<template>
  <BaseLoader v-if="isLoading" />
  <PlaceHeader title="View Place" />
  <PlaceBlock />
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import PlaceHeader from '@/components/place/PlaceHeader.vue'
import PlaceBlock from '@/components/place/PlaceBlock.vue'
import BaseLoader from '@/components/base/BaseLoader.vue'
import { useMapStore } from '@/stores/store'

const store = useMapStore()
const isLoading = ref(true)

onBeforeMount(async () => {
  isLoading.value = true
  if (store.getPlaces.length === 0) {
    await store.loadInitialData()
  }
  else if (store.getCurrentPlace === undefined) {
    store.loadCurrentPlace()
  }
  isLoading.value = false
})
</script>
