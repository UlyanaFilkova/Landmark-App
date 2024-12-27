import { ref, onMounted, watch, createApp, h } from 'vue'
import type { Ref } from 'vue'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import type { Place } from '@/types/interfaces'
import PopUp from '@/components/map/PopUp.vue'

export function useMap(places: Ref<Place[]>) {
  const mapContainer = ref<HTMLDivElement | null>(null)
  const map = ref<L.Map>()
  const markers = ref<L.MarkerClusterGroup>()

  const createPopUp = (place: Place) => {
    const popupContainer = document.createElement('div')

    createApp({
      render() {
        return h(PopUp, { place })
      },
    }).mount(popupContainer)

    return popupContainer
  }

  const addMarkers = (places: Place[]) => {
    if (map.value) {
      markers.value?.clearLayers()
      places.forEach((place) => {
        const marker = L.marker(place.location).bindPopup(createPopUp(place))
        markers.value?.addLayer(marker)
      })
    }
  }

  const initializeGeneralMap = async () => {
    if (mapContainer.value) {
      map.value = L.map(mapContainer.value).setView([53.9, 27.5667], 11)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)

      markers.value = L.markerClusterGroup()
      map.value.addLayer(markers.value)

      addMarkers(places.value)
    }
  }

  const handleMapMove = () => {
    if (map.value) {
      addMarkers(places.value)
    }
  }

  const addMapMoveEvents = () => {
    if (map.value) {
      map.value.on('moveend', handleMapMove)
      map.value.on('zoomend', handleMapMove)
    }
  }

  watch(
    () => places.value,
    (newPlacesValue) => {
      addMarkers(newPlacesValue)
      setTimeout(() => {
        if (map.value) {
          map.value.invalidateSize()
        }
      }, 200)
    },
    { immediate: true },
  )

  onMounted(async () => {
    initializeGeneralMap()
    addMapMoveEvents()
  })

  return {
    mapContainer,
  }
}
