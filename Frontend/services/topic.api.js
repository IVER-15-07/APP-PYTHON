import axiosInstance from "../helpers/axios-config";

export const topicsService = {
    async getAllTopics() {
        try {
            const response = await axiosInstance.get("/api/topics");
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener los tópicos');
        }
    },

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
}