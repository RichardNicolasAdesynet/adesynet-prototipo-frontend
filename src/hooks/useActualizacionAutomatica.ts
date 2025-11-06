import { useEffect, useRef } from 'react';
import { useAuth } from './auth/useAuth';
import { authService } from '../services/api/authService';

// // Función auxiliar para detectar cambios
// export const useActualizacionAutomatica = () => {
//   const { usuario, token, actualizarPermisos } = useAuth();
//   const ultimaVerificacionRef = useRef<Date>(new Date());

//   useEffect(() => {
//     if (!usuario || !token) return;

//     const actualizarPermisosAutomaticamente = async () => {
//       try {
//         const ahora = new Date();
//         const minutosDesdeUltimaVerificacion = 
//           (ahora.getTime() - ultimaVerificacionRef.current.getTime()) / (1000 * 60);

//         // ✅ EVITAR VERIFICACIONES DEMASIADO FRECUENTES (mínimo 2 minutos)
//         if (minutosDesdeUltimaVerificacion < 2) {
//           console.log('⏰ Verificación omitida (muy reciente)');
//           console.log(ultimaVerificacionRef.current.getTime());
//           console.log(ahora.getTime());
//           console.log(minutosDesdeUltimaVerificacion);
//           return;
//         }

//         console.log('🔍 useActualizacionAutomatica - Verificando permisos...');
        
//         const nuevosPermisos = await authService.getUpdatedPermissions(token);
        
//         const permisosActuales = usuario.permisos || [];
//         const hayCambios = JSON.stringify(permisosActuales) !== JSON.stringify(nuevosPermisos);
        
//         if (hayCambios && actualizarPermisos) {
//           actualizarPermisos(nuevosPermisos);
//           ultimaVerificacionRef.current = new Date();
          
//           console.log('🔄 Permisos actualizados automáticamente');
          
//           window.dispatchEvent(new CustomEvent('permisosActualizados', {
//             detail: { 
//               cambios: detectarCambios(permisosActuales, nuevosPermisos)
//             }
//           }));
//         } else {
//           console.log('✅ useActualizacionAutomatica - Sin cambios en permisos');
//         }
//       } catch (error) {
//         console.warn('❌ useActualizacionAutomatica - Error:', error);
//       }
//     };

//     // ✅ ESTRATEGIA MEJORADA:
    
//     // 1. Intervalo principal cada 15 minutos
//     const interval = setInterval(actualizarPermisosAutomaticamente, 15 * 60 * 1000);
    
//     // 2. Evento focus SOLO si pasaron más de 5 minutos
//     const manejarFocus = () => {
//       const ahora = new Date();
//       const minutosDesdeUltimaVerificacion = 
//         (ahora.getTime() - ultimaVerificacionRef.current.getTime()) / (1000 * 60);
      
//       if (minutosDesdeUltimaVerificacion >= 5) {
//         console.log('👀 Focus detectado - Verificando permisos...');
//         actualizarPermisosAutomaticamente();
//       }
//     };

//     // 3. Visibility change SOLO si la página se vuelve visible
//     const manejarVisibilityChange = () => {
//       if (!document.hidden) {
//         const ahora = new Date();
//         const minutosDesdeUltimaVerificacion = 
//           (ahora.getTime() - ultimaVerificacionRef.current.getTime()) / (1000 * 60);
        
//         if (minutosDesdeUltimaVerificacion >= 5) {
//           console.log('📄 Página visible - Verificando permisos...');
//           actualizarPermisosAutomaticamente();
//         }
//       }
//     };

//     window.addEventListener('focus', manejarFocus);
//     document.addEventListener('visibilitychange', manejarVisibilityChange);

//     // Ejecutar una vez al montar
//     actualizarPermisosAutomaticamente();

//     return () => {
//       clearInterval(interval);
//       window.removeEventListener('focus', manejarFocus);
//       document.removeEventListener('visibilitychange', manejarVisibilityChange);
//     };
//   }, [usuario, token, actualizarPermisos]);
// };

// hooks/useActualizacionAutomatica.ts - PARA PERMISOS NO CRÍTICOS

export const useActualizacionAutomatica = () => {
  const { usuario, token, actualizarPermisos } = useAuth();
  const ultimaVerificacionRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!usuario || !token) return;

    console.log('🔄 useActualizacionAutomatica - Permisos normales (15 min)');

    const verificarPermisosNormales = async () => {
      const ahora = Date.now();
      const minutosReales = (ahora - ultimaVerificacionRef.current) / (1000 * 60);

      // ✅ PERMISOS NORMALES: Cada 15 minutos
      if (minutosReales >= 1) {
        console.log('🔍 Verificando permisos normales...');
        
        const nuevosPermisos = await authService.getUpdatedPermissions(token);
        const permisosActuales = usuario.permisos || [];
        const hayCambios = JSON.stringify(permisosActuales) !== JSON.stringify(nuevosPermisos);
        
        if (hayCambios && actualizarPermisos) {
          actualizarPermisos(nuevosPermisos);
          console.log('🔄 Permisos normales actualizados');
          
          window.dispatchEvent(new CustomEvent('permisosActualizados', {
            detail: { cambios: detectarCambios(permisosActuales, nuevosPermisos) }
          }));
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