// import { ref, onMounted, watch } from 'vue'
// import { tileLayer, marker, Marker, map, Map } from 'leaflet'
// import type { LeafletMouseEvent } from 'leaflet'
// import 'leaflet/dist/leaflet.css'
// import 'leaflet.markercluster'

// // type UsePlaceMapEmit = (e: 'update:coordinates', value: [number, number]): void
// type Emit = (event: 'update:latitude' | 'update:longitude', ...args: any[]) => void

// export function usePlaceMap(
//   initialLatitude: number,
//   initialLongitude: number,
//   readonly: boolean,
//   emit?: Emit,
// ) {
//   const mapContainer = ref<HTMLDivElement | null>(null)
//   const mapEntity = ref<Map>()
//   const markerEntity = ref<Marker | null>(null)
//   const latitude = ref(initialLatitude)
//   const longitude = ref(initialLongitude)

//   const initializePlaceMap = async () => {
//     if (mapContainer.value) {
//       mapEntity.value = map(mapContainer.value).setView([latitude.value, longitude.value], 11)

//       tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapEntity.value)

//       if (!readonly) {
//         mapEntity.value.on('click', (e: LeafletMouseEvent) => {
//           const { lat, lng } = e.latlng
//           updateLatitude(lat)
//           updateLongitude(lng)

//           if (markerEntity.value) {
//             markerEntity.value.setLatLng(e.latlng)
//           } else if (mapEntity.value) {
//             markerEntity.value = marker(e.latlng).addTo(mapEntity.value)
//           }
//         })
//       }

//       updateMapCenter(latitude.value, longitude.value)
//     }
//   }

//   const updateMapCenter = (lat: number, lng: number) => {
//     if (mapEntity.value) {
//       mapEntity.value.setView([lat, lng], mapEntity.value.getZoom())
//       if (markerEntity.value) {
//         markerEntity.value.setLatLng([lat, lng])
//       } else {
//         markerEntity.value = marker([lat, lng]).addTo(mapEntity.value)
//       }
//     }
//   }

//   const updateLatitude = (lat: number) => {
//     if (emit) {
//       emit('update:latitude', lat)
//     }
//   }

//   const updateLongitude = (lon: number) => {
//     if (emit) {
//       emit('update:longitude', lon)
//     }
//   }

//   watch(
//     () => [latitude, longitude],
//     ([newLat, newLng]) => {
//       updateMapCenter(newLat.value, newLng.value)
//     },
//   )

//   onMounted(() => {
//     initializePlaceMap()
//   })

//   return {
//     mapContainer,
//   }
// }
