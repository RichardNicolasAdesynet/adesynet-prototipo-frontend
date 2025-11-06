// src/context/AuthContext.tsx - ACTUALIZAR
import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/api/authService';
import { apiClient } from '../services/api/apiClient';
import type { AuthContextType, Credenciales, LoginResult, Usuario } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';
import type { LoginResponse } from '../types/api.types';



export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
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


  // ✅ FUNCIÓN SIMPLIFICADA: Solo actualizar permisos
  const actualizarPermisos = (nuevosPermisos: string[]) => {
    setAuthState(prev => ({
      ...prev,
      usuario: prev.usuario ? { ...prev.usuario, permisos: nuevosPermisos } : null
    }));
  };

  // Escuchar eventos de actualización de permisos
  useEffect(() => {
    const manejarActualizacionPermisos = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.nuevosPermisos) {
        actualizarPermisos(customEvent.detail.nuevosPermisos);
      }
    };

    window.addEventListener('permisosActualizados', manejarActualizacionPermisos);
    return () => window.removeEventListener('permisosActualizados', manejarActualizacionPermisos);
  }, []);

  // Cargar datos de autenticación al iniciar
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = authService.getStoredToken();
      const storedUserInfo = authService.getStoredUserInfo();


      if (storedToken && storedUserInfo) {
        if (!authService.isTokenExpired(storedUserInfo.expires)) {

          apiClient.setToken(storedToken);

          const usuario: Usuario = {
            id: storedUserInfo.idUsuario,
            nombre: storedUserInfo.nombreCompleto.split(' ')[0] || storedUserInfo.nombreCompleto,
            email: storedUserInfo.email,
            rol: mapRolToInternal(storedUserInfo),
            departamento: 'TI',
            permisos: storedUserInfo.permisos || []
          };

          setAuthState({
            usuario,
            token: storedToken,
            estaAutenticado: true,
            cargando: false,
          });
        } else {
          authService.logout();
          setAuthState(prev => ({ ...prev, cargando: false }));
        }
      } else {
        setAuthState(prev => ({ ...prev, cargando: false }));
      }
    };

    initializeAuth();
  }, []);

  // Mapear roles de API a roles internos
  const mapRolToInternal = (usuario: LoginResponse): any => {
    const roleMap: Record<string, string> = {
      'ROL01': 'desarrollador',
      'ROL02': 'gerente', //administrador
      'ROL03': 'administrador',//supervisor
      'ROL04': 'supervisor',
      'ROL05': 'tecnico'
    };
    const otrosRol = (usuario.rolNombre).toLowerCase();
    console.log(otrosRol);
    return roleMap[usuario.idRol] || `${otrosRol}`;
  };

  // CORREGIDO: Función login con tipos compatibles
  const login = async (credenciales: Credenciales): Promise<LoginResult> => {
    try {

      setAuthState(prev => ({ ...prev, cargando: true }));

      // Convertir Credenciales a LoginRequest (son compatibles ahora)
      const loginData = await authService.login({
        idUsuario: credenciales.idUsuario,
        claveUsuario: credenciales.claveUsuario
      });

      const usuario: Usuario = {
        id: loginData.idUsuario,
        nombre: loginData.nombreCompleto.split(' ')[0] || loginData.nombreCompleto,
        email: loginData.email,
        rol: mapRolToInternal(loginData),
        departamento: 'TI',
        permisos: loginData.permisos || []
      };

      setAuthState({
        usuario,
        token: loginData.token,
        estaAutenticado: true,
        cargando: false,
      });

      return {
        exito: true,
        usuario,
        token: loginData.token
      };
    } catch (error) {
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
    navigate('/login', { replace: true });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    actualizarPermisos,       // ✅ NUEVO  
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};