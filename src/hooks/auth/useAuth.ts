// src/hooks/useAuth.ts - ACTUALIZAR
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import type { AuthContextType } from '../../types/auth.types';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};