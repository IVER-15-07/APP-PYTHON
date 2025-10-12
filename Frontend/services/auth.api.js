// Frontend/services/auth.api.js
import axiosInstance from "../helpers/axios-config";

export const authService = {

    // Registro
    async register(datosUsuario) {
        try {
            const response = await axiosInstance.post('/api/register', datosUsuario);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al registrar usuario');
        }
    },

    // Login local
    async login(credenciales) {
        try {
            const response = await axiosInstance.post('/api/login', credenciales);

            if (response.data.success) {
                localStorage.setItem('userToken', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.usuario));
            }

            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
        }
    },

    // Login Firebase

    async firebaseLogin(firebaseData, predefinedRole = null) {
        try {
            // firebaseData debe incluir idToken
            const payload = {
                idToken: firebaseData?.idToken,
                uid: firebaseData?.uid,
                email: firebaseData?.email,
                displayName: firebaseData?.displayName,
                photoURL: firebaseData?.photoURL,
                predefinedRole: predefinedRole ?? null
            };

            if (!payload.idToken) throw new Error("No hay idToken de Firebase");

            const response = await axiosInstance.post("/api/firebase-login", payload);

            if (response.data?.success) {
                const token = response.data.data.token;
                const usuario = response.data.data.usuario;
                localStorage.setItem("userToken", token);
                localStorage.setItem("user", JSON.stringify(usuario));
                axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            }

            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.message || "Error en login con Firebase");
        }
    },

    // Obtener perfil (requiere token)
    async obtenerPerfil() {
        try {
            const response = await axiosInstance.get('/api/me');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener perfil');
        }
    },

    // Logout
    logout() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
    },

    // Verificar si está autenticado
    isAuthenticated() {
        return !!localStorage.getItem('userToken');
    },

    // Obtener usuario actual
    obtenerUsuarioActual() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};