// Frontend/services/firebase.api.js
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../src/config/firebaseConfig.jsx'; // ← Cambiar ruta
import axiosInstance from '../helpers/axios-config.js';

export const firebaseService = {
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const firebaseToken = await user.getIdToken();
      
      const response = await axiosInstance.post('/auth/firebase-login', {
        firebaseToken,
        userData: {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid
        }
      });

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

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('authToken');
  }
};