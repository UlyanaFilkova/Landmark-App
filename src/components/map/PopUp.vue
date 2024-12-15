<template>
  <div class="popup-content">
    <a :href="props.link" class="popup-title">{{ props.title }}</a>
    <div class="popup-rating">
      <StarRating :rating="props.rating" />
      <!-- <div class="star-rating">
        <star-rating
          :rating="props.rating"
          :read-only="true"
          :increment="0.01"
          inactive-color="#ccc"
          active-color="gold"
        ></star-rating>

        <span>{{ props.rating }}</span>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import StarRating from '@/components/base/StarRating.vue'
// import StarRating from 'vue-star-rating'

const props = defineProps<{
  title: string
  link: string
  rating: number
}>()
</script>

<style scoped>
.popup-content {
  text-align: center;
}

.popup-title {
  font-weight: bold;
  font-size: 16px;
  text-decoration: none;
  color: #004085;
}

.popup-title:hover {
  text-decoration: underline;
}

.popup-rating {
  margin-top: 5px;
  font-size: 14px;
  color: #555;
}
</style>
