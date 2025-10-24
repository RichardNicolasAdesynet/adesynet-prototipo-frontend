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
    console.log("📡 AuthService - Respuesta completa:", response); // DEBUG

    const loginData = response.data;

    if (!loginData?.token) {
      console.error("❌ AuthService - Error en respuesta:", response);
      throw new Error(response.message || "Error en el login");
    }

    // DEBUG: Verificar estructura de datos
    console.log('✅ AuthService - Login exitoso, datos:', response.data);
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
};
