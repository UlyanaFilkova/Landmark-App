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
import { defineProps, withDefaults, ref, watch, defineEmits } from 'vue'
import { Rating } from '@morpheme/rating'

interface Props {
  rating: number
  readonly?: boolean
  increment?: number
  starSize?: number
  textClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  increment: 0.1,
  starSize: 24,
  textClass: 'normal',
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
  color: var(--color-14);
}

.big {
  margin-left: 5px;
  font-size: 20px;
  color: var(--color-14);
}

.pointer-cursor {
  cursor: pointer;
}
</style>
