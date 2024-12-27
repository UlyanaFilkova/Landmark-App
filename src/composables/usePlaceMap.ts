import { ref, onMounted, watch } from 'vue'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'

type Emit = (event: 'update:latitude' | 'update:longitude', ...args: any[]) => void

export function usePlaceMap(
  initialLatitude: number,
  initialLongitude: number,
  readonly: boolean,
  emit?: Emit,
) {
  const mapContainer = ref<HTMLDivElement | null>(null)
  const map = ref<L.Map>()
  const marker = ref<L.Marker | null>(null)
  const latitude = ref(initialLatitude)
  const longitude = ref(initialLongitude)

  const initializePlaceMap = async () => {
    if (mapContainer.value) {
      map.value = L.map(mapContainer.value).setView([latitude.value, longitude.value], 11)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)

      if (!readonly) {
        map.value.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng
          updateLatitude(lat)
          updateLongitude(lng)

          if (marker.value) {
            marker.value.setLatLng(e.latlng)
          } else {
            marker.value = L.marker(e.latlng).addTo(map.value)
          }
        })
      }

      updateMapCenter(latitude.value, longitude.value)
    }
  }

  const updateMapCenter = (lat: number, lng: number) => {
    if (map.value) {
      map.value.setView([lat, lng], map.value.getZoom())
      if (marker.value) {
        marker.value.setLatLng([lat, lng])
      } else {
        marker.value = L.marker([lat, lng]).addTo(map.value)
      }
    }
  }

  const updateLatitude = (lat: number) => {
    if (emit) {
      emit('update:latitude', lat)
    }
  }

  const updateLongitude = (lon: number) => {
    if (emit) {
      emit('update:longitude', lon)
    }
  }

  watch(
    () => [latitude, longitude],
    ([newLat, newLng]) => {
      updateMapCenter(newLat.value, newLng.value)
    },
  )

  onMounted(() => {
    initializePlaceMap()
  })

  return {
    mapContainer,
  }
}
