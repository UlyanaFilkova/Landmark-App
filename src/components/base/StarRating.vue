<template>
  <Rating
    v-model:rating="rating"
    :readOnly="readonly"
    :increment="increment"
    :fixedPoints="1"
    :activeColor="activeColor"
    :inactiveColor="inactiveColor"
    :starSize="starSize"
    :text-class="textClass"
    showRating
    :class="{ 'pointer-cursor': !readonly }"
  />
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
  increment: {
    type: Number,
    default: 0.1,
  },
  starSize: {
    type: Number,
    default: 24,
  },
  textClass: {
    type: String,
    default: 'normal',
  },
})

const emit = defineEmits(['update:rating'])

const rating = ref(props.rating)
const activeColor = '#ffc013'
const inactiveColor = '#aaa'

watch(rating, (newValue) => {
  emit('update:rating', newValue)
})
</script>

<style>
.sr-only span {
  display: none;
}

.v-star-rating-stars {
  display: flex;
  align-items: center;
}

.normal {
  margin-left: 5px;
  font-size: 16px;
  color: #555;
}

.big {
  margin-left: 5px;
  font-size: 20px;
  color: #555;
}

.pointer-cursor {
  cursor: pointer;
}
</style>
