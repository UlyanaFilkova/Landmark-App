var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { firestore, collection, addDoc, query, where, getDocs, updateDoc, doc, } from '@/services/firebase.config.js';
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
        yield addDoc(ratingsCollection, rating);
        return { id: placeDocRef.id };
    }
    catch (error) {
        console.error('Error adding place:', error);
        throw new Error('Error adding place to Firestore');
    }
});
export const addRating = (rating) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ratingsQuery = query(ratingsCollection, where('placeId', '==', rating.placeId), where('userId', '==', rating.userId));
        const ratingsSnapshot = yield getDocs(ratingsQuery);
        if (!ratingsSnapshot.empty) {
            const ratingDocRef = ratingsSnapshot.docs[0].ref;
            yield updateDoc(ratingDocRef, { rating: rating.rating });
            yield updatePlaceRating(rating.placeId);
            return { id: ratingDocRef.id };
        }
        else {
            const ratingDocRef = yield addDoc(ratingsCollection, rating);
            yield updatePlaceRating(rating.placeId);
            return { id: ratingDocRef.id };
        }
    }
    catch (error) {
        console.error('Error adding or updating rating:', error);
        throw new Error('Error adding or updating rating in Firestore');
    }
});
const updatePlaceRating = (placeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ratingsQuery = query(ratingsCollection, where('placeId', '==', placeId));
        const ratingsSnapshot = yield getDocs(ratingsQuery);
        let totalRating = 0;
        let ratingCount = 0;
        ratingsSnapshot.forEach((doc) => {
            const ratingData = doc.data();
            totalRating += ratingData.rating;
            ratingCount++;
        });
        const metricRating = calculateMetricRating(totalRating, ratingCount);
        const placeDocRef = doc(firestore, `places/${placeId}`);
        yield updateDoc(placeDocRef, {
            rating: metricRating
        });
    }
    catch (error) {
        console.error('Error updating place rating:', error);
        throw new Error('Error updating place rating in Firestore');
    }
});
const calculateMetricRating = (totalRating, ratingCount) => {
    const k = 0.1;
    const averageRating = ratingCount ? totalRating / ratingCount : 0;
    const metricRating = averageRating * (1 - Math.exp(-k * ratingCount));
    return metricRating;
};
