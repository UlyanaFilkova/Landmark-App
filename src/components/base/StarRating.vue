<template>
  <div class="star-rating">
    <vue-star-ratings v-model="props.rating" starColor="gold" disableClick :customSvg="StarIcon"/>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import VueStarRatings from 'vue3-star-ratings'
import StarIcon from '@/components/icons/StarIcon.vue'

const props = defineProps<{
  rating: number
}>()
</script>

<style scoped>
.star-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px 0;
}

.invalid-input {
  font-size: 12px;
  color: red;
  margin-top: 5px;
}
</style>
