import axiosInstance from "../helpers/axios-config";

export const coursesService = {

    async getCourses() {
        try {
            const response = await axiosInstance.get("/api/my-courses");
            return response.data?.data || [];
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener los cursos');
        }
    },
    async updateCourse(courseId, data) {
        try {
            const response = await axiosInstance.put(`/api/course/${courseId}`, data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al actualizar el curso');
        }
    },

}
