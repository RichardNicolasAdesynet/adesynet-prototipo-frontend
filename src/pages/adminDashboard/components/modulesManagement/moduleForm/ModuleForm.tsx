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
          bg-gradient-to-r from-emerald-500 to-green-600
          px-6 py-4
          flex items-center justify-between
        ">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Editar Módulo' : 'Crear Módulo'}
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
            {/* Código de Módulo */}
            {isEditing && (
              <div className="space-y-2">
                <label className="
                block text-sm font-medium text-slate-700
                ">
                  Código de Módulo
                </label>
                <div className="w-full px-4 py-3 
                bg-slate-50 border border-slate-300 rounded-xl
                text-slate-700 font-mono
                ">
                  {formData.cdModulo}
                </div>
                <p className="text-slate-500 text-sm">
                  Identificador único del módulo
                </p>
                {errors.cdModulo && (
                  <p className="text-rose-600 text-sm flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.cdModulo}</span>
                  </p>
                )}
              </div>
            )}

            {/* Descripción del Módulo */}
            <div className="space-y-2">
              <label htmlFor="dsModulo" className="
                block text-sm font-medium text-slate-700
              ">
                Descripción del Módulo *
              </label>
              <input
                id="dsModulo"
                type="text"
                value={formData.dsModulo}
                onChange={(e) => handleChange('dsModulo', e.target.value)}
                className={`
                  w-full px-4 py-3
                  border rounded-xl
                  focus:outline-none focus:ring-2 transition-all duration-200
                  ${errors.dsModulo
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50'
                    : `border-slate-300 focus:ring-emerald-500 focus:border-transparent
                        ${formData.dsModulo ? 'text-slate-900 bg-white' : 'text-slate-500 bg-slate-50'}`

                  }
                `}
                placeholder="ejm. Sistema de Seguridad"
              />
              {errors.dsModulo && (
                <p className="text-rose-600 text-sm flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.dsModulo}</span>
                </p>
              )}
            </div>

            {/* Permite Edición */}
            <div className="
              flex items-start space-x-3 
              p-4 bg-slate-50 rounded-xl border border-slate-200
            ">
              <input
                type="checkbox"
                id="flgEdicion"
                checked={formData.flgEdicion}
                onChange={(e) => handleChange('flgEdicion', e.target.checked)}
                className="
                  w-5 h-5 mt-1
                  text-emerald-600
                  border-slate-300 rounded
                  focus:ring-emerald-500
                  focus:ring-2
                "
              />
              <div className="flex-1">
                <label htmlFor="flgEdicion" className="
                  block text-sm font-medium text-slate-700 cursor-pointer
                ">
                  Permite Edición
                </label>
                <p className="text-slate-500 text-sm mt-1">
                  Si está desactivado, el módulo será de solo lectura para todos los usuarios
                </p>
              </div>
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
                flex items-center space-x-2
              "
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <span>{isEditing ? 'Actualizar Módulo' : 'Crear Módulo'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};