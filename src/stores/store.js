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
import { getPlacesData, getRatingsData } from '@/services/map';
import { getUserById } from '@/services/user';
import { addPlace, addRating } from '@/services/place';
import router from '@/router';
export const useMapStore = defineStore('map', () => {
    const places = ref([]);
    const filteredPlaces = ref([]);
    const ratings = ref([]);
    const user = ref();
    const currentPlace = ref();
    const currentPlaceUserRating = ref();
    const onlyUserPlaces = ref(false);
    const userId = computed(() => localStorage.getItem('userId'));
    const getPlaces = computed(() => places.value);
    const getFilteredPlaces = computed(() => filteredPlaces.value);
    const getRatings = computed(() => ratings.value);
    const getUser = computed(() => user.value);
    const getCurrentPlace = computed(() => currentPlace.value);
    const getOnlyUserPlaces = computed(() => onlyUserPlaces.value);
    const getCurrentPlaceUserRating = computed(() => currentPlaceUserRating.value);
    const fetchPlaces = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const fetchedPlaces = yield getPlacesData();
            places.value = fetchedPlaces;
            places.value.forEach((places) => (places.rating = parseFloat(places.rating.toFixed(1))));
            filterPlaces();
        }
        catch (error) {
            console.error(error);
        }
    });
    const filterPlaces = () => {
        if (onlyUserPlaces.value) {
            filteredPlaces.value = places.value.filter((place) => place.authorId === userId.value);
        }
        else {
            filteredPlaces.value = places.value;
        }
    };
    const fetchRatings = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const fetchedRatings = yield getRatingsData();
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
            }
        }
        catch (error) {
            console.error('Error fetching user:', error);
        }
    });
    const setNewCurrentPlaceUserRating = (value) => __awaiter(void 0, void 0, void 0, function* () {
        currentPlaceUserRating.value = value;
        const rating = {
            rating: value,
            userId: userId.value,
            placeId: currentPlace.value.id,
        };
        yield addRating(rating);
        yield fetchRatings();
        yield fetchPlaces();
    });
    const loadCurrentPlaceUserRating = () => {
        if (currentPlace.value) {
            const userRating = ratings.value.find((rating) => rating.placeId === currentPlace.value.id && rating.userId === user.value.id);
            console.log(userRating);
            if (userRating) {
                setNewCurrentPlaceUserRating(userRating.rating);
            }
        }
    };
    const loadInitialData = () => __awaiter(void 0, void 0, void 0, function* () {
        yield fetchUser();
        yield fetchPlaces();
        yield fetchRatings();
        loadCurrentPlace();
    });
    const loadCurrentPlace = () => {
        const currentPlaceId = localStorage.getItem('currentPlaceId');
        if (currentPlaceId) {
            currentPlace.value = places.value.find((place) => place.id === currentPlaceId);
        }
        loadCurrentPlaceUserRating();
    };
    const addNewPlace = (placeData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authorId = userId.value;
            if (!authorId) {
                throw new Error('User ID is missing');
            }
            const response = yield addPlace(Object.assign(Object.assign({}, placeData), { authorId, voices: 1 }));
            if (response && response.id) {
                places.value.push(Object.assign(Object.assign({}, placeData), { authorId, id: response.id }));
                return 'success';
            }
            return 'Error adding new place';
        }
        catch (error) {
            console.error('Error adding new place:', error);
        }
    });
    const setCurrentPlace = (place) => {
        currentPlace.value = place;
        localStorage.setItem('currentPlaceId', place.id);
    };
    const removeCurrentPlace = () => {
        currentPlace.value = undefined;
        localStorage.removeItem('currentPlaceId');
        currentPlaceUserRating.value = 0;
    };
    const logout = () => {
        localStorage.removeItem('userId');
        router.push({ name: 'login' });
        resetStore();
    };
    const resetStore = () => {
        places.value = [];
        ratings.value = [];
        user.value = undefined;
        currentPlace.value = undefined;
    };
    const setOnlyUserPlaces = (value) => {
        onlyUserPlaces.value = value;
        filterPlaces();
    };
    return {
        getPlaces,
        getRatings,
        getUser,
        getCurrentPlace,
        getOnlyUserPlaces,
        getFilteredPlaces,
        getCurrentPlaceUserRating,
        fetchPlaces,
        fetchRatings,
        loadInitialData,
        loadCurrentPlace,
        addNewPlace,
        setCurrentPlace,
        removeCurrentPlace,
        logout,
        setOnlyUserPlaces,
        setNewCurrentPlaceUserRating,
    };
});
