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

  // ✅ CORREGIDO: Retornar null explícitamente
  if (!isOpen) {
    return null;
  }

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
    <div className="
      fixed inset-0
      bg-black/50
      backdrop-blur-sm
      flex items-center justify-center
      p-4
      z-50
      animate-fade-in
    ">
      <div className="
        bg-white
        rounded-2xl
        shadow-2xl
        w-full max-w-2xl
        max-h-[90vh]
        overflow-hidden
        animate-scale-in
      ">
        {/* Header del Modal */}
        <div className="
          bg-linear-to-r from-purple-500 to-indigo-600
          px-6 py-4
          flex items-center justify-between
        ">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Editar Rol' : 'Crear Rol'}
          </h2>
          <button
            onClick={onCancel}
            className="
              w-8 h-8
              flex items-center justify-center
              text-white/80 hover:text-white
              hover:bg-white/10
              rounded-lg
              transition-all duration-200
            "
            type="button"
          >
            ×
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-6">
            {/* Código de Rol */}
            <div className="space-y-2">
              <label htmlFor="cdRol" className="
                block text-sm font-medium text-slate-700
              ">
                Código de Rol *
              </label>
              <input
                id="cdRol"
                type="text"
                value={formData.cdRol}
                onChange={(e) => handleChange('cdRol', e.target.value.toUpperCase())}
                className={`
                  w-full px-4 py-3
                  border rounded-xl
                  focus:outline-none focus:ring-2 transition-all duration-200
                  ${errors.cdRol
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50'
                    : 'border-slate-300 focus:ring-purple-500 focus:border-transparent'
                  }
                `}
                maxLength={5}
                disabled={isEditing}
                placeholder="ROL01"
              />
              {errors.cdRol && (
                <p className="text-rose-600 text-sm flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.cdRol}</span>
                </p>
              )}
              <p className="text-slate-500 text-sm">
                5 caracteres (ej: ROL01)
              </p>
            </div>

            {/* Nombre del Rol */}
            <div className="space-y-2">
              <label htmlFor="nombre" className="
                block text-sm font-medium text-slate-700
              ">
                Nombre del Rol *
              </label>
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className={`
                  w-full px-4 py-3
                  border rounded-xl
                  focus:outline-none focus:ring-2 transition-all duration-200
                  ${errors.nombre
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50'
                    : 'border-slate-300 focus:ring-purple-500 focus:border-transparent'
                  }
                `}
                placeholder="Administrador del Sistema"
              />
              {errors.nombre && (
                <p className="text-rose-600 text-sm flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.nombre}</span>
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label htmlFor="descripcion" className="
                block text-sm font-medium text-slate-700
              ">
                Descripción *
              </label>
              <textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                className={`
                  w-full px-4 py-3
                  border rounded-xl
                  focus:outline-none focus:ring-2 transition-all duration-200
                  resize-none
                  ${errors.descripcion
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50'
                    : 'border-slate-300 focus:ring-purple-500 focus:border-transparent'
                  }
                `}
                rows={4}
                placeholder="Describe las responsabilidades y permisos de este rol..."
              />
              {errors.descripcion && (
                <p className="text-rose-600 text-sm flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.descripcion}</span>
                </p>
              )}
            </div>

            {/* Estado */}
            <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="activo"
                checked={formData.activo}
                onChange={(e) => handleChange('activo', e.target.checked)}
                className="
                  w-5 h-5
                  text-purple-600
                  border-slate-300 rounded
                  focus:ring-purple-500
                  focus:ring-2
                "
              />
              <label htmlFor="activo" className="text-sm font-medium text-slate-700 cursor-pointer">
                Rol Activo
              </label>
            </div>
          </div>

          {/* Acciones del Formulario */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="
                px-6 py-3
                border border-slate-300
                text-slate-700
                rounded-xl
                font-medium
                hover:bg-slate-50
                hover:border-slate-400
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
              "
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="
                px-6 py-3
                bg-linear-to-r from-purple-500 to-indigo-600
                hover:from-purple-600 hover:to-indigo-700
                disabled:from-purple-400 disabled:to-indigo-500
                text-white font-medium
                rounded-xl
                shadow-lg shadow-purple-500/25
                hover:shadow-xl hover:shadow-purple-500/35
                disabled:shadow-none
                transition-all duration-300
                transform hover:scale-105 disabled:scale-100
                flex items-center space-x-2
              "
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <span>{isEditing ? 'Actualizar Rol' : 'Crear Rol'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};