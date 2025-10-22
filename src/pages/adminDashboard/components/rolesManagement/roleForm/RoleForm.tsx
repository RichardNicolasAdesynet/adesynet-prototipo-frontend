import React, { useState, useEffect } from 'react';
import type { RoleFormProps, RolFormData } from '../../../../../types/admin.types';

export const RoleForm: React.FC<RoleFormProps> = ({
  rol,
  isOpen,
  isEditing,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<RolFormData>({
    cdRol: '',
    nombre: '',
    descripcion: '',
    activo: true
  });

  const [errors, setErrors] = useState<Partial<RolFormData>>({});

  // Reset form when rol prop changes
  useEffect(() => {
    if (rol) {
      setFormData(rol);
    } else {
      setFormData({
        cdRol: '',
        nombre: '',
        descripcion: '',
        activo: true
      });
    }
    setErrors({});
  }, [rol, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<RolFormData> = {};

    if (!formData.cdRol.trim()) {
      newErrors.cdRol = 'Código de rol es requerido';
    } else if (formData.cdRol.length !== 5) {
      newErrors.cdRol = 'El código debe tener 5 caracteres';
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Nombre del rol es requerido';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'Descripción es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof RolFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="role-form-modal">
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Rol' : 'Crear Rol'}</h2>
          <button onClick={onCancel} className="close-button" type="button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="role-form">
          <div className="form-grid">
            {/* Código de Rol */}
            <div className="form-group">
              <label htmlFor="cdRol" className="form-label">
                Código de Rol *
              </label>
              <input
                id="cdRol"
                type="text"
                value={formData.cdRol}
                onChange={(e) => handleChange('cdRol', e.target.value.toUpperCase())}
                className={`form-input ${errors.cdRol ? 'error' : ''}`}
                maxLength={5}
                disabled={isEditing}
                placeholder="ROL01"
              />
              {errors.cdRol && <span className="error-message">{errors.cdRol}</span>}
              <div className="form-hint">5 caracteres (ej: ROL01)</div>
            </div>

            {/* Nombre del Rol */}
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                Nombre del Rol *
              </label>
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className={`form-input ${errors.nombre ? 'error' : ''}`}
                placeholder="Administrador del Sistema"
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            {/* Descripción */}
            <div className="form-group full-width">
              <label htmlFor="descripcion" className="form-label">
                Descripción *
              </label>
              <textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                className={`form-textarea ${errors.descripcion ? 'error' : ''}`}
                rows={3}
                placeholder="Describe las responsabilidades y permisos de este rol..."
              />
              {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
            </div>

            {/* Estado */}
            <div className="form-group">
              <label className="form-label checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) => handleChange('activo', e.target.checked)}
                  className="form-checkbox"
                />
                Rol Activo
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="cancel-button"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};