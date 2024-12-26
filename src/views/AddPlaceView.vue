<template>
  <div class="place-view">
    <PlaceAddHeader class="place-header"/>
    <NewPlaceForm />
  </div>
</template>

<script setup lang="ts">
import NewPlaceForm from '@/components/place/NewPlaceForm.vue'
import PlaceAddHeader from '@/components/place/PlaceAddHeader.vue'
</script>

<style scoped>
.place-view {
  width: 90%;
  max-width: 600px;
}

@media (max-width: 576px) {
.place-header{
  margin-bottom: 10px;
}
}
</style>
