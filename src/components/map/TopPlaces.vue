<template>
  <div class="top-places_container">
    <div class="top-places-subtitle">Rating</div>
    <virtual-list
      :data-key="'id'"
      :data-sources="items"
      :data-component="PlaceCardWrapper"
      :estimate-size="10"
      @tobottom="onScrollToBottom"
      class="virtual-list-container"
    >
      <template #footer v-if="loading">
        <div class="loading-spinner">Loading ...</div>
      </template>
    </virtual-list>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import VirtualList from 'vue3-virtual-scroll-list'
import PlaceCard from '@/components/map/PlaceCard.vue'
import { useMapStore } from '@/stores/mapStore.ts'
import { calculateMetricRating } from '@/services/place.ts'
import type { Place } from '@/types/interfaces.ts'

const store = useMapStore()
const places = computed(() => store.getPlaces)

const PlaceCardWrapper = {
  props: ['source'],
  components: { PlaceCard },
  template: '<PlaceCard :place="source" />',
}

const sortedPlaces = computed(() => {
  return places.value
    .map((place) => {
      const metricRating = calculateMetricRating(place.rating, place.voices)
      return { ...place, metricRating }
    })
    .sort((a, b) => b.metricRating - a.metricRating)
})

const pageSize = 10
const items = ref<Place[]>([])
let pageNum = 0
const loading = ref(false)

const loadMorePlaces = () => {
  // if (loading.value) return
  // loading.value = true

  const start = pageNum * pageSize
  const end = start + pageSize
  const nextPlaces = sortedPlaces.value.slice(start, end)

  if (nextPlaces.length > 0) {
    items.value = items.value.concat(nextPlaces)
    pageNum++
  }
  // loading.value = false
}

const onScrollToBottom = () => {
  console.log('scrolled to bottom')
  loadMorePlaces()
}

watch(
  places,
  () => {
    if (places.value.length > 0 && pageNum === 0) {
      loadMorePlaces()
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.top-places_container {
  display: flex;
  flex-direction: column;
}

.virtual-list-container {
  height: 70vh;
  overflow-y: auto;
}

.virtual-list-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.virtual-list-container::-webkit-scrollbar-thumb {
  background-color: var(--color-forth);
  border-radius: 4px;
}

.virtual-list-container::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-forth-hover);
}

.virtual-list-container {
  scrollbar-width: thin;
  scrollbar-color: var(--color-forth) transparent;
}

.top-places_h1 {
  font-size: 28px;
  text-align: center;
  color: #3c3c3c;
}

.place-card-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: -10px;
}

.place-number {
  font-size: 20px;
  color: #555;
  min-width: 40px;
  text-align: center;
}

.loading-indicator {
  text-align: center;
  font-size: 16px;
  margin-top: 20px;
}

.loading-spinner {
  text-align: center;
  margin-top: 10px;
}

.top-places-subtitle {
  text-align: end;
  margin: 20px 10px 5px 0;
  color: #555;
}

</style>
