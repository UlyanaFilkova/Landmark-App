var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { firestore, collection, addDoc, query, where, getDocs } from '@/services/firebase.config.js';
const usersCollection = collection(firestore, 'users');
export const checkUser = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const q = query(usersCollection, where('username', '==', username));
        const querySnapshot = yield getDocs(q);
        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            if (userData.password === password) {
                // if passwords match
                localStorage.setItem('userId', userData.id);
                return '';
            }
        }
        // If the user is not found or the passwords do not match
        return 'Invalid email or password';
    }
    catch (error) {
        console.error('Error checking user:', error);
        return 'Error checking user';
    }
});
export const registerUser = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = {
            username,
            password,
            role: 2,
        };
        const docRef = yield addDoc(usersCollection, newUser);
        if (!docRef) {
            return false;
        }
        localStorage.setItem('userId', docRef.id);
        return true;
    }
    catch (error) {
        console.error('Error registering user:', error);
        return false;
    }
});
export const checkUsernameExists = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const q = query(usersCollection, where('username', '==', username));
        const querySnapshot = yield getDocs(q);
        return !querySnapshot.empty; // true if user exists
    }
    catch (error) {
        console.error('Error checking username existence:', error);
        return false;
    }
});
