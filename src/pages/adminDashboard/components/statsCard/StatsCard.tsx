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
  // Sistema de colores mejorado con gradientes
  const getTipoClasses = () => {
    const clases = {
      primary: {
        gradient: 'from-cyan-500 to-blue-500',
        bg: 'bg-gradient-to-br from-cyan-50 to-blue-50/50',
        border: 'border-cyan-200/60',
        text: 'text-cyan-700',
        light: 'text-cyan-600'
      },
      success: {
        gradient: 'from-emerald-500 to-green-500',
        bg: 'bg-gradient-to-br from-emerald-50 to-green-50/50',
        border: 'border-emerald-200/60',
        text: 'text-emerald-700',
        light: 'text-emerald-600'
      },
      warning: {
        gradient: 'from-amber-500 to-orange-500',
        bg: 'bg-gradient-to-br from-amber-50 to-orange-50/50',
        border: 'border-amber-200/60',
        text: 'text-amber-700',
        light: 'text-amber-600'
      },
      danger: {
        gradient: 'from-rose-500 to-red-500',
        bg: 'bg-gradient-to-br from-rose-50 to-red-50/50',
        border: 'border-rose-200/60',
        text: 'text-rose-700',
        light: 'text-rose-600'
      },
      info: {
        gradient: 'from-purple-500 to-indigo-500',
        bg: 'bg-gradient-to-br from-purple-50 to-indigo-50/50',
        border: 'border-purple-200/60',
        text: 'text-purple-700',
        light: 'text-purple-600'
      }
    };
    return clases[tipo];
  };

  const tipoClasses = getTipoClasses();

  // Gráfico circular simple basado en la variación
  const renderMiniChart = () => {
    if (variacion === undefined) return null;

    const porcentaje = Math.min(Math.abs(variacion), 100);
    const esPositivo = variacion >= 0;
    
    return (
      <div className="relative w-12 h-12">
        {/* Fondo del círculo */}
        <div className="absolute inset-0 rounded-full bg-slate-200/50"></div>
        
        {/* Segmento de progreso */}
        <div 
          className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
          style={{
            background: `conic-gradient(${esPositivo ? '#10b981' : '#ef4444'} 0% ${porcentaje}%, transparent ${porcentaje}% 100%)`
          }}
        ></div>
        
        {/* Texto central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold ${esPositivo ? 'text-emerald-600' : 'text-rose-600'}`}>
            {esPositivo ? '↗' : '↘'}
          </span>
        </div>
      </div>
    );
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
    <div className={`
      relative
      ${tipoClasses.bg}
      border ${tipoClasses.border}
      rounded-2xl
      p-6
      shadow-lg
      hover:shadow-xl
      hover:scale-105
      transition-all duration-300
      group
      overflow-hidden
    `}>
      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Título */}
            <p className={`text-sm font-semibold ${tipoClasses.light} uppercase tracking-wide`}>
              {titulo}
            </p>
            
            {/* Valor principal */}
            <p className={`text-3xl font-bold ${tipoClasses.text} mt-2`}>
              {valor}
            </p>
            
            {/* Subtítulo */}
            {subtitulo && (
              <p className={`text-sm ${tipoClasses.light} mt-1`}>
                {subtitulo}
              </p>
            )}
            
            {/* Variación con mini chart */}
            {variacion !== undefined && (
              <div className="flex items-center space-x-2 mt-3">
                {renderMiniChart()}
                <div>
                  <p className={`text-sm font-semibold ${variacion >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {variacion >= 0 ? '+' : ''}{variacion}%
                  </p>
                  <p className="text-xs text-slate-500">vs anterior</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Icono */}
          <div className={`
            w-12 h-12
            bg-gradient-to-r ${tipoClasses.gradient}
            rounded-xl
            flex items-center justify-center
            text-white text-lg
            shadow-lg
            group-hover:scale-110
            transition-transform duration-300
            ml-4
          `}>
            {getIcono()}
          </div>
        </div>
      </div>
      
      {/* Línea decorativa inferior */}
      <div className={`
        absolute bottom-0 left-0 right-0
        h-1
        bg-gradient-to-r ${tipoClasses.gradient}
        transform scale-x-0 group-hover:scale-x-100
        transition-transform duration-500
        origin-left
      `}></div>
    </div>
  );

  // return (
  //   <div className={`border rounded-lg p-6 ${getTipoClasses()}`}>
  //     <div className="flex items-center justify-between">
  //       <div>
  //         <p className="text-sm font-medium opacity-75">{titulo}</p>
  //         <p className="text-2xl font-bold mt-1">{valor}</p>
  //         {subtitulo && (
  //           <p className="text-xs mt-1 opacity-75">{subtitulo}</p>
  //         )}
  //         {variacion !== undefined && (
  //           <p className={`text-xs mt-1 ${variacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
  //             {variacion >= 0 ? '↗' : '↘'} {Math.abs(variacion)}%
  //           </p>
  //         )}
  //       </div>
  //       <div className="text-3xl opacity-75">
  //         {getIcono()}
  //       </div>
  //     </div>
  //   </div>
  // );
};