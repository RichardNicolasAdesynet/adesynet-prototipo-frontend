import { useEffect } from 'react';
import { useAuth } from './auth/useAuth';
import { authService } from '../services/api/authService';

export const useActualizacionAutomatica = () => {
  const { usuario, token, actualizarPermisos } = useAuth();

  useEffect(() => {
    if (!usuario || !token) return;

    const actualizarPermisosAutomaticamente = async () => {
      try {
        // Obtener permisos actualizados desde la API
        const nuevosPermisos = await authService.getUpdatedPermissions(token);
        
        const permisosActuales = usuario.permisos || [];
        const hayCambios = JSON.stringify(permisosActuales) !== JSON.stringify(nuevosPermisos);
        
        if (hayCambios && actualizarPermisos) {
          // Actualizar en el contexto
          actualizarPermisos(nuevosPermisos);
          
          // Emitir evento para notificación
          window.dispatchEvent(new CustomEvent('permisosActualizados', {
            detail: { 
              cambios: detectarCambios(permisosActuales, nuevosPermisos)
            }
          }));
          
          console.log('🔄 Permisos actualizados automáticamente');
        }
      } catch (error) {
        console.warn('Error actualizando permisos automáticamente:', error);
      }
    };

    // Estrategia de actualización
    const interval = setInterval(actualizarPermisosAutomaticamente, 15 * 60 * 1000); // 15 min
    
    // Eventos de actividad
    window.addEventListener('focus', actualizarPermisosAutomaticamente);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) actualizarPermisosAutomaticamente();
    });

    // Actualizar inmediatamente al montar el componente
    actualizarPermisosAutomaticamente();

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', actualizarPermisosAutomaticamente);
      document.removeEventListener('visibilitychange', actualizarPermisosAutomaticamente);
    };
  }, [usuario, token, actualizarPermisos]);
};

// Función auxiliar para detectar cambios
const detectarCambios = (viejos: string[], nuevos: string[]): string[] => {
  const agregados = nuevos.filter(p => !viejos.includes(p));
  const eliminados = viejos.filter(p => !nuevos.includes(p));
  
  return [
    ...agregados.map(p => `+ ${p}`),
    ...eliminados.map(p => `- ${p}`)
  ];
};