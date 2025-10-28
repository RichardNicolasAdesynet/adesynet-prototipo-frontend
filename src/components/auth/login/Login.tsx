import React, { useEffect } from 'react';
import { useLogin } from '../../../hooks/auth/useLogin';
import { useAuth } from '../../../hooks/auth/useAuth';
import { useAuthRedirect } from '../../../hooks/auth/useAuthRedirect';
import type { LoginProps } from './Login.types';
import type { Credenciales } from '../../../types/auth.types';


// Login.tsx - VERSIÓN TECNOLÓGICO VIBRANTE
export const Login: React.FC<LoginProps> = ({ onLoginExitoso }) => {
  const { login, cargando, error, setError } = useLogin();
  const { estaAutenticado, usuario } = useAuth();
  
  // Usar el hook de redirección
  useAuthRedirect();

  // ✅ CORREGIDO: Efecto para manejar login exitoso
  useEffect(() => {
    if (estaAutenticado && usuario && onLoginExitoso) {
      console.log('✅ Login exitoso, ejecutando callback');
      onLoginExitoso(usuario);
    }
  }, [estaAutenticado, usuario, onLoginExitoso]);

  const manejarSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const credenciales: Credenciales = {
      idUsuario: formData.get('usuario') as string,
      claveUsuario: formData.get('password') as string
    };

    console.log('📤 Enviando credenciales:', credenciales);

    const resultado = await login(credenciales);
    
    if (resultado.exito) {
      console.log('🎉 Login exitoso desde componente');
      // La redirección se maneja automáticamente con useAuthRedirect
    } else {
      console.error('❌ Error en login:', resultado.mensaje);
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Sistema ADESYNET</h1>
          <p>Ingrese sus credenciales</p>
        </div>

        <form onSubmit={manejarSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              placeholder="Ingrese su usuario"
              required
              disabled={cargando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Ingrese su contraseña"
              required
              disabled={cargando}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={cargando}
          >
            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );



    // return (
    //     <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 flex relative overflow-hidden">
    //         {/* Efectos de fondo animados */}
    //         <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
    //         <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-xl animate-bounce"></div>
    //         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-xl animate-bounce delay-1000"></div>

    //         {/* Sección de imagen con logo */}
    //         <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative z-10">
    //             <div className="text-white text-center transform hover:scale-105 transition-transform duration-700">
    //                 {/* Contenedor del logo con efectos */}
    //                 <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl mb-8 animate-float">
    //                     {/* Reemplaza esta ruta con la ubicación real de tu logo */}
    //                     <img 
    //                         src="../public/adesyLogo.png" // 📁 CAMBIA ESTA RUTA
    //                         alt="ADES+ NET Logo"
    //                         className="w-48 h-auto mx-auto mb-4 drop-shadow-2xl"
    //                     />
    //                     <div className="text-center">
    //                         <div className="text-2xl font-bold text-white mb-2">ADESY NET</div>
    //                         <div className="text-blue-200 text-sm font-light">
    //                             EXCELENCIA EN SOLUCIONES FARMACÉUTICAS
    //                         </div>
    //                     </div>
    //                 </div>
                    
    //                 {/* Texto adicional */}
    //                 <h3 className="text-3xl font-bold mb-4 bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
    //                     Sistema de Soporte TI
    //                 </h3>
    //                 <p className="text-blue-200 text-lg">Área de Tecnologías de la Información</p>
    //             </div>
    //         </div>

    //         {/* Sección del formulario */}
    //         <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative z-10">
    //             <div className="w-full max-w-md">
    //                 {/* Header para móvil */}
    //                 <div className="text-center mb-8 lg:hidden">
    //                     <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">
    //                         <img 
    //                             src="../public/adesyLogo.png" // 📁 CAMBIA ESTA RUTA
    //                             alt="ADESY NET Logo"
    //                             className="w-32 h-auto mx-auto mb-3"
    //                         />
    //                         <div className="text-white font-bold">ADESY NET</div>
    //                     </div>
    //                     <LoginHeader 
    //                         titulo="Sistema de Soporte TI"
    //                         subtitulo="Área de Tecnologías de la Información"
    //                     />
    //                 </div>

    //                 {/* Formulario */}
    //                 <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
    //                     {error && (
    //                         <div className="mb-6 bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-white px-4 py-3 rounded-lg animate-pulse">
    //                             <div className="flex items-center">
    //                                 <span className="text-red-200">⚠</span>
    //                                 <span className="ml-2">{error}</span>
    //                             </div>
    //                         </div>
    //                     )}
                        
    //                     <LoginForm 
    //                         onSubmit={manejarLogin}
    //                         cargando={cargando}
    //                     />
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
};

// export const Login: React.FC<LoginProps> = ({ 
//     onLoginExitoso 
// }) => {
//     const { login: authLogin } = useAuth();
//     const { login, cargando, error } = useLogin();

//     const manejarLogin = async (credenciales: any) => {
//         const resultado = await login(credenciales);
        
//         if (resultado.exito && resultado.usuario && resultado.token) {
//             // Aquí integrarás con tu AuthContext real
//             console.log('Login exitoso:', resultado.usuario);
//             onLoginExitoso?.(resultado.usuario);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//             <div className="sm:mx-auto sm:w-full sm:max-w-md">
//                 <LoginHeader 
//                     titulo="Sistema de Soporte TI"
//                     subtitulo="Área de Tecnologías de la Información"
//                 />
//             </div>

//             <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//                 <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//                     {error && (
//                         <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//                             {error}
//                         </div>
//                     )}
                    
//                     <LoginForm 
//                         onSubmit={manejarLogin}
//                         cargando={cargando}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };