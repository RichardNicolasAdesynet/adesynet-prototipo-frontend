import React, { useState, useRef, useEffect } from 'react';
import type { ActionsDropdownProps, BaseEntity } from '../../../types/admin.types';

export const ActionsDropdown = <T extends BaseEntity>({
  entidad,
  onEdit,
  onToggleStatus,
  onViewDetails,
  customActions = []
}: ActionsDropdownProps<T>): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleEdit = () => {
    onEdit(entidad);
    setIsOpen(false);
  };

  const handleToggleStatus = () => {
    onToggleStatus(entidad.id, !entidad.estaActivo);
    setIsOpen(false);
  };

  const handleViewDetails = () => {
    onViewDetails(entidad);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Botón del dropdown */}
      <button
        onClick={toggleDropdown}
        className="
          w-8 h-8 flex items-center justify-center
          bg-slate-100 hover:bg-slate-200
          border border-slate-300
          rounded-lg
          transition-all duration-200
          hover:scale-110 active:scale-95
          group
        "
        type="button"
        aria-label="Acciones"
      >
        <span className="text-slate-600 group-hover:text-slate-800 transition-colors">
          ⋯
        </span>
      </button>
      
      {/* Menú desplegable */}
      {isOpen && (
        <div className="
          absolute right-0 mt-2 w-56
          bg-white/95 backdrop-blur-xl
          border border-slate-200/60
          rounded-xl shadow-2xl shadow-slate-400/20
          py-2 z-50
          animate-fade-in
        ">
          {/* Ver Detalles */}
          <button
            onClick={handleViewDetails}
            className="
              w-full px-4 py-3
              flex items-center space-x-3
              text-slate-700 hover:text-cyan-700
              hover:bg-cyan-50/80
              transition-all duration-200
              group
            "
            type="button"
          >
            <div className="w-6 h-6 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-cyan-600 text-sm">👁️</span>
            </div>
            <span className="font-medium">Ver Detalles</span>
          </button>
          
          {/* Editar */}
          <button
            onClick={handleEdit}
            className="
              w-full px-4 py-3
              flex items-center space-x-3
              text-slate-700 hover:text-blue-700
              hover:bg-blue-50/80
              transition-all duration-200
              group
            "
            type="button"
          >
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-blue-600 text-sm">✏️</span>
            </div>
            <span className="font-medium">Editar</span>
          </button>
          
          {/* Activar/Desactivar */}
          <button
            onClick={handleToggleStatus}
            className={`
              w-full px-4 py-3
              flex items-center space-x-3
              transition-all duration-200
              group
              ${entidad.estaActivo 
                ? 'text-slate-700 hover:text-red-700 hover:bg-red-50/80' 
                : 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/80'
              }
            `}
            type="button"
          >
            <div className={`
              w-6 h-6 rounded-lg flex items-center justify-center 
              group-hover:scale-110 transition-transform
              ${entidad.estaActivo ? 'bg-red-100' : 'bg-emerald-100'}
            `}>
              <span className={`text-sm ${entidad.estaActivo ? 'text-red-600' : 'text-emerald-600'}`}>
                {entidad.estaActivo ? '❌' : '✅'}
              </span>
            </div>
            <span className="font-medium">
              {entidad.estaActivo ? 'Desactivar' : 'Activar'}
            </span>
          </button>

          {/* Línea separadora */}
          {customActions.length > 0 && (
            <div className="border-t border-slate-200/60 my-2"></div>
          )}

          {/* Acciones personalizadas */}
          {customActions.map((accion, index) => (
            <button
              key={index}
              onClick={() => accion.onClick(entidad)}
              className={`
                w-full px-4 py-3
                flex items-center space-x-3
                transition-all duration-200
                group
                ${accion.peligroso 
                  ? 'text-slate-700 hover:text-red-700 hover:bg-red-50/80' 
                  : 'text-slate-700 hover:text-purple-700 hover:bg-purple-50/80'
                }
              `}
              type="button"
            >
              <div className={`
                w-6 h-6 rounded-lg flex items-center justify-center 
                group-hover:scale-110 transition-transform
                ${accion.peligroso ? 'bg-red-100' : 'bg-purple-100'}
              `}>
                <span className={`text-sm ${accion.peligroso ? 'text-red-600' : 'text-purple-600'}`}>
                  {accion.icono}
                </span>
              </div>
              <span className="font-medium">{accion.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // return (
  //   <div className="actions-dropdown" ref={dropdownRef}>
  //     <button
  //       onClick={toggleDropdown}
  //       className="dropdown-toggle"
  //       type="button"
  //       aria-label="Acciones"
  //     >
  //       ⋯
  //     </button>
      
  //     {isOpen && (
  //       <div className="dropdown-menu">
  //         <button
  //           onClick={handleViewDetails}
  //           className="dropdown-item"
  //           type="button"
  //         >
  //           👁️ Ver Detalles
  //         </button>
          
  //         <button
  //           onClick={handleEdit}
  //           className="dropdown-item"
  //           type="button"
  //         >
  //           ✏️ Editar
  //         </button>
          
  //         <button
  //           onClick={handleToggleStatus}
  //           className="dropdown-item"
  //           type="button"
  //         >
  //           {entidad.estaActivo ? '❌ Desactivar' : '✅ Activar'}
  //         </button>

  //         {/* Acciones personalizadas */}
  //         {customActions.map((accion, index) => (
  //           <button
  //             key={index}
  //             onClick={() => accion.onClick(entidad)}
  //             className={`dropdown-item ${accion.peligroso ? 'danger' : ''}`}
  //             type="button"
  //           >
  //             {accion.icono} {accion.label}
  //           </button>
  //         ))}
  //       </div>
  //     )}
  //   </div>
  // );
};
