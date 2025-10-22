import React, { useState, useEffect } from 'react';
import type { UserFormProps, UsuarioFormData } from '../../../../../types/admin.types';

export const UserForm: React.FC<UserFormProps> = ({
  usuario,
  roles,
  isOpen,
  isEditing,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<UsuarioFormData>({
    cdUsuario: '',
    dsUsuario: '',
    nombre: '',
    apellidoP: '',
    apellidoM: '',
    dni: '',
    email: '',
    cdRol: 'ROL05',
    estaActivo: true,
    claveUsuario: ''
  });

  const [errors, setErrors] = useState<Partial<UsuarioFormData>>({});

  // Reset form when usuario prop changes
  useEffect(() => {
    if (usuario) {
      setFormData(usuario);
    } else {
      setFormData({
        cdUsuario: '',
        dsUsuario: '',
        nombre: '',
        apellidoP: '',
        apellidoM: '',
        dni: '',
        email: '',
        cdRol: 'ROL05',
        estaActivo: true,
        claveUsuario: ''
      });
    }
    setErrors({});
  }, [usuario, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UsuarioFormData> = {};

    if (!formData.cdUsuario.trim()) {
      newErrors.cdUsuario = 'Código de usuario es requerido';
    }

    if (!formData.dsUsuario.trim()) {
      newErrors.dsUsuario = 'Descripción de usuario es requerida';
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Nombre es requerido';
    }

    if (!formData.apellidoP.trim()) {
      newErrors.apellidoP = 'Apellido paterno es requerido';
    }

    if (!formData.dni.trim() || formData.dni.length !== 8) {
      newErrors.dni = 'DNI debe tener 8 dígitos';
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Email válido es requerido';
    }

    if (!isEditing && !formData.claveUsuario) {
      newErrors.claveUsuario = 'Contraseña es requerida para nuevo usuario';
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

  const handleChange = (field: keyof UsuarioFormData, value: any) => {
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
      <div className="user-form-modal">
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</h2>
          <button onClick={onCancel} className="close-button" type="button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-grid">
            {/* Código de Usuario */}
            <div className="form-group">
              <label htmlFor="cdUsuario" className="form-label">
                Código de Usuario *
              </label>
              <input
                id="cdUsuario"
                type="text"
                value={formData.cdUsuario}
                onChange={(e) => handleChange('cdUsuario', e.target.value.toUpperCase())}
                className={`form-input ${errors.cdUsuario ? 'error' : ''}`}
                maxLength={5}
                disabled={isEditing}
              />
              {errors.cdUsuario && <span className="error-message">{errors.cdUsuario}</span>}
            </div>

            {/* Descripción del Usuario */}
            <div className="form-group">
              <label htmlFor="dsUsuario" className="form-label">
                Descripción del Usuario *
              </label>
              <input
                id="dsUsuario"
                type="text"
                value={formData.dsUsuario}
                onChange={(e) => handleChange('dsUsuario', e.target.value)}
                className={`form-input ${errors.dsUsuario ? 'error' : ''}`}
              />
              {errors.dsUsuario && <span className="error-message">{errors.dsUsuario}</span>}
            </div>

            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                Nombre *
              </label>
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className={`form-input ${errors.nombre ? 'error' : ''}`}
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            {/* Apellido Paterno */}
            <div className="form-group">
              <label htmlFor="apellidoP" className="form-label">
                Apellido Paterno *
              </label>
              <input
                id="apellidoP"
                type="text"
                value={formData.apellidoP}
                onChange={(e) => handleChange('apellidoP', e.target.value)}
                className={`form-input ${errors.apellidoP ? 'error' : ''}`}
              />
              {errors.apellidoP && <span className="error-message">{errors.apellidoP}</span>}
            </div>

            {/* Apellido Materno */}
            <div className="form-group">
              <label htmlFor="apellidoM" className="form-label">
                Apellido Materno
              </label>
              <input
                id="apellidoM"
                type="text"
                value={formData.apellidoM}
                onChange={(e) => handleChange('apellidoM', e.target.value)}
                className="form-input"
              />
            </div>

            {/* DNI */}
            <div className="form-group">
              <label htmlFor="dni" className="form-label">
                DNI *
              </label>
              <input
                id="dni"
                type="text"
                value={formData.dni}
                onChange={(e) => handleChange('dni', e.target.value.replace(/\D/g, ''))}
                className={`form-input ${errors.dni ? 'error' : ''}`}
                maxLength={8}
              />
              {errors.dni && <span className="error-message">{errors.dni}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Rol */}
            <div className="form-group">
              <label htmlFor="cdRol" className="form-label">
                Rol *
              </label>
              <select
                id="cdRol"
                value={formData.cdRol}
                onChange={(e) => handleChange('cdRol', e.target.value)}
                className="form-select"
              >
                {roles.map(rol => (
                  <option key={rol.cdRol} value={rol.cdRol}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Contraseña (solo para nuevo usuario) */}
            {!isEditing && (
              <div className="form-group">
                <label htmlFor="claveUsuario" className="form-label">
                  Contraseña *
                </label>
                <input
                  id="claveUsuario"
                  type="password"
                  value={formData.claveUsuario}
                  onChange={(e) => handleChange('claveUsuario', e.target.value)}
                  className={`form-input ${errors.claveUsuario ? 'error' : ''}`}
                />
                {errors.claveUsuario && <span className="error-message">{errors.claveUsuario}</span>}
              </div>
            )}

            {/* Estado */}
            <div className="form-group">
              <label className="form-label checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.estaActivo}
                  onChange={(e) => handleChange('estaActivo', e.target.checked)}
                  className="form-checkbox"
                />
                Usuario Activo
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