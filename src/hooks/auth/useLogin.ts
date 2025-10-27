// src/hooks/auth/useLogin.ts 
import { useState } from "react";
import { useAuth } from "./useAuth";
import type { Credenciales, LoginResult } from "../../types/auth.types";
import { validarLogin } from "../../utils/validation";

export const useLogin = () => {
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { login: authLogin } = useAuth();

  const login = async (credenciales: Credenciales): Promise<LoginResult> => {
    setCargando(true);
    setError(null);

    try {
      const erroresValidacion = validarLogin(credenciales);
      if (erroresValidacion) {
        throw new Error(erroresValidacion);
      }
      const resultado = await authLogin(credenciales);
      console.log("✅ useLogin - Resultado recibido:", resultado);
      return resultado;
    } catch (err) {
      const mensajeError =
        err instanceof Error ? err.message : "Error de autenticación";
      setError(mensajeError);
      return {
        exito: false,
        mensaje: mensajeError,
      };
    } finally {
      setCargando(false);
    }
  };

  return {
    login,
    cargando,
    error,
    setError,
  };
};
