<template>
  <div class="place-header">
    <BackButton path="general-map" @click="handleBackClick" />
    <div class="header-buttons">
      <RouterLink to="/add-place">
        <BaseButton class="medium-button grey" text="Edit"/>
      </RouterLink>
      <BaseButton class="medium-button red" text="Delete" @click="handleDeleteClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import BackButton from '@/components/base/BackButton.vue'
import BaseButton from '@/components/base/BaseButton.vue'
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
  justify-content: space-between;
  padding: 15px 0;
}

.header-buttons{
  display: flex;
  gap: 20px;
}

.medium-button {
  max-width: 200px;
  width: fit-content;
  padding: 10px 20px;
}
</style>
