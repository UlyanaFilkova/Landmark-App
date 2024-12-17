<template>
  <div class="container">
    <BaseLoader v-if="isLoading" />
    <MapHeader />
    <MapBlock />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MapHeader from '@/components/map/MapHeader.vue'
import MapBlock from '@/components/map/MapBlock.vue'
import BaseLoader from '@/components/base/BaseLoader.vue'
import { uploadImage } from '@/services/storage'

const isLoading = false

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      const placeId = 'xSwJyG2uw1YyekTQyBBu'
      const imageId = await uploadImage(file, placeId)
      console.log('Image uploaded with ID: ', imageId)
    } catch (error) {
      console.error('Error uploading image: ', error)
    }
  }
}
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
