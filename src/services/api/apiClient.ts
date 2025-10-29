// src/services/api/apiClient.ts
import { API_CONFIG } from "../../config/api";
import type { ApiResponse } from "../../types/api.types";

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
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // ✅ MEJORADO: Manejar respuestas con error
      if (!response.ok) {
        // Intentar obtener el mensaje específico del backend
        let errorMessage = `Error ${response.status}`;

        try {
          const errorResponse = await response.json();
          console.log(
            "🔍 ApiClient - Respuesta de error COMPLETA:",
            errorResponse
          );

          // ✅ EXTRACCIÓN MEJORADA: Buscar mensaje en diferentes estructuras
          if (errorResponse.message) {
            errorMessage = errorResponse.message;
          } else if (
            errorResponse.errors &&
            Array.isArray(errorResponse.errors) &&
            errorResponse.errors.length > 0
          ) {
            errorMessage = errorResponse.errors.join(", ");
          } else if (typeof errorResponse === "string") {
            errorMessage = errorResponse;
          } else if (errorResponse.data?.message) {
            errorMessage = errorResponse.data.message;
          }

          console.log("📝 ApiClient - Mensaje extraído:", errorMessage);
        } catch (parseError) {
          // Si no se puede parsear JSON, usar el texto de la respuesta
          try {
            const textError = await response.text();
            if (textError) {
              errorMessage = textError;
            }
          } catch (textError) {
            // Último recurso: usar el status code
            errorMessage = `Error ${response.status}: ${response.statusText}`;
          }
        }

        throw new Error(errorMessage);
      }

      const responseData = await response.json();

      // Detección inteligente de respuesta
      let apiResponse: ApiResponse<T>;

      if (this.isWrappedResponse(responseData)) {
        console.log("📦 ApiClient - Respuesta envuelta detectada");
        apiResponse = responseData;
      } else {
        console.log("🎯 ApiClient - Respuesta directa detectada");
        apiResponse = {
          data: responseData,
          isSuccess: true,
          message: "Operación exitosa",
          errors: null,
        };
      }

      console.log("📡 ApiClient - Respuesta procesada:", apiResponse);

      return apiResponse;
    } catch (error) {
      console.error("❌ API Request failed:", error);

      // ✅ MEJORADO: Pasar el mensaje exacto del error
      const errorMessage =
        error instanceof Error ? error.message : "Error de conexión";

      const errorResponse: ApiResponse<T> = {
        data: null as T,
        isSuccess: false,
        message: errorMessage, // ← Este es el mensaje que verá el usuario
        errors: [errorMessage],
      };

      return errorResponse;
    }
  }

  private isWrappedResponse(data: any): boolean {
    return (
      data !== null &&
      typeof data === "object" &&
      "data" in data &&
      "isSuccess" in data &&
      "message" in data
    );
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const queryString = params ? new URLSearchParams(params).toString() : "";
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request<T>(url, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
