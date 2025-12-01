// Frontend/services/auth.api.js
import axiosInstance from "../helpers/axios-config";

export const authService = {

    async registerSendCode(datospending) {
        try {
            const response = await axiosInstance.post('/api/register/send-code', datospending);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al enviar código de verificación');
        }
    },

    async registerVerifyCode(verifydata) {
        try {
            const response = await axiosInstance.post('/api/register/verify-code', verifydata);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al verificar código de verificación');
        }
    },

    async register(datosUsuario) {
        try {
            const response = await axiosInstance.post('/api/register', datosUsuario);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al registrar usuario');
        }
    },


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

    async firebaseLogin({ idToken, roleId }) {
        const { data } = await axiosInstance.post("/firebase-login", { idToken, roleId });
        if (data?.success) {
            const { token, usuario } = data.data;
            localStorage.setItem("userToken", token);
            localStorage.setItem("user", JSON.stringify(usuario));
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        return data;
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