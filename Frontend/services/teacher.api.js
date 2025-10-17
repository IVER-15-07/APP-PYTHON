import axiosInstance from "../helpers/axios-config";

export const teacherService = {
    async requestRoleChange(data) {
        try {
            const response = await axiosInstance.post('/api/role-requests', data); 
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al enviar la solicitud');
        }   
    },
};