// Mismo componente que antes - no cambia
import React, { useState, useEffect } from 'react';

export const NotificacionCambiosAutomatica: React.FC = () => {
  const [mostrar, setMostrar] = useState(false);
  const [cambios, setCambios] = useState<string[]>([]);

  useEffect(() => {
    const manejarCambios = (event: Event) => {
      const customEvent = event as CustomEvent;
      setCambios(customEvent.detail.cambios);
      setMostrar(true);
      setTimeout(() => setMostrar(false), 6000);
    };

    window.addEventListener('permisosActualizados', manejarCambios);
    return () => window.removeEventListener('permisosActualizados', manejarCambios);
  }, []);

  if (!mostrar) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg animate-fade-in max-w-sm">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-green-800">
            Permisos actualizados
          </h4>
          <p className="text-sm text-green-700 mt-1">
            {cambios.length > 0 ? 'Se han modificado tus accesos' : 'Tus permisos han sido sincronizados'}
          </p>
          
          {cambios.length > 0 && (
            <div className="mt-2 text-xs text-green-600">
              {cambios.map((cambio, index) => (
                <div key={index}>{cambio}</div>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={() => setMostrar(false)}
          className="flex-shrink-0 text-green-400 hover:text-green-600 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
};