import { useEffect, useRef } from "react";
import { useAuth } from "./auth/useAuth";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api/authService";

// Mapear roles de API a roles internos
  const mapRolToInternal = (userInfo: any): any => {
    const roleMap: Record<string, string> = {
      'ROL01': 'desarrollador',
      'ROL02': 'gerente', //administrador
      'ROL03': 'administrador',//supervisor
      'ROL04': 'supervisor',
      'ROL05': 'tecnico'
    };
    const otrosRol = (userInfo.rolNombre).toLowerCase();
    return roleMap[userInfo.idRol] || `${otrosRol}`;
  };

// ✅ Función para obtener nombre corto (igual que en AuthContext)
const getNombreCorto = (nombreCompleto: string): string => {
  return nombreCompleto.split(' ')[0] || nombreCompleto;
};

export const useActualizacionCritica = () => {
  const { usuario, token, actualizarPermisos } = useAuth();
  const navigate = useNavigate();
  const ultimaVerificacionRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!usuario || !token) return;

    console.log('🔒 useActualizacionCritica - Cambios críticos (2 min)');

    const verificarCambiosCriticos = async () => {
      const ahora = Date.now();
      const minutosReales = (ahora - ultimaVerificacionRef.current) / (1000 * 60);

      // ✅ CAMBIOS CRÍTICOS: Cada 2 minutos
      if (minutosReales >= 0.5) {
        console.log('🔍 Verificando cambios críticos...');
        
        const userInfoActualizado = await authService.getUserInfo(token);
        if (!userInfoActualizado) return;

        const nuevoRol = mapRolToInternal(userInfoActualizado);
        const nuevoNombre = getNombreCorto(userInfoActualizado.nombreCompleto);
        
        const cambios = {
          nombre: usuario.nombre !== nuevoNombre,
          rol: usuario.rol !== nuevoRol,
          permisosCriticos: ['MOD01', 'MOD02', 'MOD03'].some(modulo => 
            usuario.permisos.some(p => p.startsWith(`${modulo}:`)) &&
            !userInfoActualizado.permisos.some(p => p.startsWith(`${modulo}:`))
          )
        };

        console.log('📊 Estado cambios críticos:', {
          nombre: cambios.nombre ? '🔴' : '✅',
          rol: cambios.rol ? '🔴' : '✅', 
          permisosCriticos: cambios.permisosCriticos ? '🔴' : '✅',
          minutosDesdeVerificacion: minutosReales.toFixed(1)
        });

        // 🔴 PERMISOS CRÍTICOS: Inmediato
        if (cambios.permisosCriticos) {
          console.warn('🚨 ACCESO CRÍTICO PERDIDO - Redirigiendo');
          if (actualizarPermisos) actualizarPermisos(userInfoActualizado.permisos);
          navigate('/acceso-restringido', { replace: true });
        }
        // 🟡 NOMBRE/ROL: 2-5 minutos  
        else if (cambios.nombre || cambios.rol) {
          console.warn('⚠️ CAMBIOS NOMBRE/ROL - Mostrando modal');
          window.dispatchEvent(new CustomEvent('cambiosCriticosDetectados', {
            detail: { cambios, userInfoActualizado }
          }));
        }

        ultimaVerificacionRef.current = ahora;
      }
    };

    // Intervalo de 30 segundos para críticos
    const interval = setInterval(verificarCambiosCriticos, 30 * 1000);
    verificarCambiosCriticos();

    return () => clearInterval(interval);
  }, [usuario, token, actualizarPermisos, navigate]);



  // useEffect(() => {
  //   if (!usuario || !token) return;

  //   console.log('🔒 useActualizacionCritica - Iniciando verificación con compensación');

  //   const verificarConCompensacion = async () => {
  //     const ahora = Date.now();
  //     const tiempoTranscurrido = ahora - ultimaVerificacionRef.current;
  //     const minutosTranscurridos = tiempoTranscurrido / (1000 * 60);

  //     console.log('⏰ Tiempo transcurrido:', minutosTranscurridos.toFixed(1), 'minutos');

  //     // ✅ COMPENSACIÓN: Verificar si pasó 1 minuto (incluso si el intervalo se pausó)
  //     if (minutosTranscurridos >= 1) {
  //       console.log('🔍 Ejecutando verificación crítica...');
  //       await verificarCambiosCriticos();
  //       ultimaVerificacionRef.current = ahora;
  //     } else {
  //       console.log('⏸️  Verificación omitida (aún no pasa 1 minuto)');
  //     }
  //   };

  //   const verificarCambiosCriticos = async () => {
  //     try {
  //       console.log('🔍 useActualizacionCritica - Ejecutando verificación...');
        
  //       const userInfoActualizado = await authService.getUserInfo(token);
        
  //       if (!userInfoActualizado) {
  //         console.log('❌ useActualizacionCritica - No se pudo obtener userInfo');
  //         return;
  //       }

  //       // ✅ CALCULAR NUEVO ROL Y NOMBRE
  //       const nuevoRol = mapRolToInternal(userInfoActualizado);
  //       const nuevoNombre = getNombreCorto(userInfoActualizado.nombreCompleto);

  //       // ✅ DETECTAR TODOS LOS CAMBIOS CRÍTICOS
  //       const cambiosCriticos = {
  //         nombre: usuario.nombre !== nuevoNombre,
  //         rol: usuario.rol !== nuevoRol,
  //         permisosCriticos: ['MOD01', 'MOD02', 'MOD03'].some(modulo => 
  //           usuario.permisos.some(p => p.startsWith(`${modulo}:`)) &&
  //           !userInfoActualizado.permisos.some(p => p.startsWith(`${modulo}:`))
  //         )
  //       };

  //       console.log('🔍 Verificación crítica completada:', { 
  //         cambios: cambiosCriticos,
  //         nombreActual: usuario.nombre,
  //         nombreNuevo: nuevoNombre,
  //         rolActual: usuario.rol, 
  //         rolNuevo: nuevoRol,
  //         tieneCambios: cambiosCriticos.nombre || cambiosCriticos.rol || cambiosCriticos.permisosCriticos
  //       });

  //       // ✅ MANEJAR DIFERENTES TIPOS DE CAMBIOS
  //       if (cambiosCriticos.permisosCriticos) {
  //         // 🔴 CAMBIO CRÍTICO: Permisos de seguridad
  //         console.warn('🚨 useActualizacionCritica - PERDIÓ ACCESO CRÍTICO');
          
  //         if (actualizarPermisos) {
  //           actualizarPermisos(userInfoActualizado.permisos);
  //         }
          
  //         // Redirigir a página segura
  //         navigate('/acceso-restringido', { replace: true });
          
  //       } else if (cambiosCriticos.nombre || cambiosCriticos.rol) {
  //         // 🟡 CAMBIO IMPORTANTE: Nombre o rol
  //         console.warn('⚠️ useActualizacionCritica - CAMBIOS NOMBRE/ROL DETECTADOS');
          
  //         // Emitir evento para mostrar modal de reconexión
  //         window.dispatchEvent(new CustomEvent('cambiosCriticosDetectados', {
  //           detail: { 
  //             tipo: 'reconexion_requerida',
  //             cambios: cambiosCriticos,
  //             userInfo: userInfoActualizado,
  //             datosAntiguos: {
  //               nombre: usuario.nombre,
  //               rol: usuario.rol
  //             },
  //             datosNuevos: {
  //               nombre: nuevoNombre,
  //               rol: nuevoRol
  //             }
  //           }
  //         }));
  //       } else {
  //         console.log('✅ useActualizacionCritica - Sin cambios críticos');
  //       }

  //     } catch (error) {
  //       console.error('❌ useActualizacionCritica - Error:', error);
  //     }
  //   };

  //   // ✅ INTERVALO MÁS CORTO (30 segundos) para compensar pausas del navegador
  //   const interval = setInterval(verificarConCompensacion, 30 * 1000);
    
  //   // ✅ Verificación inicial al montar
  //   verificarConCompensacion();

  //   return () => {
  //     console.log('🔒 useActualizacionCritica - Limpiando intervalo');
  //     clearInterval(interval);
  //   };
  // }, [usuario, token, actualizarPermisos, navigate]);
};


