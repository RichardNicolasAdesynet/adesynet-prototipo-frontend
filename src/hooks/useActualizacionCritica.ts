import { useEffect } from 'react';
import { useAuth } from './auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api/authService';

export const useActualizacionCritica = () => {
  const { usuario, token, actualizarPermisos } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario || !token) return;

    const verificarAccesoCritico = async () => {
      try {
        const nuevosPermisos = await authService.getUpdatedPermissions(token);
        
        const modulosCriticos = ['MOD01', 'MOD02', 'MOD03']; // Seguridad, Roles, Módulos
        
        const perdioAccesoCritico = modulosCriticos.some(modulo => 
          // Tenía acceso antes pero ya no
          usuario.permisos.some(p => p.startsWith(`${modulo}:`)) &&
          !nuevosPermisos.some(p => p.startsWith(`${modulo}:`))
        );

        if (perdioAccesoCritico && actualizarPermisos) {
          console.warn('🚨 Usuario perdió acceso crítico - actualizando permisos');
          
          // Actualizar permisos en el contexto
          actualizarPermisos(nuevosPermisos);
          
          // Redirigir a página segura
          navigate('/acceso-restringido', { replace: true });
        }
      } catch (error) {
        console.error('Error en verificación crítica:', error);
      }
    };

    const interval = setInterval(verificarAccesoCritico, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [usuario, token, actualizarPermisos, navigate]);
};