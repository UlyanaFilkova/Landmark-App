<template>
  <div class="top-places_container">
    <div class="top-places-subtitle">Rating</div>
    <dynamic-scroller
      :items="items"
      :min-item-size="100"
      class="virtual-list-container"
      @resize="updateListHeight"
      @scroll="onScroll"
    >
      <template #default="{ item }">
        <PlaceCard :place="item" />
      </template>
    </dynamic-scroller>
    <div v-if="loading" class="loading-spinner">Loading ...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { DynamicScroller } from 'vue-virtual-scroller'

import PlaceCard from '@/components/map/PlaceCard.vue'

import { calculateMetricRating } from '@/utils/typeConversion.ts'
import type { Place } from '@/types/interfaces.ts'

const props = defineProps<{ places: Place[] }>()

const pageSize = 10
const items = ref<Place[]>([])
let pageNum = 0
const loading = ref(false)

const sortedPlaces = computed(() => {
  return props.places
    .map((place) => {
      const metricRating = calculateMetricRating(place.rating, place.voices)
      return { ...place, metricRating }
    })
    .sort((a, b) => b.metricRating - a.metricRating)
})

const updateListHeight = () => {
  const scrollList = document.querySelector('virtual-list-container') as HTMLDivElement
  const windowHeight = window.innerHeight
  if (scrollList) {
    scrollList.style.height = `${windowHeight * 0.7}px`
  }
}

const loadMorePlaces = () => {
  if (loading.value) return
  loading.value = true

  const start = pageNum * pageSize
  const end = start + pageSize
  const nextPlaces = sortedPlaces.value.slice(start, end)

  if (nextPlaces.length > 0) {
    items.value = items.value.concat(nextPlaces)
    pageNum++
  }
  loading.value = false
}

const onScroll = (event: Event) => {
  const scroller = event.target as HTMLDivElement
  if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 50) {
    loadMorePlaces()
  }
}

watch(
  () => props.places,
  () => {
    if (props.places.length > 0 && pageNum === 0) {
      loadMorePlaces()
      updateListHeight()
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
  color: var(--coor-header-1);
}

.place-card-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: -10px;
}

.place-number {
  font-size: 20px;
  color: var(--color-14);
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
  color: var(--color-14);
}
</style>
