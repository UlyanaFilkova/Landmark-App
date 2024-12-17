var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getPlaces, getRatings } from '@/services/map';
import { getUserById } from '@/services/user';
export const useMapStore = defineStore('map', () => {
    const places = ref([]);
    const ratings = ref([]);
    const user = ref();
    const isLoading = ref(false);
    const userId = computed(() => localStorage.getItem('userId'));
    const fetchPlaces = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const fetchedPlaces = yield getPlaces();
            places.value = fetchedPlaces;
        }
        catch (error) {
            console.error(error);
        }
    });
    const fetchRatings = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const fetchedRatings = yield getRatings();
            ratings.value = fetchedRatings;
        }
        catch (error) {
            console.error(error);
        }
    });
    const fetchUser = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userIdValue = userId.value;
            if (userIdValue) {
                user.value = (yield getUserById(userIdValue));
                console.log(user);
            }
        }
        catch (error) {
            console.error('Error fetching user:', error);
        }
    });
    const loadInitialData = () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('start initialising');
        yield fetchUser();
        yield fetchPlaces();
        yield fetchRatings();
    });
    return {
        places,
        ratings,
        isLoading,
        user,
        fetchPlaces,
        fetchRatings,
        loadInitialData,
    };
});
