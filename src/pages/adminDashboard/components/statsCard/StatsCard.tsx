import React from 'react';
import type { StatsCardProps } from '../../../../types/admin.types';

export const StatsCard: React.FC<StatsCardProps> = ({
  titulo,
  valor,
  subtitulo,
  variacion,
  icono,
  tipo = 'primary'
}) => {
  const getTipoClasses = () => {
    const clases = {
      primary: 'border-blue-200 bg-blue-50 text-blue-700',
      success: 'border-green-200 bg-green-50 text-green-700',
      warning: 'border-yellow-200 bg-yellow-50 text-yellow-700',
      danger: 'border-red-200 bg-red-50 text-red-700',
      info: 'border-gray-200 bg-gray-50 text-gray-700'
    };
    return clases[tipo];
  };

  const getIcono = () => {
    const iconos = {
      primary: '👥',
      success: '✅',
      warning: '⚠️',
      danger: '❌',
      info: '📊'
    };
    return icono || iconos[tipo];
  };

  return (
    <div className={`border rounded-lg p-6 ${getTipoClasses()}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{titulo}</p>
          <p className="text-2xl font-bold mt-1">{valor}</p>
          {subtitulo && (
            <p className="text-xs mt-1 opacity-75">{subtitulo}</p>
          )}
          {variacion !== undefined && (
            <p className={`text-xs mt-1 ${variacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {variacion >= 0 ? '↗' : '↘'} {Math.abs(variacion)}%
            </p>
          )}
        </div>
        <div className="text-3xl opacity-75">
          {getIcono()}
        </div>
      </div>
    </div>
  );
};