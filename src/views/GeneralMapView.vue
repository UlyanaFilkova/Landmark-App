<template>
  <div class="container">
    <BaseLoader v-if="isLoading" />
    <MapHeader />
    <MapBlock />
    <TopPlaces />
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import MapHeader from '@/components/map/MapHeader.vue'
import MapBlock from '@/components/map/MapBlock.vue'
import TopPlaces from '@/components/map/TopPlaces.vue'
import BaseLoader from '@/components/base/BaseLoader.vue'
import { useMapStore } from '@/stores/store'

const store = useMapStore()
const isLoading = ref(true)

// TODO
onBeforeMount(() => {
  isLoading.value = true

  if (store.getPlaces.length === 0) {
    store.loadInitialData()
  }
  isLoading.value = false
})
</script>

<style scoped>
.container {
  box-sizing: border-box;
  min-height: 100vh;
  margin: 0 20px;
  padding-bottom: 70px;
  width: min(722px, 90%);
}
@media (max-width: 576px) {
  .container {
    margin: 0 15px;
  }
}
</style>
