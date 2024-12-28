<template>
  <div class="place-header">
    <BackLink path="../general-map" />
  </div>
</template>

<script setup lang="ts">
import BackLink from '@/components/base/BackLink.vue'
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

h2 {
  text-align: center;
  font-size: 24px;
  margin: -10px 0 20px 0;
}
</style>
