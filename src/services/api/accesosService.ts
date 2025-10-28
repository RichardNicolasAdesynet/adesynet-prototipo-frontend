//src/services/api/accesosService.ts

import { apiClient } from './apiClient';
import { API_CONFIG } from '../../config/api';
import type { PaginatedResponse } from '../../types/api.types';
import type { AccesoCompleto, TipoPermiso } from '../../types/admin.types';

// Interface para crear/actualizar acceso
export interface AccesoFormData {
  cdRol: string;
  cdModulo: string;
  moduloHabilitado: boolean;
  permisos: TipoPermiso[];
}

export interface AccesoUpdateData {
  moduloHabilitado: boolean;
  permisos: TipoPermiso[];
}

export const accesosService = {
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
  }): Promise<PaginatedResponse<AccesoCompleto>> {
    const response = await apiClient.get<PaginatedResponse<AccesoCompleto>>(
      `${API_CONFIG.ENDPOINTS.ACCESOS}/GetAllAccesos`,
      params
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al obtener accesos');
    }
    
    return response.data;
  },

  // GET: Acceso específico por Rol y Módulo
  async getAcceso(idRol: string, idModulo: string): Promise<AccesoCompleto> {
    const response = await apiClient.get<AccesoCompleto>(
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
  async updateAcceso(idRol: string, idModulo: string, accesoData: AccesoUpdateData): Promise<any> {
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