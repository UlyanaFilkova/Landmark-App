// import { ref, onMounted, watch } from 'vue'
// import type { Ref } from 'vue'
// import { tileLayer, marker, map, Map, MarkerClusterGroup } from 'leaflet'
// import 'leaflet/dist/leaflet.css'
// import 'leaflet.markercluster/dist/MarkerCluster.css'
// import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
// import 'leaflet.markercluster'
// import { convertBase64ToFiles } from '@/utils/typeConversion.ts'
// import type { Place } from '@/types/interfaces'

// export function useMap(places: Ref<Place[]>) {
//   const mapContainer = ref<HTMLDivElement | null>(null)
//   const mapEntity = ref<Map>()
//   const markers = ref<MarkerClusterGroup>()

//   const createPopUp = (place: Place) => {
//     const popupContainer = document.createElement('div')

//     const getFileUrl = (file: File) => URL.createObjectURL(file)
//     const photos = place.photos ? convertBase64ToFiles(place.photos) : []

//     const htmlContent = `
//       <div class="popup-content">
//         <a href="/place/${place.id}" target="_blank" class="popup-title">
//           ${place.title}
//         </a>
//         <div class="star-rating" style="pointer-events: none;">
//           Rating: ${place.rating}<span class="star">★</span>
//         </div>
//         ${
//           photos.length > 0
//             ? `<div class="place-photo-wrapper">
//            <img src="${getFileUrl(photos[0])}" class="place-photo" />
//          </div>`
//             : ''
//         }
//       </div>
//     `
//     popupContainer.innerHTML = htmlContent

//     return popupContainer
//   }

//   const addMarkers = (places: Place[]) => {
//     if (mapEntity.value) {
//       markers.value?.clearLayers()
//       places.forEach((place) => {
//         const markerEntity = marker(place.location).bindPopup(createPopUp(place))
//         markers.value?.addLayer(markerEntity)
//       })
//     }
//   }

//   const initializeGeneralMap = () => {
//     if (mapContainer.value) {
//       mapEntity.value = map(mapContainer.value).setView([53.9, 27.5667], 11)

//       tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapEntity.value)

//       markers.value = new MarkerClusterGroup()
//       mapEntity.value.addLayer(markers.value)

//       addMarkers(places.value)
//     }
//   }

//   const handleMapMove = () => {
//     if (mapEntity.value) {
//       addMarkers(places.value)
//     }
//   }

//   const addMapMoveEvents = () => {
//     if (mapEntity.value) {
//       mapEntity.value.on('moveend', handleMapMove)
//       mapEntity.value.on('zoomend', handleMapMove)
//     }
//   }

//   watch(
//     () => places.value,
//     (newPlacesValue) => {
//       addMarkers(newPlacesValue)
//       setTimeout(() => {
//         if (mapEntity.value) {
//           mapEntity.value.invalidateSize()
//         }
//       }, 200)
//     },
//     { immediate: true },
//   )

//   onMounted(() => {
//     initializeGeneralMap()
//     addMapMoveEvents()
//   })

//   return {
//     mapContainer,
//   }
// }
