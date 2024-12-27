<template>
  <div class="place-header">
    <BackButton path="general-map" @click="handleBackClick" />
    <div v-if="userHasEditPermission" class="header-buttons">
      <RouterLink to="/add-place">
        <BaseButton class="medium-button grey" text="Edit" />
      </RouterLink>
      <BaseButton class="medium-button red" text="Delete" @click="showModal = true" />
      <ConfirmModal
        :isVisible="showModal"
        @confirm="handleDeleteClick"
        @cancel="showModal = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import BackButton from '@/components/base/BackButton.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import ConfirmModal from '@/components/base/ConfirmModal.vue'

import { useMapStore } from '@/stores/mapStore'
import { useUserStore } from '@/stores/userStore'

const mapStore = useMapStore()
const userStore = useUserStore()
const router = useRouter()

const showModal = ref(false)

const userHasEditPermission = computed(() => {
  return (
    userStore.getUser?.role === 1 || mapStore.getCurrentPlace?.authorId === userStore.getUser?.id
  )
})

const handleBackClick = () => {
  mapStore.removeCurrentPlace()
}

const handleDeleteClick = async () => {
  showModal.value = false
  const currentPlace = mapStore.getCurrentPlace

  if (currentPlace) {
    await mapStore.removePlace(currentPlace.id)
    mapStore.fetchPlaces()
    router.push({ name: 'generalMap' })
  } else {
    console.error('Current place is undefined')
  }
}
</script>

<style scoped>
.place-header {
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
}

.header-buttons {
  display: flex;
  gap: 20px;
}

.medium-button {
  max-width: 200px;
  width: fit-content;
  padding: 10px 20px;
}
</style>
