import React, { useEffect, useRef, useState } from 'react';
import type { ExportButtonProps } from '../../../types/admin.types';

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  loading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

   // 🔧 CORRECCIÓN: Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExport = (formato: 'excel' | 'pdf') => {
    onExport(formato);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Botón Principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`
          group relative
          px-4 py-2.5
          bg-gradient-to-r from-emerald-500 to-green-600
          hover:from-emerald-600 hover:to-green-700
          disabled:from-emerald-400 disabled:to-green-500
          text-white font-medium
          rounded-xl
          shadow-lg shadow-emerald-500/25
          hover:shadow-xl hover:shadow-emerald-500/35
          disabled:shadow-none
          transition-all duration-300
          transform hover:scale-105 disabled:scale-100
          border border-emerald-400/30
          backdrop-blur-sm
          flex items-center space-x-2
          min-w-[120px] justify-center
        `}
        type="button"
      >
        {/* Spinner de carga */}
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Exportando...</span>
          </>
        ) : (
          <>
            <span className="text-lg">📤</span>
            <span>Exportar</span>
            <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
              ⌄
            </span>
          </>
        )}
      </button>
      
      {/* Menú Desplegable */}
      {isOpen && !loading && (
        <div className="
          absolute right-0 mt-2 w-48
          bg-white/95 backdrop-blur-xl
          border border-slate-200/60
          rounded-xl shadow-2xl shadow-slate-400/20
          py-2 z-50
          animate-fade-in
          overflow-hidden
        ">
          {/* Opción Excel */}
          <button
            onClick={() => handleExport('excel')}
            className="
              w-full px-4 py-3
              flex items-center space-x-3
              text-slate-700 hover:text-emerald-700
              hover:bg-emerald-50/80
              transition-all duration-200
              group
            "
            type="button"
          >
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-emerald-600 text-sm">📊</span>
            </div>
            <div className="text-left">
              <div className="font-medium">Excel</div>
              <div className="text-xs text-slate-500">Formato .xlsx</div>
            </div>
          </button>

          {/* Separador */}
          <div className="border-t border-slate-200/60 my-1"></div>

          {/* Opción PDF */}
          <button
            onClick={() => handleExport('pdf')}
            className="
              w-full px-4 py-3
              flex items-center space-x-3
              text-slate-700 hover:text-red-600
              hover:bg-red-50/80
              transition-all duration-200
              group
            "
            type="button"
          >
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-red-600 text-sm">📄</span>
            </div>
            <div className="text-left">
              <div className="font-medium">PDF</div>
              <div className="text-xs text-slate-500">Documento .pdf</div>
            </div>
          </button>
        </div>
      )}

      {/* Efecto de brillo sutil */}
      <div className={`
        absolute inset-0 rounded-xl
        bg-gradient-to-r from-white/20 to-transparent
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        pointer-events-none
        ${loading ? 'opacity-0' : ''}
      `}></div>
    </div>
  );

  // return (
  //   <div className="export-button-container">
  //     <button
  //       onClick={() => setIsOpen(!isOpen)}
  //       disabled={loading}
  //       className="export-button"
  //       type="button"
  //     >
  //       {loading ? 'Exportando...' : 'Exportar'}
  //     </button>
      
  //     {isOpen && (
  //       <div className="export-dropdown">
  //         <button
  //           onClick={() => handleExport('excel')}
  //           className="export-option"
  //           type="button"
  //         >
  //           📊 Excel
  //         </button>
  //         <button
  //           onClick={() => handleExport('pdf')}
  //           className="export-option"
  //           type="button"
  //         >
  //           📄 PDF
  //         </button>
  //       </div>
  //     )}
  //   </div>
  // );
};