<template>
  <div class="place-header">
    <BackLink path="../general-map" />
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

import BackLink from '@/components/base/BackLink.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import ConfirmModal from '@/components/base/ConfirmModal.vue'
import { useMapStore } from '@/stores/mapStore'

import { useUserStore } from '@/stores/userStore'

import type { Place } from '@/types/interfaces.ts'

const userStore = useUserStore()
const mapStore = useMapStore()
const router = useRouter()

const showModal = ref(false)

const props = defineProps<{ place: Place | null }>()

const userHasEditPermission = computed(() => {
  if (props.place) {
    return userStore.getUser?.role === 1 || userStore.getUser?.id === props.place.authorId
  }
  return false
})

const handleDeleteClick = async () => {
  showModal.value = false

  if (props.place) {
    await mapStore.removePlace(props.place.id)
    mapStore.fetchPlaces()
    router.push({ name: 'generalMap' })
  } else {
    console.error('props.place is undefined')
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
