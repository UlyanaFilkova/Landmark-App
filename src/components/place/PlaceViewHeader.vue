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
import BackButton from '@/components/base/BackButton.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import ConfirmModal from '@/components/base/ConfirmModal.vue'
import { useMapStore } from '@/stores/mapStore'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const mapStore = useMapStore()
const userStore = useUserStore()
const router = useRouter()

const showModal = ref(false)

const handleBackClick = () => {
  mapStore.removeCurrentPlace()
}

const userHasEditPermission = computed(() => {
  return userStore.getUser?.role === 1 || mapStore.getCurrentPlace?.authorId === userStore.getUser?.id
})

const handleDeleteClick = async () => {
  showModal.value = false
  await mapStore.removePlace(mapStore.getCurrentPlace!.id)
  mapStore.fetchPlaces()
  router.push({ name: 'generalMap' })
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
