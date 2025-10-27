// Frontend/services/grupo.api.js
import axiosInstance from "../helpers/axios-config";

export const grupoService = {
  // Obtener el grupo del usuario por su ID
  async getUserGroup(usuarioId) {
    try {
      const res = await axiosInstance.get(`/grupo/user/${usuarioId}`);
      return res.data; // { grupo, niveles }
    } catch (error) {
      console.error("Error al obtener grupo:", error);
      throw error; // Lanzamos el error para que Course.jsx lo maneje
    }
  },

  // Unirse a un grupo por código
  async joinGroupByCode({ codigo, usuarioId }) {
    try {
      const res = await axiosInstance.post(`/grupo/join-by-code`, {
        codigo,
        usuarioId,
      });
      return res.data; // { message, grupo, niveles }
    } catch (error) {
      console.error("Error al unirse al grupo:", error);
      throw error;
    }
  },
};

