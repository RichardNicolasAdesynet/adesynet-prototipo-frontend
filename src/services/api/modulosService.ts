import { apiClient } from './apiClient';
import { API_CONFIG } from '../../config/api';
import type {  PaginatedResponse } from '../../types/api.types';
import type { ModuloDetallado, ModuloResumen } from '../../types/admin.types';

// Interface para crear/actualizar módulo
export interface ModuloFormData {
  dsModulo: string;
  flgEdicion: boolean;
}

export const modulosService = {
  // GET: Lista simple de módulos
  async getModulosList(filters?: { Editables?: boolean }): Promise<ModuloResumen[]> {
    const response = await apiClient.get<ModuloResumen[]>(
      `${API_CONFIG.ENDPOINTS.MODULOS}/GetModulosList`,
      filters
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al obtener módulos');
    }
    
    return response.data;
  },

  // GET: Lista paginada de módulos
  async getAllModulos(params?: {
    PageRequest_page?: number;
    PageRequest_rows?: number;
    PageRequest_sord?: string;
    PageRequest_sidx?: string;
    PageRequest_Skip?: number;
    PageRequest_Take?: number;
    PageRequest_IsDescending?: boolean;
    Filter?: string;
    Editables?: boolean;
  }): Promise<PaginatedResponse<ModuloResumen>> {
    const response = await apiClient.get<PaginatedResponse<ModuloResumen>>(
      `${API_CONFIG.ENDPOINTS.MODULOS}/GetAllModulos`,
      params
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al obtener módulos paginados');
    }
    
    return response.data;
  },

  // GET: Módulo específico por ID
  async getModulo(idModulo: string): Promise<ModuloDetallado> {
    const response = await apiClient.get<ModuloDetallado>(
      `${API_CONFIG.ENDPOINTS.MODULOS}/GetModulo/${idModulo}`
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al obtener módulo');
    }
    
    return response.data;
  },

  // POST: Crear nuevo módulo
  async createModulo(moduloData: ModuloFormData): Promise<any> {
    const response = await apiClient.post<any>(
      `${API_CONFIG.ENDPOINTS.MODULOS}/SaveModulo`,
      moduloData
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al crear módulo');
    }
    
    return response.data;
  },

  // PUT: Actualizar módulo existente
  async updateModulo(idModulo: string, moduloData: ModuloFormData): Promise<any> {
    const response = await apiClient.put<any>(
      `${API_CONFIG.ENDPOINTS.MODULOS}/UpdateModulo/${idModulo}`,
      moduloData
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al actualizar módulo');
    }
    
    return response.data;
  },

  // DELETE: Eliminar módulo
  async deleteModulo(idModulo: string): Promise<any> {
    const response = await apiClient.delete<any>(
      `${API_CONFIG.ENDPOINTS.MODULOS}/DeleteModulo/${idModulo}`
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al eliminar módulo');
    }
    
    return response.data;
  }
};