// import { useEffect, useState } from "react";
// import { useAuth } from "./auth/useAuth";

// // Hook auxiliar para detectar cambios específicos
// export const useDeteccionCambios = () => {
//   const { usuario } = useAuth();
//   const [cambiosDetectados, setCambiosDetectados] = useState<string[]>([]);

//   useEffect(() => {
//     const hashPermisos = (permisos: string[]) => 
//       btoa(permisos.sort().join('|'));

//     const verificar = async () => {
//       const nuevosPermisos = await api.get('/usuario/permisos');
      
//       if (usuario) {
//         const hashViejo = hashPermisos(usuario.permisos);
//         const hashNuevo = hashPermisos(nuevosPermisos);
        
//         if (hashViejo !== hashNuevo) {
//           const cambios = detectarCambiosEspecificos(usuario.permisos, nuevosPermisos);
//           setCambiosDetectados(cambios);
//         }
//       }
//     };

//     const interval = setInterval(verificar, 2 * 60 * 1000); // 2 min para debug
//     return () => clearInterval(interval);
//   }, [usuario]);

//   return cambiosDetectados;
// };