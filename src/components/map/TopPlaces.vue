<template>
  <div class="top-container">
    <PlaceCard v-for="place in places" :key="place.id" :place="place" />
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

<style scoped></style>
