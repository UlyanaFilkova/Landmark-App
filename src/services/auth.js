"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUsernameExists = exports.registerUser = exports.checkUser = void 0;
const firebase_config_js_1 = require("@/services/firebase.config.js");
const usersCollection = (0, firebase_config_js_1.collection)(firebase_config_js_1.firebase, 'users');
const checkUser = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const q = (0, firebase_config_js_1.query)(usersCollection, (0, firebase_config_js_1.where)('username', '==', username));
        const querySnapshot = yield (0, firebase_config_js_1.getDocs)(q);
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
exports.checkUser = checkUser;
const registerUser = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = {
            username,
            password,
            role: 2,
        };
        const docRef = yield (0, firebase_config_js_1.addDoc)(usersCollection, newUser);
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
exports.registerUser = registerUser;
const checkUsernameExists = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const q = (0, firebase_config_js_1.query)(usersCollection, (0, firebase_config_js_1.where)('username', '==', username));
        const querySnapshot = yield (0, firebase_config_js_1.getDocs)(q);
        return !querySnapshot.empty; // true if user exists
    }
    catch (error) {
        console.error('Error checking username existence:', error);
        return false;
    }
});
exports.checkUsernameExists = checkUsernameExists;
