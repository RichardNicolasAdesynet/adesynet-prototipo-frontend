// src/services/api/userService.ts
import { apiClient } from './apiClient';
import { API_CONFIG } from '../../config/api';
import type { PaginatedResponse } from '../../types/api.types';
import type { UsuarioDetallado, UsuarioResumen } from '../../types/admin.types';

// Interface para cambio de clave
interface CambioClaveRequest {
  cdUsuario: string;
  claveActual: string;
  nuevaClave: string;
  confirmarClave: string;
}

export const userService = {
  // GET: Lista simple de usuarios (con filtros)
  async getUsuariosList(filters?: { CdRol?: string; Activo?: boolean }): Promise<UsuarioResumen[]> {
    const response = await apiClient.get<UsuarioResumen[]>(
      `${API_CONFIG.ENDPOINTS.USUARIOS}/GetUsuariosList`,
      filters
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al obtener usuarios');
    }
    
    return response.data;
  },

  // GET: Lista paginada de usuarios (para tablas)
  async getAllUsuarios(params?: {
    PageRequest_page?: number;
    PageRequest_rows?: number;
    PageRequest_sord?: string;
    PageRequest_sidx?: string;
    PageRequest_Skip?: number;
    PageRequest_Take?: number;
    PageRequest_IsDescending?: boolean;
    Filter?: string;
    CdRol?: string;
    Activo?: boolean;
  }): Promise<PaginatedResponse<UsuarioResumen>> {
    const response = await apiClient.get<PaginatedResponse<UsuarioResumen>>(
      `${API_CONFIG.ENDPOINTS.USUARIOS}/GetAllUsuarios`,
      params
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al obtener usuarios paginados');
    }
    
    return response.data;
  },

  // GET: Usuario específico por ID
  async getUsuario(idUsuario: string): Promise<UsuarioDetallado> {
    const response = await apiClient.get<UsuarioDetallado>(
      `${API_CONFIG.ENDPOINTS.USUARIOS}/GetUsuario/${idUsuario}`
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al obtener usuario');
    }
    
    return response.data;
  },

  // POST: Crear nuevo usuario
  async createUsuario(usuarioData: {
    dsUsuario: string;
    claveUsuario: string;
    nombre: string;
    apellidoP: string;
    apellidoM?: string;
    dni: string;
    email: string;
    cdRol: string;
    // Campos opcionales según prioridades
    estadoCivil?: string;
    sexo?: string;
    fecNacimiento?: string;
    direcc?: string;
    cdDepartamento?: string;
    cdProvincia?: string;
    cdDistrito?: string;
    cdZona?: string;
    telef1?: string;
    telef2?: string;
    cdArea?: string;
    cdCargo?: string;
    diaDescanso?: string;
    monSueldo?: string;
    sueldo?: number;
    fecIngreso?: string;
    flgCambiarClave?: boolean;
  }): Promise<any> {
    const response = await apiClient.post<any>(
      `${API_CONFIG.ENDPOINTS.USUARIOS}/SaveUsuario`,
      usuarioData
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al crear usuario');
    }
    
    return response.data;
  },

  // PUT: Actualizar usuario existente
  async updateUsuario(idUsuario: string, usuarioData: {
    dsUsuario: string;
    nombre: string;
    apellidoP: string;
    apellidoM?: string;
    dni: string;
    email: string;
    cdRol: string;
    // Campos opcionales
    estadoCivil?: string;
    sexo?: string;
    fecNacimiento?: string;
    direcc?: string;
    cdDepartamento?: string;
    cdProvincia?: string;
    cdDistrito?: string;
    cdZona?: string;
    telef1?: string;
    telef2?: string;
    cdArea?: string;
    cdCargo?: string;
    diaDescanso?: string;
    monSueldo?: string;
    sueldo?: number;
    fecIngreso?: string;
    fecCese?: string;
    obs?: string;
  }): Promise<any> {
    const response = await apiClient.put<any>(
      `${API_CONFIG.ENDPOINTS.USUARIOS}/UpdateUsuario/${idUsuario}`,
      usuarioData
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message );
    }
    
    
    return response.data;
  },

  // POST: Bloquear usuario
  async bloquearUsuario(idUsuario: string, motivo?: string): Promise<any> {
    const response = await apiClient.post<any>(
      `${API_CONFIG.ENDPOINTS.USUARIOS}/${idUsuario}/Bloquear`,
      motivo || "Bloqueado por el administrador"
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al bloquear usuario');
    }
    
    return response.data;
  },

  // POST: Desbloquear usuario
  async desbloquearUsuario(idUsuario: string): Promise<any> {
    const response = await apiClient.post<any>(
      `${API_CONFIG.ENDPOINTS.USUARIOS}/${idUsuario}/Desbloquear`
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al desbloquear usuario');
    }
    
    return response.data;
  },

  // POST: Cambiar contraseña
  async cambiarClave(cambioClaveData: CambioClaveRequest): Promise<any> {
    const response = await apiClient.post<any>(
      `${API_CONFIG.ENDPOINTS.USUARIOS}/CambiarClave`,
      cambioClaveData
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al cambiar contraseña');
    }
    
    return response.data;
  },

  // DELETE: Eliminar usuario
  async deleteUsuario(idUsuario: string): Promise<any> {
    const response = await apiClient.delete<any>(
      `${API_CONFIG.ENDPOINTS.USUARIOS}/DeleteUsuario/${idUsuario}`
    );
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'Error al eliminar usuario');
    }
    
    return response.data;
  }
};