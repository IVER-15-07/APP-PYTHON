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

    async firebaseLogin(firebaseData, predefinedRole = null) {
        try {
            // Intentar obtener el Firebase ID token de varias fuentes:
            let idToken =
                firebaseData?.idToken ??
                firebaseData?.tokenId ??
                null;

            // Si nos pasaron un user de Firebase (result.user), obtener ID token con getIdToken()
            if (!idToken && firebaseData?.user?.getIdToken) {
                idToken = await firebaseData.user.getIdToken();
            }

            // Si nos pasaron result (de signInWithPopup) con credential
            if (!idToken && firebaseData?.credential?.idToken) {
                idToken = firebaseData.credential.idToken;
            }

            if (!idToken) throw new Error("No hay idToken de Firebase");

            const payload = {
                idToken,
                roleId: predefinedRole ?? firebaseData?.roleId ?? null,
                uid: firebaseData?.uid ?? firebaseData?.user?.uid ?? null,
                email: firebaseData?.email ?? firebaseData?.user?.email ?? null,
                displayName: firebaseData?.displayName ?? firebaseData?.user?.displayName ?? null,
                photoURL: firebaseData?.photoURL ?? firebaseData?.user?.photoURL ?? null
            };

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
            // eslint-disable-next-line no-console
            console.error("firebaseLogin (client) error:", error?.response ?? error);
            const serverMsg = error?.response?.data?.message ?? error.message ?? "Error en login con Firebase";
            throw new Error(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg));
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