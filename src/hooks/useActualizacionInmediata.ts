// hooks/useActualizacionInmediata.ts (NUEVO)
import { useEffect } from "react";
import { useAuth } from "./auth/useAuth";
import { authService } from "../services/api/authService";

const mapRolToInternal = (userInfo: any): any => {
  const roleMap: Record<string, string> = {
    ROL01: "desarrollador",
    ROL02: "gerente", //administrador
    ROL03: "administrador", //supervisor
    ROL04: "supervisor",
    ROL05: "tecnico",
  };
  const otrosRol = userInfo.rolNombre.toLowerCase();
  return roleMap[userInfo.idRol] || `${otrosRol}`;
};

export const useActualizacionInmediata = () => {
  const { usuario, token, actualizarPermisos } = useAuth();

  useEffect(() => {
    if (!usuario || !token) return;

    //console.log("⚡ useActualizacionInmediata - Verificación al cargar");

    const verificarInmediatamente = async () => {
      try {
        const userInfoActualizado = await authService.getUserInfo(token);

        if (!userInfoActualizado) return;

        const nuevoRol = mapRolToInternal(userInfoActualizado);

        const permisosActuales = usuario.permisos || [];
        const nuevosPermisos = userInfoActualizado.permisos || [];

        const hayCambios =
          JSON.stringify(permisosActuales) !== JSON.stringify(nuevosPermisos);

        const cambios = { rol: usuario.rol !== nuevoRol };

        if (cambios.rol) {
          window.dispatchEvent(
            new CustomEvent("cambiosCriticosDetectados", {
              detail: { cambios, userInfoActualizado },
            })
          );
        }

        if (hayCambios) {
          // console.log(
          //   "⚡ Cambios detectados al cargar - Actualizando inmediatamente"
          // );

          if (actualizarPermisos) {
            actualizarPermisos(nuevosPermisos);
            window.dispatchEvent(
              new CustomEvent("permisosActualizados", {
                detail: {
                  cambios: detectarCambios(permisosActuales, nuevosPermisos),
                },
              })
            );
          }

          // ✅ ACTUALIZAR LOCALSTORAGE INMEDIATAMENTE
          localStorage.setItem("userInfo", JSON.stringify(userInfoActualizado));
        } else {
          // console.log("✅ useActualizacionInmediata - Sin cambios al cargar");
        }
      } catch (error) {
        // console.warn("❌ Error en verificación inmediata:", error);
      }
    };

    // Ejecutar inmediatamente al cargar
    verificarInmediatamente();
  }, [usuario, token, actualizarPermisos]); // Se ejecuta cuando usuario/token cambian
};

const detectarCambios = (viejos: string[], nuevos: string[]): string[] => {
  const agregados = nuevos.filter((p) => !viejos.includes(p));
  const eliminados = viejos.filter((p) => !nuevos.includes(p));

  return [
    ...agregados.map((p) => `(Añadido) + ${p}`),
    ...eliminados.map((p) => `(Quitado) - ${p}`),
  ];
};
