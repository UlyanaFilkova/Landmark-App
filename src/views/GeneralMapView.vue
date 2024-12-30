<template>
  <GlobalError v-if="isError" />
  <div v-else class="container">
    <BaseLoader v-if="isLoading" />
    <MapHeader class="map-header" />
    <div class="content">
      <MapContent :places="places" />
      <h2 class="map-header__h2">Top Places</h2>
      <TopPlaces :places="places" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, computed } from 'vue'
import { useMapStore } from '@/stores/mapStore'

import MapHeader from '@/components/home/MapHeader.vue'
import MapContent from '@/components/home/MapContent.vue'
import TopPlaces from '@/components/home/TopPlaces.vue'
import BaseLoader from '@/components/base/BaseLoader.vue'
import GlobalError from '@/components/base/GlobalError.vue'

import type { Place } from '@/types/interfaces.ts'

const store = useMapStore()
const isLoading = ref(true)
const isError = ref(false)
const places = computed<Place[]>(() => store.getPlaces || [])

const loadData = async () => {
  isLoading.value = true
  isError.value = false
  try {
    if (store.getPlaces.length === 0) {
      await store.loadInitialData()
    }
  } catch (error) {
    console.error('Error loading data:', error)
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

onBeforeMount(() => {
  loadData()
})
</script>

<style scoped>
.container {
  box-sizing: border-box;
  min-height: 100vh;
  margin: 0 20px;
  width: 95%;
}

@media (min-width: 1800px) {
  .container {
    width: 1800px;
  }
}

@media (max-width: 992px) {
  .container {
    width: min(722px, 95%);
  }
}

@media (max-width: 576px) {
  .container {
    margin: 0 15px;
  }
}

.map-header__h2 {
  display: none;
}

.content {
  width: 100%;
  display: flex;
  gap: 4%;
}

.content > * {
  width: 50%;
}

@media (max-width: 992px) {
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .map-header__h2 {
    display: block;
    color: var(--color-14);
    flex-grow: 1;
    text-align: center;
    padding: 0;
    line-height: normal;
    margin-top: 30px;
  }
  .content > * {
    width: 95%;
    margin: 10px auto 15px;
  }
}
</style>
