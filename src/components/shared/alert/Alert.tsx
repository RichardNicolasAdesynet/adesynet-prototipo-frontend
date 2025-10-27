// src/components/shared/Alert/Alert.tsx
import React from 'react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
  autoClose = false,
  duration = 5000,
  className = ''
}) => {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  // Sistema de estilos mejorado con Tailwind
  const getStyles = () => {
    const baseStyles = `
      relative
      rounded-2xl
      p-4
      shadow-lg
      backdrop-blur-sm
      border
      animate-fade-in
      transition-all duration-300
      transform hover:scale-105
      ${className}
    `;

    const typeStyles = {
      success: `
        bg-gradient-to-r from-emerald-50/90 to-green-50/70
        border-emerald-200/60
        text-emerald-800
        shadow-emerald-500/10
      `,
      error: `
        bg-gradient-to-r from-rose-50/90 to-red-50/70  
        border-rose-200/60
        text-rose-800
        shadow-rose-500/10
      `,
      warning: `
        bg-gradient-to-r from-amber-50/90 to-orange-50/70
        border-amber-200/60
        text-amber-800
        shadow-amber-500/10
      `,
      info: `
        bg-gradient-to-r from-cyan-50/90 to-blue-50/70
        border-cyan-200/60
        text-cyan-800
        shadow-cyan-500/10
      `
    };

    return `${baseStyles} ${typeStyles[type]}`;
  };

  // Iconos mejorados con fondos circulares
  const getIcon = () => {
    const iconConfig = {
      success: {
        icon: '✅',
        bg: 'bg-emerald-100',
        border: 'border-emerald-200'
      },
      error: {
        icon: '❌', 
        bg: 'bg-rose-100',
        border: 'border-rose-200'
      },
      warning: {
        icon: '⚠️',
        bg: 'bg-amber-100', 
        border: 'border-amber-200'
      },
      info: {
        icon: 'ℹ️',
        bg: 'bg-cyan-100',
        border: 'border-cyan-200'
      }
    };

    const config = iconConfig[type];

    return (
      <div className={`
        w-10 h-10
        ${config.bg}
        ${config.border}
        border-2
        rounded-full
        flex items-center justify-center
        text-lg
        shadow-sm
      `}>
        {config.icon}
      </div>
    );
  };

  // Barra de progreso para autoClose
  const ProgressBar = () => {
    if (!autoClose || !onClose) return null;

    return (
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-b-2xl overflow-hidden">
        <div 
          className={`
            h-full
            transition-all duration-1000 ease-linear
            ${type === 'success' ? 'bg-emerald-500' : ''}
            ${type === 'error' ? 'bg-rose-500' : ''}
            ${type === 'warning' ? 'bg-amber-500' : ''}
            ${type === 'info' ? 'bg-cyan-500' : ''}
          `}
          style={{ 
            width: '100%',
            animation: `shrinkWidth ${duration}ms linear forwards`
          }}
        />
      </div>
    );
  };

  return (
    <div className={getStyles()}>
      {/* Barra de progreso */}
      <ProgressBar />

      {/* Contenido de la alerta */}
      <div className="flex items-start space-x-3">
        {/* Icono */}
        <div className="flex-shrink-0">
          {getIcon()}
        </div>

        {/* Contenido textual */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className={`
              font-semibold
              text-lg
              mb-1
              ${type === 'success' ? 'text-emerald-700' : ''}
              ${type === 'error' ? 'text-rose-700' : ''}
              ${type === 'warning' ? 'text-amber-700' : ''}
              ${type === 'info' ? 'text-cyan-700' : ''}
            `}>
              {title}
            </h4>
            
            {/* Botón de cerrar */}
            {onClose && (
              <button 
                onClick={onClose}
                className={`
                  flex-shrink-0
                  w-6 h-6
                  flex items-center justify-center
                  rounded-lg
                  text-sm
                  transition-all duration-200
                  hover:scale-110
                  ${type === 'success' ? 'text-emerald-600 hover:bg-emerald-100' : ''}
                  ${type === 'error' ? 'text-rose-600 hover:bg-rose-100' : ''}
                  ${type === 'warning' ? 'text-amber-600 hover:bg-amber-100' : ''}
                  ${type === 'info' ? 'text-cyan-600 hover:bg-cyan-100' : ''}
                `}
                type="button"
                aria-label="Cerrar alerta"
              >
                ×
              </button>
            )}
          </div>
          
          <p className={`
            text-sm
            leading-relaxed
            ${type === 'success' ? 'text-emerald-600' : ''}
            ${type === 'error' ? 'text-rose-600' : ''}
            ${type === 'warning' ? 'text-amber-600' : ''}
            ${type === 'info' ? 'text-cyan-600' : ''}
          `}>
            {message}
          </p>
        </div>
      </div>

      {/* Efecto de brillo sutil */}
      <div className={`
        absolute inset-0
        bg-gradient-to-br from-white/30 to-transparent
        rounded-2xl
        pointer-events-none
        opacity-0 hover:opacity-100
        transition-opacity duration-300
      `} />
    </div>
  );
};