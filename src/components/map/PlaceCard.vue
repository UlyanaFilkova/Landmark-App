<template>
  <div class="place-container">
    <div class="place_img">
      <img :src="imageSrc" alt="Place Image" />
    </div>
    <div class="place_info">
      <div class="place_text">
        <p class="place_title">{{ place.title }}</p>
        <p class="place_description" ref="description">{{ place.description }}</p>
      </div>
      <div class="place_rating">{{ place.rating }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, onMounted, ref } from 'vue'
import { Place } from '@/types/interfaces'
import reservePlaceIconPath from '@/assets/img/place_icon.jpg'

const props = defineProps<{
  place: Place
}>()

const imageSrc = computed(() => {
  if (props.place.photos && props.place.photos.length > 0) {
    if (props.place.photos[0].startsWith('data:image')) {
      return props.place.photos[0]
    }
    return `data:image/jpeg;base64,${props.place.photos[0]}`
  } else {
    return reservePlaceIconPath
  }
})

const description = ref<HTMLElement | null>(null)

onMounted(() => {
  if (description.value !== null) {
    const lines = 2
    const lineHeight = parseInt(window.getComputedStyle(description.value).lineHeight, 10)
    const maxHeight = lineHeight * lines
    description.value.style.maxHeight = `${maxHeight}px`
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.place-container {
  display: flex;
  gap: 20px;
  width: 100%;
}
.place_img {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.place_img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 5px;
}

.place_info {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 5px 0 10px 0;
}

.place_text {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.place_title {
  font-size: 20px;
}

.place_description {
  width: 100%;
  font-size: 15px;
  line-height: 1.2;
  color: var(--color-text-second);
  
  /* Для всех браузеров */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Для Firefox */
  display: -moz-box;
  -moz-line-clamp: 2;
  -moz-box-orient: vertical;
}

/* .place_description {
  font-size: 15px;
  line-height: 1.2;
  color: var(--color-text-second);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
} */
</style>
