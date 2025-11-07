import { useEffect, useRef } from 'react';
import { useAuth } from './auth/useAuth';
import { authService } from '../services/api/authService';

export const useActualizacionAutomatica = () => {
  const { usuario, token, actualizarPermisos } = useAuth();
  const ultimaVerificacionRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!usuario || !token) return;

    //console.log('🔄 useActualizacionAutomatica - Permisos normales (15 min)');

    const verificarPermisosNormales = async () => {
      const ahora = Date.now();
      const minutosReales = (ahora - ultimaVerificacionRef.current) / (1000 * 60);
      //console.log(`pasaron ... ${minutosReales} minuto(s)`);
      // ✅ PERMISOS NORMALES: Cada 15 minutos
      if (minutosReales >= 15) {
        //console.log('🔍 Verificando permisos normales...');
        
        const nuevosPermisos = await authService.getUpdatedPermissions(token);
        const permisosActuales = usuario.permisos || [];
        const hayCambios = JSON.stringify(permisosActuales) !== JSON.stringify(nuevosPermisos);
        
        if (hayCambios && actualizarPermisos) {
          //console.log('🔄HAY  CAMBIO DE Permisos');
          actualizarPermisos(nuevosPermisos);
          //console.log('🔄 Permisos normales actualizados');
          
          window.dispatchEvent(new CustomEvent('permisosActualizados', {
            detail: { cambios: detectarCambios(permisosActuales, nuevosPermisos) }
          }));
          //console.log('🔄 SE DISPARA EL EVENTO');
        }
        
        ultimaVerificacionRef.current = ahora;
      }
    };

    // Intervalo de 1 minuto para compensación
    const interval = setInterval(verificarPermisosNormales, 60 * 1000);
    verificarPermisosNormales();

    return () => clearInterval(interval);
  }, [usuario, token, actualizarPermisos]);
};

const detectarCambios = (viejos: string[], nuevos: string[]): string[] => {
  const agregados = nuevos.filter(p => !viejos.includes(p));
  const eliminados = viejos.filter(p => !nuevos.includes(p));
  
  return [
    ...agregados.map(p => `(Añadido) + ${p}`),
    ...eliminados.map(p => `(Quitado) - ${p}`)
  ];
};