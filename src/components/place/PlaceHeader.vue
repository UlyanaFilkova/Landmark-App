<template>
  <div class="place-header">
    <BackButton path="general-map" @click="handleBackClick" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import BackButton from '@/components/base/BackButton.vue'
import { useMapStore } from '@/stores/store'

const store = useMapStore()

const handleBackClick = () => {
  store.removeCurrentPlace()
}
</script>

<style scoped>
.place-header {
  max-width: 762px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 15px 0;
}
</style>
