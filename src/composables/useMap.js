var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ref, computed, onMounted, watch } from 'vue';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { useMapStore } from '@/stores/mapStore';
import { usePopup } from '@/composables/usePopup';
export function useMap() {
    const store = useMapStore();
    const { createPopUp } = usePopup();
    const mapContainer = ref(null);
    const map = ref();
    const markers = ref();
    const checkboxChecked = ref(false);
    const addMarkers = (places) => {
        var _a;
        if (map.value) {
            (_a = markers.value) === null || _a === void 0 ? void 0 : _a.clearLayers();
            places.forEach((place) => {
                var _a;
                const marker = L.marker(place.location).bindPopup((placecreatePopUp));
                (_a = markers.value) === null || _a === void 0 ? void 0 : _a.addLayer(marker);
            });
        }
    };
    const places = computed(() => store.getFilteredPlaces);
    const initializeMap = () => __awaiter(this, void 0, void 0, function* () {
        if (mapContainer.value) {
            map.value = L.map(mapContainer.value).setView([53.9, 27.5667], 11);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value);
            markers.value = L.markerClusterGroup();
            map.value.addLayer(markers.value);
            addMarkers(places.value);
        }
    });
    const handleCheckboxChange = () => {
        checkboxChecked.value = !checkboxChecked.value;
        store.setOnlyUserPlaces(checkboxChecked.value);
    };
    watch(() => store.getFilteredPlaces, (newPlaces) => {
        addMarkers(newPlaces);
        setTimeout(() => {
            if (map.value) {
                map.value.invalidateSize();
            }
        }, 200);
    }, { immediate: true });
    const handleMapMove = () => {
        if (map.value) {
            addMarkers(places.value);
        }
    };
    onMounted(() => {
        if (map.value) {
            map.value.on('moveend', handleMapMove);
            map.value.on('zoomend', handleMapMove);
        }
    });
    onMounted(() => __awaiter(this, void 0, void 0, function* () {
        checkboxChecked.value = store.getOnlyUserPlaces;
        initializeMap();
    }));
    return {
        mapContainer,
        checkboxChecked,
        handleCheckboxChange,
    };
}
