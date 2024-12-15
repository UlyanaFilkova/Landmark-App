<template>
  <div class="container">
    <BaseLoader v-if="isLoading" />
    <MapBlock />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MapBlock from '@/components/map/MapBlock.vue'
// import BaseButton from '@/components/base/BaseButton.vue'
import BaseLoader from '@/components/base/BaseLoader.vue'
// import { useStore } from 'vuex'

const isLoading = false
</script>

<style scoped>
.container {
  box-sizing: border-box;
  min-height: 100vh;
  margin: 0 20px;
  padding-bottom: 70px;
}
@media (max-width: 576px) {
  .container {
    margin: 0 15px;
  }
}
</style>
