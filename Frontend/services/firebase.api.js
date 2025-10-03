// Frontend/services/firebase.api.js
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../src/config/firebaseConfig.jsx';
import axiosInstance from '../helpers/axios-config.js';

export const firebaseService = {
    // Login con Google
    async loginWithGoogle() {
        try {
            // 1. Login con Firebase
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // 2. Obtener token de Firebase
            const firebaseToken = await user.getIdToken();

            // 3. Enviar al backend
            const response = await axiosInstance.post('/auth/firebase-login', {
                firebaseToken,
                userData: {
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    uid: user.uid
                }
            });

            // 4. Guardar token del backend
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.usuario));

            return {
                success: true,
                user: response.data.usuario,
                token: response.data.token
            };
        } catch (error) {
            console.error('Error en login:', error);
            throw new Error(error.response?.data?.mensaje || error.message);
        }
    },

    // Logout
    async logout() {
        try {
            await signOut(auth);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            return { success: true };
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Verificar si está logueado
    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    },

    // Obtener usuario guardado
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Obtener token
    getToken() {
        return localStorage.getItem('authToken');
    }
};