import axiosInstance from "../helpers/axios-config";

export const coursesService = {

    async createCourse(data) {
        const response = await axiosInstance.post('/profesor/courses', data);
        return response.data;
    },

    async getMyCourses() {
        const response = await axiosInstance.get('/profesor/courses');
        return response.data;
    }
};
