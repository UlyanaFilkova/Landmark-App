<template>
  <div class="star-rating">
    <!-- <star-rating
      :rating="props.rating"
      :read-only="true"
      :increment="0.01"
      inactive-color="#ccc"
      active-color="gold"
    ></star-rating> -->

    <span>{{ props.rating }}</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
// import StarRating from 'vue-star-rating'

const props = defineProps<{
  rating: number
}>()
console.log(props.rating)
const maxStars = 5
</script>

<style scoped>
.star-rating {
  display: flex;
  justify-content: center;
}

.star {
  font-size: 20px;
  color: #ccc;
}

.star.filled {
  color: gold;
}
</style>
