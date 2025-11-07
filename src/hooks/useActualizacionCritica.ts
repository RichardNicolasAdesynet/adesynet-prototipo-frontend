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
      if (minutosReales >= 2) {
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
    const interval = setInterval(verificarCambiosCriticos, 60 * 1000);
    verificarCambiosCriticos();

    return () => clearInterval(interval);
  }, [usuario, token, actualizarPermisos, navigate]);

}