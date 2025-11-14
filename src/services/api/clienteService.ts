import { API_CONFIG } from "../../config/api";
import type { ObtenerCliente } from "../../types/soporte.types";
import { apiClient } from "./apiClient";

export const clienteService = {
  async getClienteById(idCliente: number): Promise<ObtenerCliente> {
    const respuesta = await apiClient.get<ObtenerCliente>(
      `${API_CONFIG.ENDPOINTS.CLIENTES}/GetCliente/${idCliente}`
    );

    if (!respuesta.isSuccess) {
      throw new Error(respuesta.message || "Error al obtener el Cliente");
    }

    return respuesta.data;
  },

  async createCliente(clienteDatos: any): Promise<any> {
    const respuesta = await apiClient.post<any>(
      `${API_CONFIG.ENDPOINTS.CLIENTES}/SaveCliente`,
      clienteDatos
    );
    if (!respuesta.isSuccess) {
      throw new Error(respuesta.message || "Error al crear el Cliente");
    }

    return respuesta.data;
  },

  async updateCliente(idCliente: number, clienteDatos: any): Promise<any> {
    const respuesta = await apiClient.put<any>(
      `${API_CONFIG.ENDPOINTS.CLIENTES}/UpdateCliente/${idCliente}`,
      clienteDatos
    );

    if (!respuesta.isSuccess) {
      throw new Error(respuesta.message || "Error al actualizar el Cliente");
    }

    return respuesta.data;
  },

  async deleteCliente(idCliente: number): Promise<any> {
    const respuesta = await apiClient.delete<any>(
      `${API_CONFIG.ENDPOINTS.CLIENTES}/DeleteCliente/${idCliente}`
    );

    if (!respuesta.isSuccess) {
      throw new Error(respuesta.message || "Error al eliminar el Cliente");
    }

    return respuesta.data;
  },
};
