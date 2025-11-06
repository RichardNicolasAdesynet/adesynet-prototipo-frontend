// hooks/useActualizacionInmediata.ts (NUEVO)
import { useEffect } from 'react';
import { useAuth } from './auth/useAuth';
import { authService } from '../services/api/authService';

export const useActualizacionInmediata = () => {
  const { usuario, token, actualizarPermisos } = useAuth();

  useEffect(() => {
    if (!usuario || !token) return;

    console.log('⚡ useActualizacionInmediata - Verificación al cargar');

    const verificarInmediatamente = async () => {
      try {
        const userInfoActualizado = await authService.getUserInfo(token);
        
        if (!userInfoActualizado) return;

        const permisosActuales = usuario.permisos || [];
        const nuevosPermisos = userInfoActualizado.permisos || [];
        
        const hayCambios = JSON.stringify(permisosActuales) !== JSON.stringify(nuevosPermisos);

        if (hayCambios) {
          console.log('⚡ Cambios detectados al cargar - Actualizando inmediatamente');
          
          if (actualizarPermisos) {
            actualizarPermisos(nuevosPermisos);
          }

          // ✅ ACTUALIZAR LOCALSTORAGE INMEDIATAMENTE
          localStorage.setItem('userInfo', JSON.stringify(userInfoActualizado));
        } else {
          console.log('✅ useActualizacionInmediata - Sin cambios al cargar');
        }
      } catch (error) {
        console.warn('❌ Error en verificación inmediata:', error);
      }
    };

    // Ejecutar inmediatamente al cargar
    verificarInmediatamente();
  }, [usuario, token, actualizarPermisos]); // Se ejecuta cuando usuario/token cambian
};