<template>
  <div class="place-header">
    <BackButton path="general-map" @click="handleBackClick" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import BackButton from '@/components/base/BackButton.vue'
import { useMapStore } from '@/stores/store'

const props = defineProps<{
  title: string
}>()

const store = useMapStore()

const handleBackClick = () => {
  store.removeCurrentPlace()
}
</script>

<style scoped>
.place-header {
  max-width: 762px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 15px 0;
}
</style>
