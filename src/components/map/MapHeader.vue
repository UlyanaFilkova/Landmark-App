<template>
  <div class="map-header">
    <h1 class="map-header__h1">General Map</h1>
    <router-link to="/add-place">
      <BaseButton class="medium-button" text="Add new place" />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
</script>

<style scoped>
.map-header {
  padding: 25px 0 20px 0;
  display: flex;
  justify-content: space-between;
}
.map-header__h1 {
  color: #555;
}
.medium-button {
  max-width: 200px;
}
</style>
