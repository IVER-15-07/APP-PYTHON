// Frontend/services/grupo.api.js
import axiosInstance from "../helpers/axios-config";

export const grupoService = {
  async getUserGroup(usuarioId) {
    const res = await axiosInstance.get(`/grupo/user/${usuarioId}`);
    return res.data;
  },

  async joinGroupByCode({ codigo, usuarioId }) {
    const res = await axiosInstance.post(`/grupo/join-by-code`, {
      codigo,
      usuarioId,
    });
    return res.data;
  },
};

