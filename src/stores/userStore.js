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
import { getUserById } from '@/services/user';
import router from '@/router';
export const useUserStore = defineStore('user', () => {
    const user = ref(undefined);
    const userId = computed(() => localStorage.getItem('userId'));
    const getUser = computed(() => user.value);
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
    const logout = () => {
        localStorage.removeItem('userId');
        router.push({ name: 'login' });
        resetStore();
    };
    const resetStore = () => {
        user.value = undefined;
    };
    return {
        getUser,
        fetchUser,
        logout,
    };
});
