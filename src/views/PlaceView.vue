<template>
  <BaseLoader v-if="isLoading" />
  <PlaceViewHeader />
  <PlaceBlock />
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import PlaceViewHeader from '@/components/place/PlaceViewHeader.vue'
import PlaceBlock from '@/components/place/PlaceBlock.vue'
import BaseLoader from '@/components/base/BaseLoader.vue'
import { useMapStore } from '@/stores/store'

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
.place-header {
  padding: 15px 20px 0 20px;
}
</style>
