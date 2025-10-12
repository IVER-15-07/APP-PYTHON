
// Frontend/src/services/firebase.api.js
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../src/config/firebaseConfig';

export const firebaseAuthService = {

    // ✅ Login con Google
    async loginWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const idToken = await user.getIdToken(); // <- obligatorio
            return {
                success: true,
                data: { idToken, uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL }
            };
        } catch (err) {
            return { success: false, message: err.message };
        }
    },
    // ✅ Logout de Firebase
    async logout() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            throw new Error('Error al cerrar sesión de Firebase');
        }
    },

    // ✅ Obtener usuario actual de Firebase
    getCurrentUser() {
        return auth.currentUser;
    },

    // ✅ Verificar si está autenticado en Firebase
    isAuthenticated() {
        return !!auth.currentUser;
    },

    // ✅ Mensajes de error personalizados
    getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/popup-closed-by-user': 'Ventana cerrada por el usuario',
            'auth/popup-blocked': 'Popup bloqueado por el navegador',
            'auth/cancelled-popup-request': 'Solicitud de popup cancelada',
            'auth/account-exists-with-different-credential': 'Ya existe una cuenta con este email',
            'auth/user-cancelled': 'Usuario canceló la operación',
            'auth/network-request-failed': 'Error de conexión de red',
            'auth/too-many-requests': 'Demasiados intentos, intenta más tarde'
        };

        return errorMessages[errorCode] || 'Error de autenticación con Google';
    }
};