<template>
  <div class="container">
    <BaseLoader v-if="isLoading" />
    <MapHeader />
    <MapBlock />
    <TopPlaces/>

    <!-- <div>
      <input type="file" @change="handleFileUpload" accept="image/*" />
      <p v-if="imageBase64">Base64 String:</p>
      <textarea v-if="imageBase64" readonly>{{ imageBase64 }}</textarea>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeMount } from 'vue'
import MapHeader from '@/components/map/MapHeader.vue'
import MapBlock from '@/components/map/MapBlock.vue'
import TopPlaces from '@/components/map/TopPlaces.vue'
import BaseLoader from '@/components/base/BaseLoader.vue'
import { useMapStore } from '@/stores/store'

const store = useMapStore()
const isLoading = ref(true)

onBeforeMount(async () => {
  await store.loadInitialData()
  isLoading.value = false
})


// const imageBase64 = ref<string | null>(null)

// // Конвертация файла в строку Base64
// const handleFileUpload = (event: Event) => {
//   const file = (event.target as HTMLInputElement)?.files?.[0]
//   if (!file) return

//   const reader = new FileReader()
//   reader.onload = () => {
//     imageBase64.value = reader.result as string
//   }
//   reader.onerror = (error) => {
//     console.error('Ошибка при чтении файла:', error)
//   }
//   reader.readAsDataURL(file) // Чтение файла и конвертация в Base64
// }

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
