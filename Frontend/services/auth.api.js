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
            // Enviar datos de Firebase + rol predefinido al backend
            const dataToSend = {
                ...firebaseData,
                predefinedRole: predefinedRole // Agregar rol predefinido
            };

            const response = await axiosInstance.post('/api/firebase-login', dataToSend);
            
            if (response.data.success) {
                localStorage.setItem('userToken', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.usuario));
            }
            
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error en login con Firebase');
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