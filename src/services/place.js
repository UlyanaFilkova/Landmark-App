var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { firestore, collection, addDoc } from '@/services/firebase.config.js';
const placesCollection = collection(firestore, 'places');
const ratingsCollection = collection(firestore, 'ratings');
export const addPlace = (place) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const placeDocRef = yield addDoc(placesCollection, place);
        const rating = {
            rating: place.rating,
            userId: place.authorId,
            placeId: placeDocRef.id,
        };
        const ratingDocRef = yield addDoc(ratingsCollection, rating);
        console.log(ratingDocRef.id);
        return { id: placeDocRef.id };
    }
    catch (error) {
        console.error('Error adding place:', error);
        throw new Error('Error adding place to Firestore');
    }
});
