import axiosInstance from "../helpers/axios-config";

export const adminService = {


    //lista los grupos solicitados por los usuarios   
    async getRequestedGroups() {
        try {
            const response = await axiosInstance.get('/api/admin/groups/pending');  
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener los grupos solicitados');
        }
    },

    // apueba un grupo solicitado
    async approveRequestedGroup(groupId) {
        try {
            const response = await axiosInstance.patch(`/api/admin/groups/${groupId}/aprobar`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al aprobar el grupo solicitado');
        }
    },

    async changeUserRole(userId, newRoleId) {
        try {
            const response = await axiosInstance.patch(`/admin/users/${userId}/role`, { roleId: newRoleId });           
            return response.data;
        }   catch (error) {             
            throw new Error(error.response?.data?.message || 'Error al cambiar el rol del usuario');
        }
    },

    async getRoleRequests() {
        try {
            const response = await axiosInstance.get('/api/admin/role-requests');           
            return response.data;
        }   catch (error) {             
            throw new Error(error.response?.data?.message || 'Error al obtener las solicitudes de rol');
        }
    },     

    async approveRoleRequest(requestId) {
        try {
            const response = await axiosInstance.patch(`/api/admin/role-requests/${requestId}/aprobar`);        
            return response.data;
        }   catch (error) {
            throw new Error(error.response?.data?.message || 'Error al aprobar la solicitud de rol');
        }   
    },    
    async rejectRoleRequest(requestId) {
        try {
            const response = await axiosInstance.patch(`/api/admin/role-requests/${requestId}/rechazar`);           
            return response.data;
        }   catch (error) {
            throw new Error(error.response?.data?.message || 'Error al rechazar la solicitud de rol');
        }   
    },
};