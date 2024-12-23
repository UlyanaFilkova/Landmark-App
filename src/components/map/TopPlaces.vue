<template>
  <div class="top-places_container">
    <h1 class="top-places_h1">Top Places</h1>
    <div v-for="(place, index) in displayedPlaces" :key="place.id" class="place-card-container" click>
      <span class="place-number">{{ index + 1 }}</span>
      <PlaceCard :place="place" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import PlaceCard from '@/components/map/PlaceCard.vue'
import { Place } from '@/types/interfaces'
import { useMapStore } from '@/stores/store'
import { calculateMetricRating } from '@/services/place'

const store = useMapStore()
const places = computed(() => store.getPlaces)

const sortedPlaces = computed(() => {
  return places.value
    .map((place) => {
      const metricRating = calculateMetricRating(place.rating, place.voices)
      return { ...place, metricRating }
    })
    .sort((a, b) => b.metricRating - a.metricRating)
})

const pageSize = 10
const loading = ref(false)
const currentPage = ref(1)
const displayedPlaces = ref<Place[]>([])

const loadMorePlaces = () => {
  if (loading.value) return

  loading.value = true
  const start = (currentPage.value - 1) * pageSize
  const end = currentPage.value * pageSize

  const nextPlaces = sortedPlaces.value.slice(start, end)

  if (nextPlaces.length > 0) {
    displayedPlaces.value.push(...nextPlaces)
    currentPage.value++
  }

  loading.value = false
}


// vue-virtual-scroll
const onScroll = () => {
  const scrollPosition = window.scrollY + window.innerHeight
  const pageHeight = document.documentElement.scrollHeight

  const nearBottom = pageHeight - scrollPosition <= 100
  if (nearBottom && !loading.value && displayedPlaces.value.length <= sortedPlaces.value.length) {
    loadMorePlaces()
  }
}

watch(
  places,
  () => {
    if (places.value.length > 0 && displayedPlaces.value.length === 0) {
      loadMorePlaces()
    }
  },
  { immediate: true },
)

window.addEventListener('scroll', onScroll)

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.top-places_container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top-places_h1 {
  margin: 24px 0 20px 0;
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
</style>
