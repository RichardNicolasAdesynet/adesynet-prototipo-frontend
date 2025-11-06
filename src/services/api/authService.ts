// src/services/api/authService.ts
import { apiClient } from "./apiClient";
import { API_CONFIG } from "../../config/api";
import type { LoginRequest, LoginResponse } from "../../types/api.types";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    const loginData = response.data;

    if (!loginData?.token) {
      throw new Error(response.message || "Error en el login");
    }

    // DEBUG: Verificar estructura de datos
    // Guardar token en el cliente
    apiClient.setToken(loginData.token);

    // Guardar en localStorage para persistencia
    localStorage.setItem("authToken", loginData.token);
    localStorage.setItem("userInfo", JSON.stringify(loginData));

    return loginData;
  },

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await apiClient.post<{ valid: boolean }>(
        API_CONFIG.ENDPOINTS.AUTH.VALIDATE,
        token
      );
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },

  logout(): void {
    apiClient.setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
  },

  getStoredToken(): string | null {
    return localStorage.getItem("authToken");
  },

  getStoredUserInfo(): LoginResponse | null {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  },

  // Verificar si el token está expirado
  isTokenExpired(expires: string): boolean {
    return new Date() >= new Date(expires);
  },

  // ✅ NUEVO MÉTODO: Obtener información actualizada del usuario
  async getUserInfo(token?: string): Promise<LoginResponse> {
    try {
      // Usar el token proporcionado o el token actual
      const currentToken = token || this.getStoredToken();
      
      if (!currentToken) {
        throw new Error('No hay token disponible');
      }

      // Hacer la petición para obtener info actualizada
      const response = await apiClient.get<LoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.USER_INFO,
        {
          headers: {
            'Authorization': `Bearer ${currentToken}`
          }
        }
      );

      if (!response.data) {
        throw new Error('No se pudo obtener la información del usuario');
      }

      return response.data;
    } catch (error) {
      console.error('Error obteniendo información del usuario:', error);
      throw error;
    }
  },

  // ✅ NUEVO MÉTODO: Verificar permisos actualizados
  async getUpdatedPermissions(token?: string): Promise<string[]> {
    try {
      const userInfo = await this.getUserInfo(token);
      return userInfo.permisos || [];
    } catch (error) {
      console.error('Error obteniendo permisos actualizados:', error);
      return [];
    }
  }
};
