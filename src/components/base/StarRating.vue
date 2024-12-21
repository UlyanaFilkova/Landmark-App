<template>
  <div class="star-rating">
    <vue3-star-ratings
      v-model="rating"
      starColor="gold"
      inactiveColor="#555"
      :numberOfStars="5"
      :disableClick="props.readonly"
      :customSvg="StarIcon"
    />
    <span>{{ rating }}</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import Vue3StarRatings from 'vue3-star-ratings'
import StarIcon from '@/components/icons/StarIcon.vue'

const props = defineProps<{
  rating: number
  readonly: boolean
}>()

const rating = ref(props.rating)

const emit = defineEmits<{
  (e: 'update:rating', value: number): void
}>()

watch(rating, (newValue) => {
  emit('update:rating', newValue)
})
</script>

<style scoped>
.star-rating {
  display: flex;
  align-items: center;
  gap: 10px;
}
.star-rating span {
  font-size: 20px;
}
</style>
