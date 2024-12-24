<template>
  <div class="text-center">
    <v-rating
      v-model="rating"
      :half-increments="true"
      color="yellow"
      background-color="grey lighten-3"
      hover
      dense
    ></v-rating>
    <star-rating v-model:rating="rating"></star-rating>
    <pre>{{ rating }}</pre>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, defineEmits } from 'vue'
import StarRating from 'vue-star-rating'

const props = defineProps({
  rating: {
    type: Number,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:rating'])

const rating = ref(props.rating)

watch(rating, (newValue) => {
  emit('update:rating', newValue)
})
</script>

<style scoped>
.v-rating {
  margin-top: 20px;
}
</style>
