<template>
  <div class="map-header">
    <div class="map-header-container">
      <h1 class="map-header__h1">Map</h1>
      <RouterLink to="/add-place">
        <BaseButton class="medium-button" text="Add new place" />
      </RouterLink>
    </div>
    <div class="map-header-container single">
      <h2 class="map-header__h2">Top Places</h2>
      <BaseButton class="medium-button grey" text="Log out" @click="handleLogoutClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import { useUserStore } from '@/stores/userStore.ts'

const store = useUserStore()

const handleLogoutClick = () => {
  store.logout()
}
</script>

<style scoped>
.map-header {
  padding: 20px 0 0 0;
  display: flex;
  justify-content: space-between;
  gap: 30px;
}
.map-header-container {
  display: flex;
  justify-content: space-between;
  width: 50%;
  align-items: center;
}
.map-header__h1 {
  color: #555;
}

.map-header__h2 {
  color: #555;
  flex-grow: 1;
  text-align: center;
  padding: 0;
  line-height: normal;
}

@media (max-width: 992px) {
  .map-header__h2 {
    display: none;
  }
  .map-header-container {
    display: flex;
    justify-content: space-between;
    width: auto;
    flex-grow: 1;
    align-items: center;
  }
  .map-header-container.single{
    width: fit-content;
    flex-grow: 0;
  }
}

.medium-button {
  max-width: 200px;
  width: fit-content;
}
</style>
