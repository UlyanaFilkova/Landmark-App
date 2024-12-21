<template>
  <div class="place-header">
    <BackButton path="general-map" />
   
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import BackButton from '@/components/base/BackButton.vue'

const props = defineProps<{
  title: string
}>()
</script>

<style scoped>

.place-header{
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 15px 0;
}

</style>
