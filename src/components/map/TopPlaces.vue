<template>
  <div class="top-places_container">
    <h1 class="top-places_h1">Top Places</h1>
    <div v-for="(place, index) in places" :key="place.id" class="place-card-container">
      <span class="place-number">{{ index + 1 }}</span>
      <PlaceCard :place="place" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import PlaceCard from '@/components/map/PlaceCard.vue'
import { Place } from '@/types/interfaces'
import { useMapStore } from '@/stores/store'

const store = useMapStore()

const places = computed(() => store.getPlaces)
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
}

.place-number {
  font-size: 20px;
  color: #555;
}
</style>
