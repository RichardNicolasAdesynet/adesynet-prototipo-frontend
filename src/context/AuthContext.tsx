// src/context/AuthContext.tsx 
import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/api/authService';
import { apiClient } from '../services/api/apiClient';
import type { AuthContextType, Credenciales, LoginResult, Usuario } from '../types/auth.types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState({
    usuario: null as Usuario | null,
    token: null as string | null,
    estaAutenticado: false,
    cargando: true,
  });

  // DEBUG: Ver cambios en el estado
  useEffect(() => {
    console.log('🔄 AuthContext - Estado actualizado:', authState);
  }, [authState]);

  // Cargar datos de autenticación al iniciar
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔐 Inicializando autenticación...');
      const storedToken = authService.getStoredToken();
      const storedUserInfo = authService.getStoredUserInfo();

      console.log('📦 Datos almacenados:', { storedToken, storedUserInfo });

      if (storedToken && storedUserInfo) {
        if (!authService.isTokenExpired(storedUserInfo.expires)) {
          console.log('✅ Token válido encontrado');

          apiClient.setToken(storedToken);

          // ✅ CORREGIDO: Usar la nueva estructura de Usuario
          const usuario: Usuario = {
            idUsuario: storedUserInfo.idUsuario,
            nombreCompleto: storedUserInfo.nombreCompleto,
            email: storedUserInfo.email,
            idRol: storedUserInfo.idRol,
            rolNombre: storedUserInfo.rolNombre,
            permisos: storedUserInfo.permisos || []
          };

          console.log('👤 Usuario creado:', usuario);

          setAuthState({
            usuario,
            token: storedToken,
            estaAutenticado: true,
            cargando: false,
          });
        } else {
          console.log('❌ Token expirado');
          authService.logout();
          setAuthState(prev => ({ ...prev, cargando: false }));
        }
      } else {
        console.log('📭 No hay datos de autenticación almacenados');
        setAuthState(prev => ({ ...prev, cargando: false }));
      }
    };

    initializeAuth();
  }, []);

  // ✅ CORREGIDO: Función login con nueva estructura
  const login = async (credenciales: Credenciales): Promise<LoginResult> => {
    try {
      console.log('🔐 Iniciando login con:', credenciales);
      setAuthState(prev => ({ ...prev, cargando: true }));

      const loginData = await authService.login({
        idUsuario: credenciales.idUsuario,
        claveUsuario: credenciales.claveUsuario
      });

      console.log('✅ Login exitoso, datos recibidos:', loginData);

      // ✅ CORREGIDO: Usar nueva estructura de Usuario
      const usuario: Usuario = {
        idUsuario: loginData.idUsuario,
        nombreCompleto: loginData.nombreCompleto,
        email: loginData.email,
        idRol: loginData.idRol,
        rolNombre: loginData.rolNombre,
        permisos: loginData.permisos || []
      };

      console.log('👤 Usuario mapeado:', usuario);

      setAuthState({
        usuario,
        token: loginData.token,
        estaAutenticado: true,
        cargando: false,
      });

      console.log('🎯 Estado actualizado debería estar en true ahora');

      return {
        exito: true,
        usuario,
        token: loginData.token
      };
    } catch (error) {
      console.error('❌ Error en login:', error);
      setAuthState(prev => ({ ...prev, cargando: false }));

      return {
        exito: false,
        mensaje: error instanceof Error ? error.message : 'Error de autenticación'
      };
    }
  };

  const logout = () => {
    authService.logout();
    setAuthState({
      usuario: null,
      token: null,
      estaAutenticado: false,
      cargando: false,
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};