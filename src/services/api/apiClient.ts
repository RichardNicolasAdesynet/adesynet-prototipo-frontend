// src/services/api/apiClient.ts
import { API_CONFIG } from '../../config/api';
import type { ApiResponse } from '../../types/api.types';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      // ✅ DETECCIÓN INTELIGENTE: ¿Es respuesta directa o envuelta?
      let apiResponse: ApiResponse<T>;
      
      if (this.isWrappedResponse(responseData)) {
        // Es una respuesta envuelta: { data: ..., isSuccess: ... }
        console.log('📦 ApiClient - Respuesta envuelta detectada');
        apiResponse = responseData;
      } else {
        // Es una respuesta directa (como el login)
        console.log('🎯 ApiClient - Respuesta directa detectada');
        apiResponse = {
          data: responseData,
          isSuccess: true,
          message: 'Operación exitosa',
          errors: null
        };
      }

      console.log('📡 ApiClient - Respuesta procesada:', apiResponse);
      
      return apiResponse;
    } catch (error) {
      console.error('API Request failed:', error);
      
      const errorResponse: ApiResponse<T> = {
        data: null as T,
        isSuccess: false,
        message: error instanceof Error ? error.message : 'Error de conexión',
        errors: [error instanceof Error ? error.message : 'Error desconocido']
      };
      
      return errorResponse;
    }
  }

  // Método para detectar si la respuesta está envuelta
  private isWrappedResponse(data: any): boolean {
    return (
      data !== null &&
      typeof data === 'object' &&
      'data' in data &&
      'isSuccess' in data &&
      'message' in data
    );
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();