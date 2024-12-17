<template>
  <div class="container">
    <BaseLoader v-if="isLoading" />
    <MapHeader />
    <MapBlock />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import MapHeader from '@/components/map/MapHeader.vue'
import MapBlock from '@/components/map/MapBlock.vue'
import BaseLoader from '@/components/base/BaseLoader.vue'

import { useMapStore } from '@/stores/index'

const store = useMapStore()
const isLoading = ref(true)

onMounted(async () => {
  await store.loadInitialData()
  isLoading.value = false
})
</script>

<style scoped>
.container {
  box-sizing: border-box;
  min-height: 100vh;
  margin: 0 20px;
  padding-bottom: 70px;
}
@media (max-width: 576px) {
  .container {
    margin: 0 15px;
  }
}
</style>
