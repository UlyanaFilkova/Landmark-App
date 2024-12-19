var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { firestore, collection, getDocs } from '@/services/firebase.config.js';
const placesCollection = collection(firestore, 'places');
const ratingsCollection = collection(firestore, 'ratings');
export const getPlacesData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const querySnapshot = yield getDocs(placesCollection);
        const places = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            data.id = doc.id;
            return data;
        });
        return places;
    }
    catch (error) {
        console.error('Error getting places:', error);
        throw new Error('Error getting places');
    }
});
export const getRatingsData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const querySnapshot = yield getDocs(ratingsCollection);
        const ratings = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            data.id = doc.id;
            return data;
        });
        return ratings;
    }
    catch (error) {
        console.error('Error getting ratings:', error);
        throw new Error('Error getting ratings');
    }
});
