import axiosInstance from "../../../../helpers/axios-config";

export const grupoService = {

    async joinGroupByCode(data) {
        const response = await axiosInstance.post('/api/join-by-code', data);
        return response.data;
    },

    async getUserGroup(usuarioId) {
        try {
            const response = await axiosInstance.get(`/api/user/${usuarioId}`);
            return response.data;
        } catch (error) {

            throw new Error(error.response?.data?.message || 'Error al obtener el grupo del usuario');
        }
    },

    async getTopicsByLevel(nivelId) {
        try {
            const response = await axiosInstance.get(`/api/topics/nivel/${nivelId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener los tópicos del nivel');
        }   
    },
 
};