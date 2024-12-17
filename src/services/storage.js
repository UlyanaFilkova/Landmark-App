var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, where, getDocs, updateDoc, arrayUnion, doc, } from 'firebase/firestore';
import { storage, firestore } from '@/services/firebase.config.js';
function fetchImages(placeId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const q = query(collection(firestore, 'places'), where('id', '==', placeId));
            const snapshot = yield getDocs(q);
            console.log(snapshot.docs);
            const images = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
            return images;
        }
        catch (error) {
            console.error('Ошибка при получении изображений: ', error);
            throw error;
        }
    });
}
function uploadImage(file, placeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const storageRef = ref(storage, `images/${file.name}`);
        try {
            yield uploadBytes(storageRef, file);
            const downloadURL = yield getDownloadURL(storageRef);
            const q = query(collection(firestore, 'places'), where('id', '==', placeId));
            const snapshot = yield getDocs(q);
            if (!snapshot.empty) {
                const placeDocRef = doc(firestore, 'places', snapshot.docs[0].id);
                yield updateDoc(placeDocRef, {
                    images: arrayUnion({ url: downloadURL }),
                });
                return placeDocRef.id;
            }
            else {
                throw new Error('Place not found');
            }
        }
        catch (error) {
            console.error('Ошибка при загрузке изображения: ', error);
            throw error;
        }
    });
}
export { uploadImage };
