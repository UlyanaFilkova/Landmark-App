<template>
  <div class="map-header">
    <h1 class="map-header__h1">General Map</h1>

    <div class="map-header-buttons">
      <RouterLink to="/add-place">
        <BaseButton class="medium-button" text="Add new place" />
      </RouterLink>
      <BaseButton class="medium-button grey" text="Log out" @click="handleLogoutClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import { useMapStore } from '@/stores/store'

const store = useMapStore()

const handleLogoutClick = () => {
  store.logout()
}
</script>

<style scoped>
.map-header {
  padding: 25px 0 20px 0;
  display: flex;
  justify-content: space-between;
  gap: 30px;
}
.map-header__h1 {
  color: #555;
}
.map-header-buttons {
  display: flex;
  flex-grow: 1;
  justify-content: end;
  gap: 30px;
}
.medium-button {
  max-width: 200px;
  width: fit-content;
}
</style>
