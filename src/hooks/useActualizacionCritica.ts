import { useEffect } from "react";
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

export const useActualizacionCritica = () => {
  const { usuario, token, actualizarPermisos } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario || !token) return;
    const verificarCambiosCriticos = async () => {
      try {
        const userInfoActualizado = await authService.getUserInfo(token);

        if (!userInfoActualizado) return;

        // ✅ VERIFICAR CAMBIOS CRÍTICOS
        const cambiosCriticos = {
          nombre:
            usuario?.nombre !==
            userInfoActualizado.nombreCompleto.split(" ")[0],
          rol: usuario?.rol !== mapRolToInternal(userInfoActualizado),
          permisosCriticos: ["MOD01", "MOD02", "MOD03"].some(
            (modulo) =>
              usuario?.permisos.some((p) => p.startsWith(`${modulo}:`)) &&
              !userInfoActualizado.permisos.some((p) =>
                p.startsWith(`${modulo}:`)
              )
          ),
        };

        // 🔴 SI HAY CAMBIOS CRÍTICOS
        if (
          cambiosCriticos.nombre ||
          cambiosCriticos.rol ||
          cambiosCriticos.permisosCriticos
        ) {
          console.warn("🚨 Cambios críticos detectados:", cambiosCriticos);

          // Mostrar modal de reconexión
          window.dispatchEvent(
            new CustomEvent("cambiosCriticosDetectados", {
              detail: {
                tipo: "reconexion_requerida",
                cambios: cambiosCriticos,
              },
            })
          );
        }
      } catch (error) {
        console.error("Error en verificación crítica:", error);
      }
    };

    const interval = setInterval(verificarCambiosCriticos, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [usuario, token, actualizarPermisos, navigate]);

  // useEffect(() => {
  //   if (!usuario || !token) return;

  //   const verificarAccesoCritico = async () => {
  //     try {
  //       const nuevosPermisos = await authService.getUpdatedPermissions(token);

  //       const modulosCriticos = ['MOD01', 'MOD02', 'MOD03']; // Seguridad, Roles, Módulos

  //       const perdioAccesoCritico = modulosCriticos.some(modulo =>
  //         // Tenía acceso antes pero ya no
  //         usuario.permisos.some(p => p.startsWith(`${modulo}:`)) &&
  //         !nuevosPermisos.some(p => p.startsWith(`${modulo}:`))
  //       );

  //       if (perdioAccesoCritico && actualizarPermisos) {
  //         console.warn('🚨 Usuario perdió acceso crítico - actualizando permisos');

  //         // Actualizar permisos en el contexto
  //         actualizarPermisos(nuevosPermisos);

  //         // Redirigir a página segura
  //         navigate('/acceso-restringido', { replace: true });
  //       }
  //     } catch (error) {
  //       console.error('Error en verificación crítica:', error);
  //     }
  //   };

  //   const interval = setInterval(verificarAccesoCritico, 5 * 60 * 1000);
  //   return () => clearInterval(interval);
  // }, [usuario, token, actualizarPermisos, navigate]);
};
