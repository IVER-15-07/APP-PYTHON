import axiosInstance from "../helpers/axios-config";

export const topicsService = {
    //recuperar todos los tópicos
    async getAllTopics() {
        try {
            const response = await axiosInstance.get("/api/topics");
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener los tópicos');
        }
    },

    //crea todos los tópicos con recursos
    async createTopic(topicData, files) {
        try {
            const formData = new FormData();
            Object.entries(topicData).forEach(([key, value]) => {
                formData.append(key, value);
            });
            files.forEach((file) => {
                formData.append("files", file);
            });
            const response = await axiosInstance.post("/api/topic", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error al crear el tópico");
        }
    },
        //obtener tipos de tópico
    async getTopicTypes() {
        try {
            const response = await axiosInstance.get("/api/topic-types");
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener los tipos de tópico');
        }
    },

    //obtener niveles
    async getLevels() {
        try {
            const response = await axiosInstance.get("/api/levels");
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener los niveles');
        }
    },

    async updateTopic(topicId, topicData, files) {
        try {
            const formData = new FormData();    
            Object.entries(topicData).forEach(([key, value]) => {
                formData.append(key, value);
            });
            files.forEach((file) => {
                formData.append("files", file);
            });
            const response = await axiosInstance.put(`/api/topic/${topicId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error al actualizar el tópico");
        }
    }
};