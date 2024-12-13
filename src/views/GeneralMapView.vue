<template>
  <div class="container">
    <BaseLoader v-if="isLoading" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// import HomeHeader from '@/components/home/HomeHeader.vue'
// import BaseButton from '@/components/base/BaseButton.vue'
import BaseLoader from '@/components/base/BaseLoader.vue'
// import { useStore } from 'vuex'

const isLoading = true
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

.fixed-button {
  display: block;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
