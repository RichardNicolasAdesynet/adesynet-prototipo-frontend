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
    <div className="actions-dropdown" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="dropdown-toggle"
        type="button"
        aria-label="Acciones"
      >
        ⋯
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <button
            onClick={handleViewDetails}
            className="dropdown-item"
            type="button"
          >
            👁️ Ver Detalles
          </button>
          
          <button
            onClick={handleEdit}
            className="dropdown-item"
            type="button"
          >
            ✏️ Editar
          </button>
          
          <button
            onClick={handleToggleStatus}
            className="dropdown-item"
            type="button"
          >
            {entidad.estaActivo ? '❌ Desactivar' : '✅ Activar'}
          </button>

          {/* Acciones personalizadas */}
          {customActions.map((accion, index) => (
            <button
              key={index}
              onClick={() => accion.onClick(entidad)}
              className={`dropdown-item ${accion.peligroso ? 'danger' : ''}`}
              type="button"
            >
              {accion.icono} {accion.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
