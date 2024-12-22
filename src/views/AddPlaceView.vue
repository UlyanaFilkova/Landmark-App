<template>
  <div class="place-view">
    <PlaceHeader/>
    <NewPlaceForm />
  </div>
</template>

<script setup lang="ts">
import NewPlaceForm from '@/components/place/NewPlaceForm.vue'
import PlaceHeader from '@/components/place/PlaceHeader.vue'
</script>

<style scoped>
.place-view {
  width: 90%;
  max-width: 600px;
}


</style>
