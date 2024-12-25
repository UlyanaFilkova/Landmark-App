<template>
  <div class="text-center">
    <Rating v-model:rating="rating" readOnly />

    <pre>{{ rating }}</pre>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, defineEmits } from 'vue'
import { Rating } from '@morpheme/rating'

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
