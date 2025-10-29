// src/context/AuthContext.tsx - ACTUALIZAR
import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/api/authService';
import { apiClient } from '../services/api/apiClient';
import type { AuthContextType, Credenciales, LoginResult, Usuario } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';



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

          const usuario: Usuario = {
            id: storedUserInfo.idUsuario,
            nombre: storedUserInfo.nombreCompleto.split(' ')[0] || storedUserInfo.nombreCompleto,
            email: storedUserInfo.email,
            rol: mapRolToInternal(storedUserInfo.idRol),
            departamento: 'TI',
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

  // Mapear roles de API a roles internos
  const mapRolToInternal = (idRol: string): any => {
    const roleMap: Record<string, string> = {
      'ROL01': 'desarrollador',
      'ROL02': 'gerente', //administrador
      'ROL03': 'administrador',//supervisor
      'ROL04': 'supervisor',
      'ROL05': 'tecnico'
    };
    return roleMap[idRol] || 'usuario';
  };

  // CORREGIDO: Función login con tipos compatibles
  const login = async (credenciales: Credenciales): Promise<LoginResult> => {
    try {

      console.log('🔐 Iniciando login con:', credenciales);
      setAuthState(prev => ({ ...prev, cargando: true }));

      // Convertir Credenciales a LoginRequest (son compatibles ahora)
      const loginData = await authService.login({
        idUsuario: credenciales.idUsuario,
        claveUsuario: credenciales.claveUsuario
      });

      console.log('✅ Login exitoso, datos recibidos:', loginData);

      const usuario: Usuario = {
        id: loginData.idUsuario,
        nombre: loginData.nombreCompleto.split(' ')[0] || loginData.nombreCompleto,
        email: loginData.email,
        rol: mapRolToInternal(loginData.idRol),
        departamento: 'TI',
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
    navigate('/login', {replace: true});
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