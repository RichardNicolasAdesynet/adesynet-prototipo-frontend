import React, { useState, useEffect } from 'react';
import type { ModuleFormProps, ModuloFormData } from '../../../../../types/admin.types';

export const ModuleForm: React.FC<ModuleFormProps> = ({
  modulo,
  isOpen,
  isEditing,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<ModuloFormData>({
    cdModulo: '',
    dsModulo: '',
    flgEdicion: true
  });

  const [errors, setErrors] = useState<Partial<ModuloFormData>>({});

  // Reset form when modulo prop changes
  useEffect(() => {
    if (modulo) {
      setFormData(modulo);
    } else {
      setFormData({
        cdModulo: '',
        dsModulo: '',
        flgEdicion: true
      });
    }
    setErrors({});
  }, [modulo, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ModuloFormData> = {};

    if (!formData.cdModulo.trim()) {
      newErrors.cdModulo = 'Código de módulo es requerido';
    } else if (formData.cdModulo.length !== 5) {
      newErrors.cdModulo = 'El código debe tener 5 caracteres';
    }

    if (!formData.dsModulo.trim()) {
      newErrors.dsModulo = 'Descripción del módulo es requerida';
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

  const handleChange = (field: keyof ModuloFormData, value: any) => {
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
      <div className="module-form-modal">
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Módulo' : 'Crear Módulo'}</h2>
          <button onClick={onCancel} className="close-button" type="button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="module-form">
          <div className="form-grid">
            {/* Código de Módulo */}
            <div className="form-group">
              <label htmlFor="cdModulo" className="form-label">
                Código de Módulo *
              </label>
              <input
                id="cdModulo"
                type="text"
                value={formData.cdModulo}
                onChange={(e) => handleChange('cdModulo', e.target.value.toUpperCase())}
                className={`form-input ${errors.cdModulo ? 'error' : ''}`}
                maxLength={5}
                disabled={isEditing}
                placeholder="MOD01"
              />
              {errors.cdModulo && <span className="error-message">{errors.cdModulo}</span>}
              <div className="form-hint">5 caracteres (ej: MOD01)</div>
            </div>

            {/* Descripción del Módulo */}
            <div className="form-group full-width">
              <label htmlFor="dsModulo" className="form-label">
                Descripción del Módulo *
              </label>
              <input
                id="dsModulo"
                type="text"
                value={formData.dsModulo}
                onChange={(e) => handleChange('dsModulo', e.target.value)}
                className={`form-input ${errors.dsModulo ? 'error' : ''}`}
                placeholder="Sistema de Seguridad"
              />
              {errors.dsModulo && <span className="error-message">{errors.dsModulo}</span>}
            </div>

            {/* Permite Edición */}
            <div className="form-group">
              <label className="form-label checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.flgEdicion}
                  onChange={(e) => handleChange('flgEdicion', e.target.checked)}
                  className="form-checkbox"
                />
                Permite Edición
              </label>
              <div className="form-hint">
                Si está desactivado, el módulo será de solo lectura
              </div>
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