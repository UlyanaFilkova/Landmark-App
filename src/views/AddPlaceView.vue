<template>
  <div class="place-view">
    <h2>Add a New Place</h2>
    <NewPlaceForm />
  </div>
</template>

<script setup lang="ts">
import NewPlaceForm from '@/components/place/NewPlaceForm.vue'
</script>

<style scoped>
.place-view h2 {
  margin: 20px;
  text-align: center;
}
</style>
