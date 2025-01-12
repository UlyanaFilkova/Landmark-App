<template>
  <div class="location-input">
    <div class="form-group form-group-inline">
      <label class="main-label">{{ $t('place.location') }}:</label>
      <div class="inputs">
        <div class="input-group">
          <label>{{ $t('place.latitude') }}:</label>
          <input
            v-model="latitude"
            @input="updateLatitude()"
            type="number"
            step="any"
            :placeholder="$t('place.latitude')"
            required
            min="-90"
            max="90"
          />
        </div>
        <div class="input-group">
          <label>{{ $t('place.longitude') }}:</label>
          <input
            v-model="longitude"
            @input="updateLongitude()"
            type="number"
            step="any"
            :placeholder="$t('place.longitude')"
            required
            min="-180"
            max="180"
          />
        </div>
      </div>
      <p v-if="locationInvalid" class="error-message">
        {{ $t('inputs.validation.invalidLocation') }}
      </p>
    </div>

    <MapComponent
      :points="[point]"
      :readonly="false"
      :single="true"
      @update:сoordinates="updateCoordinatesFromMap"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import MapComponent from '@/components/common/MapComponent.vue'
import type { MapPoint } from '@/types/interfaces.ts'

interface Props {
  latitude: number
  longitude: number
  locationInvalid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  locationInvalid: false,
})

const latitude = ref(props.latitude)
const longitude = ref(props.longitude)

const point = computed<MapPoint>(() => {
  return {
    id: '',
    title: '',
    location: [latitude.value, longitude.value],
    rating: 0,
    photos: [],
  }
})

const emit = defineEmits(['update:latitude', 'update:longitude'])

const updateLatitude = () => {
  emit('update:latitude', latitude.value)
}

const updateLongitude = () => {
  emit('update:longitude', longitude.value)
}

const updateCoordinatesFromMap = (coordinates: [number, number]) => {
  latitude.value = coordinates[0]
  longitude.value = coordinates[1]
  updateLatitude()
  updateLongitude()
}

watch(
  () => [props.latitude, props.longitude],
  ([newLat, newLng]) => {
    latitude.value = newLat
    longitude.value = newLng
  },
)
</script>

<style scoped>
.location-input {
  margin-bottom: 20px;
}

.map-container {
  height: 300px;
  width: 100%;
  border: 3px solid var(--color-border-three);
  border-radius: 5px;
  margin-top: 20px;
}

.error-message {
  color: var(--color-invalid-input);
  font-size: 12px;
  margin-top: 10px;
}

.main-label {
  font-weight: 600;
  margin-bottom: 20px;
  display: block;
}

.inputs {
  display: flex;
  gap: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
}

input {
  width: 90%;
  padding: 10px;
  border: none;
  outline: 1px solid var(--color-14);
  border-radius: 5px;
}

input:focus {
  outline: 1.5px solid var(--color-14-hover);
}
</style>
