import React, { useState, useEffect } from 'react';
import type { UserFormProps, UsuarioFormData } from '../../../../../types/admin.types';

interface UserFormState {
  cdUsuario: string;
  dsUsuario: string;
  nombre: string;
  apellidoP: string;
  apellidoM?: string;
  dni: string;
  email: string;
  cdRol: string;
  estaActivo: boolean; // Para el formulario interno
  claveUsuario?: string;
}

export const UserForm: React.FC<UserFormProps> = ({
  usuario,
  roles,
  isOpen,
  isEditing,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<UserFormState>({
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

  // ✅ CORREGIDO: Siempre retornar JSX válido
  if (!isOpen) {
    return null; // ✅ Retornar null explícitamente en lugar de no retornar nada
  }

  // Reset form when usuario prop changes
  useEffect(() => {
    if (usuario) {
      setFormData({
        cdUsuario: usuario.cdUsuario,
        dsUsuario: usuario.dsUsuario,
        nombre: usuario.nombreCompleto.split(' ')[0] || '', // Extraer nombre
        apellidoP: usuario.nombreCompleto.split(' ')[1] || '', // Extraer apellido
        apellidoM: '',
        dni: usuario.dni || '',
        email: usuario.email || '',
        cdRol: usuario.cdRol,
        estaActivo: usuario.estaActivoLaboralmente,
        claveUsuario: ''
      });
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

  // ✅ CORREGIR: Envío de datos para crear usuario
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (validateForm()) {
    // Mapear datos al formato que espera la API
    const datosParaAPI = {
      dsUsuario: formData.dsUsuario,
      claveUsuario: formData.claveUsuario,
      nombre: formData.nombre,
      apellidoP: formData.apellidoP,
      apellidoM: formData.apellidoM,
      dni: formData.dni,
      email: formData.email,
      cdRol: formData.cdRol,
      // Campos opcionales con valores por defecto
      estadoCivil: "",
      sexo: "",
      direcc: "",
      cdDepartamento: "",
      cdProvincia: "",
      cdDistrito: "",
      cdZona: "",
      telef1: "",
      telef2: "",
      cdArea: "",
      cdCargo: "",
      flgCambiarClave: true
    };
    
    onSubmit(datosParaAPI as any); // Convertir al tipo esperado
  }

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
        w-full max-w-4xl
        max-h-[90vh]
        overflow-hidden
        animate-scale-in
      ">
        {/* Header del Modal */}
        <div className="
          bg-linear-to-r from-cyan-500 to-blue-600
          px-6 py-4
          flex items-center justify-between
        ">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Editar Usuario' : 'Crear Usuario'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Código de Usuario */}
            <div className="space-y-2">
              <label htmlFor="cdUsuario" className="
                block text-sm font-medium text-slate-700
              ">
                Código de Usuario *
              </label>
              <input
                id="cdUsuario"
                type="text"
                value={formData.cdUsuario}
                onChange={(e) => handleChange('cdUsuario', e.target.value.toUpperCase())}
                className={`
                  w-full px-4 py-3
                  border rounded-xl
                  focus:outline-none focus:ring-2 transition-all duration-200
                  ${errors.cdUsuario
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50'
                    : 'border-slate-300 focus:ring-cyan-500 focus:border-transparent'
                  }
                `}
                maxLength={5}
                disabled={isEditing}
                placeholder="USR01"
              />
              {errors.cdUsuario && (
                <p className="text-rose-600 text-sm flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.cdUsuario}</span>
                </p>
              )}
            </div>

            {/* Descripción del Usuario */}
            <div className="space-y-2">
              <label htmlFor="dsUsuario" className="
                block text-sm font-medium text-slate-700
              ">
                Descripción del Usuario *
              </label>
              <input
                id="dsUsuario"
                type="text"
                value={formData.dsUsuario}
                onChange={(e) => handleChange('dsUsuario', e.target.value)}
                className={`
                  w-full px-4 py-3
                  border rounded-xl
                  focus:outline-none focus:ring-2 transition-all duration-200
                  ${errors.dsUsuario
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50'
                    : 'border-slate-300 focus:ring-cyan-500 focus:border-transparent'
                  }
                `}
                placeholder="Descripción del usuario"
              />
              {errors.dsUsuario && (
                <p className="text-rose-600 text-sm flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.dsUsuario}</span>
                </p>
              )}
            </div>

            {/* Nombre */}
            <div className="space-y-2">
              <label htmlFor="nombre" className="
                block text-sm font-medium text-slate-700
              ">
                Nombre *
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
                    : 'border-slate-300 focus:ring-cyan-500 focus:border-transparent'
                  }
                `}
                placeholder="Nombre del usuario"
              />
              {errors.nombre && (
                <p className="text-rose-600 text-sm flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.nombre}</span>
                </p>
              )}
            </div>

            {/* Apellido Paterno */}
            <div className="space-y-2">
              <label htmlFor="apellidoP" className="
                block text-sm font-medium text-slate-700
              ">
                Apellido Paterno *
              </label>
              <input
                id="apellidoP"
                type="text"
                value={formData.apellidoP}
                onChange={(e) => handleChange('apellidoP', e.target.value)}
                className={`
                  w-full px-4 py-3
                  border rounded-xl
                  focus:outline-none focus:ring-2 transition-all duration-200
                  ${errors.apellidoP
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50'
                    : 'border-slate-300 focus:ring-cyan-500 focus:border-transparent'
                  }
                `}
                placeholder="Apellido paterno"
              />
              {errors.apellidoP && (
                <p className="text-rose-600 text-sm flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.apellidoP}</span>
                </p>
              )}
            </div>

            {/* Apellido Materno */}
            <div className="space-y-2">
              <label htmlFor="apellidoM" className="
                block text-sm font-medium text-slate-700
              ">
                Apellido Materno
              </label>
              <input
                id="apellidoM"
                type="text"
                value={formData.apellidoM}
                onChange={(e) => handleChange('apellidoM', e.target.value)}
                className="
                  w-full px-4 py-3
                  border border-slate-300 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                  transition-all duration-200
                "
                placeholder="Apellido materno (opcional)"
              />
            </div>

            {/* DNI */}
            <div className="space-y-2">
              <label htmlFor="dni" className="
                block text-sm font-medium text-slate-700
              ">
                DNI *
              </label>
              <input
                id="dni"
                type="text"
                value={formData.dni}
                onChange={(e) => handleChange('dni', e.target.value.replace(/\D/g, ''))}
                className={`
                  w-full px-4 py-3
                  border rounded-xl
                  focus:outline-none focus:ring-2 transition-all duration-200
                  ${errors.dni
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50'
                    : 'border-slate-300 focus:ring-cyan-500 focus:border-transparent'
                  }
                `}
                maxLength={8}
                placeholder="12345678"
              />
              {errors.dni && (
                <p className="text-rose-600 text-sm flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.dni}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="
                block text-sm font-medium text-slate-700
              ">
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`
                  w-full px-4 py-3
                  border rounded-xl
                  focus:outline-none focus:ring-2 transition-all duration-200
                  ${errors.email
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50'
                    : 'border-slate-300 focus:ring-cyan-500 focus:border-transparent'
                  }
                `}
                placeholder="usuario@empresa.com"
              />
              {errors.email && (
                <p className="text-rose-600 text-sm flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Rol */}
            <div className="space-y-2">
              <label htmlFor="cdRol" className="
                block text-sm font-medium text-slate-700
              ">
                Rol *
              </label>
              <select
                id="cdRol"
                value={formData.cdRol}
                onChange={(e) => handleChange('cdRol', e.target.value)}
                className="
                  w-full px-4 py-3
                  border border-slate-300 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                  transition-all duration-200
                  bg-white
                  cursor-pointer
                "
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
              <div className="space-y-2">
                <label htmlFor="claveUsuario" className="
                  block text-sm font-medium text-slate-700
                ">
                  Contraseña *
                </label>
                <input
                  id="claveUsuario"
                  type="password"
                  value={formData.claveUsuario}
                  onChange={(e) => handleChange('claveUsuario', e.target.value)}
                  className={`
                    w-full px-4 py-3
                    border rounded-xl
                    focus:outline-none focus:ring-2 transition-all duration-200
                    ${errors.claveUsuario
                      ? 'border-rose-300 focus:ring-rose-500 bg-rose-50'
                      : 'border-slate-300 focus:ring-cyan-500 focus:border-transparent'
                    }
                  `}
                  placeholder="Ingrese la contraseña"
                />
                {errors.claveUsuario && (
                  <p className="text-rose-600 text-sm flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.claveUsuario}</span>
                  </p>
                )}
              </div>
            )}

            {/* Estado */}
            <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="estaActivo"
                checked={formData.estaActivo}
                onChange={(e) => handleChange('estaActivo', e.target.checked)}
                className="
                  w-5 h-5
                  text-cyan-600
                  border-slate-300 rounded
                  focus:ring-cyan-500
                  focus:ring-2
                "
              />
              <label htmlFor="estaActivo" className="text-sm font-medium text-slate-700 cursor-pointer">
                Usuario Activo
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
                bg-linear-to-r from-cyan-500 to-blue-600
                hover:from-cyan-600 hover:to-blue-700
                disabled:from-cyan-400 disabled:to-blue-500
                text-white font-medium
                rounded-xl
                shadow-lg shadow-cyan-500/25
                hover:shadow-xl hover:shadow-cyan-500/35
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
                <span>{isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  }
};