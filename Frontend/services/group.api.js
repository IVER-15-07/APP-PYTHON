import axiosInstance from "../helpers/axios-config";

export const coursesService = {

    //crea  la  solicitud para crear  un grupo nuevo

    async createGroup(groupData) {
        try {
            const response = await axiosInstance.post("/api/teacher/group-requests", groupData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al crear la solicitud de grupo');
        }

    },

    //te lista  los grupos que has solicitado crear aprobados y pendientes
    async getGroupRequests() {
        try {
            const response = await axiosInstance.get("/api/teacher/group-requests");
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener las solicitudes de grupo');
        }
    },

    async updateGroup(id, updatedData) {
        try {
            const response = await axiosInstance.put(`/api/groups/${id}`, updatedData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error al actualizar el grupo");
        }
    },

    async getListStudentsByGroup(groupId) {
        try {
            const response = await axiosInstance.get(`/api/group/${groupId}/students`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error al obtener la lista de estudiantes por grupo");
        }
    }

}


