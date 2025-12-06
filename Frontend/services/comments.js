import axiosInstance from "../helpers/axios-config";

export const commentService = {

    async crearComentario(data) {   
        try {
            const response = await axiosInstance.post('api/comments', data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al crear comentario');
        }
    },

    async responderComentario(data) {   
        try {
            const response = await axiosInstance.post('api/replies', data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al responder comentario');
        }
    },

    async getComentarios(teacherId) {   
        try {
            const response = await axiosInstance.get(`api/comments/${teacherId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener comentarios');
        }
    },
}