// export const useActualizacionCritica = () => {
//   const { usuario, token, actualizarPermisos } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!usuario || !token) return;
//     const verificarCambiosCriticos = async () => {
//       try {
//         const userInfoActualizado = await authService.getUserInfo(token);

//         if (!userInfoActualizado) return;

//         // ✅ VERIFICAR CAMBIOS CRÍTICOS
//         const cambiosCriticos = {
//           nombre:
//             usuario?.nombre !==
//             userInfoActualizado.nombreCompleto.split(" ")[0],
//           rol: usuario?.rol !== mapRolToInternal(userInfoActualizado),
//           permisosCriticos: ["MOD01", "MOD02", "MOD03"].some(
//             (modulo) =>
//               usuario?.permisos.some((p) => p.startsWith(`${modulo}:`)) &&
//               !userInfoActualizado.permisos.some((p) =>
//                 p.startsWith(`${modulo}:`)
//               )
//           ),
//         };

//         // 🔴 SI HAY CAMBIOS CRÍTICOS
//         if (
//           cambiosCriticos.nombre ||
//           cambiosCriticos.rol ||
//           cambiosCriticos.permisosCriticos
//         ) {
//           console.warn("🚨 Cambios críticos detectados:", cambiosCriticos);

//           // Mostrar modal de reconexión
//           window.dispatchEvent(
//             new CustomEvent("cambiosCriticosDetectados", {
//               detail: {
//                 tipo: "reconexion_requerida",
//                 cambios: cambiosCriticos,
//               },
//             })
//           );
//         }                                                                                 
//       } catch (error) {
//         console.error("Error en verificación crítica:", error);
//       }
//     };

//     const interval = setInterval(verificarCambiosCriticos, 1 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, [usuario, token, actualizarPermisos, navigate]);
 
// };
