import { ref, computed, onMounted, watch } from 'vue'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import { Place } from '@/types/interfaces'
import { useMapStore } from '@/stores/store'
import { usePopup } from '@/composables/usePopup'

export function useMap() {
  const store = useMapStore()
  const { createPopUp } = usePopup()

  const mapContainer = ref<HTMLDivElement | null>(null)
  const map = ref<L.Map>()
  const markers = ref<L.MarkerClusterGroup>()
  const checkboxChecked = ref<Boolean>(false)

  const addMarkers = (places: Place[]) => {
    if (map.value) {
      markers.value?.clearLayers()
      places.forEach((place) => {
        const marker = L.marker(place.location).bindPopup(createPopUp(place))
        markers.value?.addLayer(marker)
      })
    }
  }

  const places = computed(() => store.getFilteredPlaces)

  const initializeMap = async () => {
    if (mapContainer.value) {
      map.value = L.map(mapContainer.value).setView([53.9, 27.5667], 11)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)

      markers.value = L.markerClusterGroup()
      map.value.addLayer(markers.value)

      addMarkers(places.value)
    }
  }

  const handleCheckboxChange = () => {
    checkboxChecked.value = !checkboxChecked.value
    store.setOnlyUserPlaces(checkboxChecked.value)
  }

  watch(
    () => store.getFilteredPlaces,
    (newPlaces) => {
      addMarkers(newPlaces)
      setTimeout(() => {
        if (map.value) {
          map.value.invalidateSize()
        }
      }, 200)
    },
    { immediate: true }
  )

  onMounted(async () => {
    checkboxChecked.value = store.getOnlyUserPlaces
    initializeMap()
  })

  return {
    mapContainer,
    checkboxChecked,
    handleCheckboxChange,
  }
}

