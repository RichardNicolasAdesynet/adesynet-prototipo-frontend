// components/shared/ModalReconexion.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/auth/useAuth';
import { authService } from '../../../services/api/authService';

export const ModalReconexion: React.FC = () => {
  const [mostrar, setMostrar] = useState(false);
  const [cambios, setCambios] = useState<any>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const manejarCambiosCriticos = (event: Event) => {
      const customEvent = event as CustomEvent;
      setCambios(customEvent.detail.cambios);
      setMostrar(true);
      console.table(` ${customEvent.detail.cambios}`);
    };

    window.addEventListener('cambiosCriticosDetectados', manejarCambiosCriticos);
    return () => window.removeEventListener('cambiosCriticosDetectados', manejarCambiosCriticos);
  }, []);

//   const handleReconectar = () => {
//     window.location.reload();
//   };

  const handleReconectar = async () => {
    try {
      console.log('🔄 Iniciando reconexión...');
      
      // ✅ 1. LIMPIAR CACHE LOCAL
      localStorage.removeItem('userInfo');
      localStorage.removeItem('permisos_hash'); // Si usas este
      
      // ✅ 2. OBTENER NUEVO TOKEN (forzar nueva autenticación)
      const token = authService.getStoredToken();
      if (token) {
        const userInfoActualizado = await authService.getUserInfo(token);
        
        if (userInfoActualizado) {
          // ✅ 3. ACTUALIZAR LOCALSTORAGE CON NUEVOS DATOS
          localStorage.setItem('userInfo', JSON.stringify(userInfoActualizado));
          console.log('✅ Datos actualizados en localStorage:', {
            nombre: userInfoActualizado.nombreCompleto,
            rol: userInfoActualizado.rolNombre
          });
        }
      }
      
      // ✅ 4. RECARGAR PARA REINICIAR CONTEXTO
      console.log('🔄 Recargando aplicación...');
      window.location.reload();
      
    } catch (error) {
      console.error('❌ Error en reconexión:', error);
      // Fallback: recargar igualmente
      window.location.reload();
    }
  };



  const handleCerrarSesion = () => {
    logout();
  };

  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">⚠️</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Actualización requerida</h3>
            <p className="text-sm text-gray-600">Se detectaron cambios en tu información</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-yellow-800 mb-2">Cambios detectados:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            {cambios?.nombre && <li>• Tu nombre ha cambiado</li>}
            {cambios?.rol && <li>• Tu rol ha sido actualizado</li>}
          </ul>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleReconectar}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            🔄 Aplicar cambios ahora
          </button>
          <button
            onClick={handleCerrarSesion}
            className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};