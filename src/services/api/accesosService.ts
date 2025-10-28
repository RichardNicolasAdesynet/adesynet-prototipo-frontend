import { apiClient } from './apiClient';
import { API_CONFIG } from '../../config/api';
import type { PaginatedResponse } from '../../types/api.types';
import type { AccesoFormData, AccesoFromDataUpdate, AccesoResume } from '../../types/admin.types';

export const accesosService = {

    async getAccesosList(filters?: {Editables?: boolean}): Promise<AccesoResume[]>{
        const response = await apiClient.get<AccesoResume[]>(
        `${API_CONFIG.ENDPOINTS.ACCESOS}/GetAccesosList`,
        filters
        );
        if(!response.isSuccess){
            throw new Error(response.message || 'Error al obtener Accesos');
        }
        return response.data;
    },


  // GET: Lista paginada de accesos
  async getAllAccesos(params?: {
    PageRequest_page?: number;
    PageRequest_rows?: number;
    PageRequest_sord?: string;
    PageRequest_sidx?: string;
    PageRequest_Skip?: number;
    PageRequest_Take?: number;
    PageRequest_IsDescending?: boolean;
    CdRol?: string;
    CdModulo?: string;
    ModuloHabilitado?: boolean;
  }): Promise<PaginatedResponse<AccesoResume>> {
    const response = await apiClient.get<PaginatedResponse<AccesoResume>>(
      `${API_CONFIG.ENDPOINTS.ACCESOS}/GetAllAccesos`,
      params
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al obtener accesos');
    }
    
    return response.data;
  },

  // GET: Acceso específico por Rol y Módulo
  async getAcceso(idRol: string, idModulo: string): Promise<AccesoResume> {
    const response = await apiClient.get<AccesoResume>(
      `${API_CONFIG.ENDPOINTS.ACCESOS}/GetAcceso/${idRol}/${idModulo}`
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al obtener acceso');
    }
    
    return response.data;
  },

  // POST: Crear nuevo acceso
  async createAcceso(accesoData: AccesoFormData): Promise<any> {
    const response = await apiClient.post<any>(
      `${API_CONFIG.ENDPOINTS.ACCESOS}/SaveAcceso`,
      accesoData
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al crear acceso');
    }
    
    return response.data;
  },

  // PUT: Actualizar acceso existente
  async updateAcceso(idRol: string, idModulo: string, accesoData: AccesoFromDataUpdate): Promise<any> {
    const response = await apiClient.put<any>(
      `${API_CONFIG.ENDPOINTS.ACCESOS}/UpdateAcceso/${idRol}/${idModulo}`,
      accesoData
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al actualizar acceso');
    }
    
    return response.data;
  },

  // DELETE: Eliminar acceso
  async deleteAcceso(idRol: string, idModulo: string): Promise<any> {
    const response = await apiClient.delete<any>(
      `${API_CONFIG.ENDPOINTS.ACCESOS}/DeleteAcceso/${idRol}/${idModulo}`
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al eliminar acceso');
    }
    
    return response.data;
  }
};