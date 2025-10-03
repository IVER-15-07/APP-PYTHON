import axiosInstance from "../helpers/axios-config";

export const usuarioService = {

    async obtenerUsuarios() {
        try {
            const response = await axiosInstance.get('/usuarios');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.mensaje || 'Error al obtener usuarios');
        }
    },

    // Obtener usuario por ID
    async obtenerUsuarioPorId(id) {
        try {
            const response = await axiosInstance.get(`/usuarios/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.mensaje || 'Error al obtener usuario');
        }
    },

    // Crear usuario
    async crearUsuario(datosUsuario) {
        try {
            const response = await axiosInstance.post('/usuarios', datosUsuario);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.mensaje || 'Error al crear usuario');
        }
    },

    // Actualizar usuario
    async actualizarUsuario(id, datosUsuario) {
        try {
            const response = await axiosInstance.put(`/usuarios/${id}`, datosUsuario);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.mensaje || 'Error al actualizar usuario');
        }
    },

    // Eliminar usuario
    async eliminarUsuario(id) {
        try {
            const response = await axiosInstance.delete(`/usuarios/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.mensaje || 'Error al eliminar usuario');
        }
    }

}


