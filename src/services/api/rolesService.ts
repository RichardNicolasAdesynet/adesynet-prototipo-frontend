//src/services/api/rolesService.ts

import { apiClient } from './apiClient';
import { API_CONFIG } from '../../config/api';
import type { PaginatedResponse } from '../../types/api.types';
import type { RolResumen } from '../../types/admin.types';

// Interface para rol detallado
export interface RolDetallado {
  cdRol: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fecmod?: string;
  cantidadUsuarios: number;
  cantidadAccesos: number;
  accesos?: Array<{
    cdModulo: string;
    dsModulo: string;
    moduloHabilitado: boolean;
    cantidadPermisos: number;
  }>;
}

// Interface para crear/actualizar rol
export interface RolFormData {
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export const rolesService = {
  // GET: Lista simple de roles
  async getRolesList(filters?: { Activo?: boolean }): Promise<RolResumen[]> {
    const response = await apiClient.get<RolResumen[]>(
      `${API_CONFIG.ENDPOINTS.ROLES}/GetRolesList`,
      filters
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al obtener roles');
    }
    
    return response.data;
  },

  // GET: Lista paginada de roles
  async getAllRoles(params?: {
    PageRequest_page?: number;
    PageRequest_rows?: number;
    PageRequest_sord?: string;
    PageRequest_sidx?: string;
    PageRequest_Skip?: number;
    PageRequest_Take?: number;
    PageRequest_IsDescending?: boolean;
    Filter?: string;
    Activo?: boolean;
  }): Promise<PaginatedResponse<RolResumen>> {
    const response = await apiClient.get<PaginatedResponse<RolResumen>>(
      `${API_CONFIG.ENDPOINTS.ROLES}/GetAllRoles`,
      params
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al obtener roles paginados');
    }
    
    return response.data;
  },

  // GET: Rol específico por ID
  async getRol(idRol: string): Promise<RolDetallado> {
    const response = await apiClient.get<RolDetallado>(
      `${API_CONFIG.ENDPOINTS.ROLES}/GetRol/${idRol}`
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al obtener rol');
    }
    
    return response.data;
  },

  // POST: Crear nuevo rol
  async createRol(rolData: RolFormData): Promise<any> {
    const response = await apiClient.post<any>(
      `${API_CONFIG.ENDPOINTS.ROLES}/SaveRol`,
      rolData
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al crear rol');
    }
    
    return response.data;
  },

  // PUT: Actualizar rol existente
  async updateRol(idRol: string, rolData: RolFormData): Promise<any> {
    const response = await apiClient.put<any>(
      `${API_CONFIG.ENDPOINTS.ROLES}/UpdateRol/${idRol}`,
      rolData
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al actualizar rol');
    }
    
    return response.data;
  },

  // DELETE: Eliminar rol
  async deleteRol(idRol: string): Promise<any> {
    const response = await apiClient.delete<any>(
      `${API_CONFIG.ENDPOINTS.ROLES}/DeleteRol/${idRol}`
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al eliminar rol');
    }
    
    return response.data;
  }
};