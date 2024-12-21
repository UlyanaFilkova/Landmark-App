<template>
  <BackButton path="general-map" />
  <h2>{{ title }}</h2>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import BackButton from '@/components/base/BackButton.vue'

const props = defineProps<{
  title: string
}>()
</script>

<style scoped>
h2 {
  text-align: center;
  font-size: 24px;
}
</style>
