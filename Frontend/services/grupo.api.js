import axiosInstance from "../helpers/axios-config";

export const grupoService = {

    async joinGroupByCode(data) {
        const response = await axiosInstance.post('/api/grupo/join-by-code', data);
        return response.data;
    },

    async getUserGroup(usuarioId) {
        const response = await axiosInstance.get(`/api/grupo/user/${usuarioId}`);
        return response.data;
    }

};


