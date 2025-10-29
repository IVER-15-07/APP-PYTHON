import axiosInstance from "../helpers/axios-config";

export const coursesService = {
    
    async getCourses() {
        try {
            const response = await axiosInstance.get("/api/my-courses");
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener los cursos');
        }
    },

}
