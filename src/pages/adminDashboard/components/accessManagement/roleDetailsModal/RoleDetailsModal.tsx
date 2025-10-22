import React, { useState, useEffect } from 'react';
import { permisosConfig, tiposPermisoDisponibles } from '../../../../../data/accessManagementData';
import type { TipoPermiso } from '../../../../../types/admin.types';

export interface RoleDetailsModalProps {
  role: any;
  isOpen: boolean;
  modulos: any[];
  onPermisoChange: (cdRol: string, cdModulo: string, tipoPermiso: TipoPermiso, asignado: boolean) => void;
  onModuloHabilitadoChange: (cdRol: string, cdModulo: string, habilitado: boolean) => void;
  onClose: () => void;
}

export const RoleDetailsModal: React.FC<RoleDetailsModalProps> = ({
  role,
  isOpen,
  modulos,
  onPermisoChange,
  onModuloHabilitadoChange,
  onClose
}) => {
  const [cambiosPendientes, setCambiosPendientes] = useState(false);
  const [accesosLocales, setAccesosLocales] = useState<any[]>([]);

  // Inicializar accesos locales cuando se abre el modal
  useEffect(() => {
    if (isOpen && role) {
      // Crear una copia local de los accesos para editar
      const accesosIniciales = modulos.map(modulo => {
        const accesoExistente = role.accesos?.find((a: any) => a.cdModulo === modulo.cdModulo);
        
        if (accesoExistente) {
          return { ...accesoExistente };
        }
        
        // Crear acceso nuevo si no existe
        return {
          cdRol: role.cdRol,
          cdModulo: modulo.cdModulo,
          moduloNombre: modulo.dsModulo,
          moduloHabilitado: false,
          permisos: []
        };
      });
      
      setAccesosLocales(accesosIniciales);
      setCambiosPendientes(false);
    }
  }, [isOpen, role, modulos]);

  // Verificar si un módulo tiene un permiso específico
  const tienePermiso = (cdModulo: string, tipoPermiso: TipoPermiso) => {
    const acceso = accesosLocales.find(a => a.cdModulo === cdModulo);
    return acceso?.permisos?.some((permiso: any) => permiso.tipoPermiso === tipoPermiso) || false;
  };

  // Verificar si un módulo está habilitado
  const moduloEstaHabilitado = (cdModulo: string) => {
    const acceso = accesosLocales.find(a => a.cdModulo === cdModulo);
    return acceso?.moduloHabilitado || false;
  };

  const handlePermisoToggle = (cdModulo: string, tipoPermiso: TipoPermiso) => {
    const nuevosAccesos = [...accesosLocales];
    const accesoIndex = nuevosAccesos.findIndex(a => a.cdModulo === cdModulo);
    
    if (accesoIndex !== -1) {
      const acceso = { ...nuevosAccesos[accesoIndex] };
      const tieneElPermiso = acceso.permisos?.some((p: any) => p.tipoPermiso === tipoPermiso);
      
      if (tieneElPermiso) {
        // Remover permiso
        acceso.permisos = acceso.permisos.filter((p: any) => p.tipoPermiso !== tipoPermiso);
      } else {
        // Agregar permiso - CORREGIDO EL ERROR
        if (!acceso.permisos) acceso.permisos = [];
        acceso.permisos.push({
          id: Date.now(), // ID temporal
          tipoPermiso: tipoPermiso,
          descripcionPermiso: permisosConfig[tipoPermiso].descripcion, // ✅ Ahora es type-safe
          fecAsignacion: new Date().toISOString()
        });
      }
      
      nuevosAccesos[accesoIndex] = acceso;
      setAccesosLocales(nuevosAccesos);
      setCambiosPendientes(true);
      
      // Llamar a la función padre
      onPermisoChange(role.cdRol, cdModulo, tipoPermiso, !tieneElPermiso);
    }
  };

  const handleModuloToggle = (cdModulo: string) => {
    const nuevosAccesos = [...accesosLocales];
    const accesoIndex = nuevosAccesos.findIndex(a => a.cdModulo === cdModulo);
    
    if (accesoIndex !== -1) {
      const acceso = { ...nuevosAccesos[accesoIndex] };
      const nuevoEstado = !acceso.moduloHabilitado;
      
      acceso.moduloHabilitado = nuevoEstado;
      
      // Si se deshabilita el módulo, quitar todos los permisos
      if (!nuevoEstado) {
        acceso.permisos = [];
      }
      
      nuevosAccesos[accesoIndex] = acceso;
      setAccesosLocales(nuevosAccesos);
      setCambiosPendientes(true);
      
      // Llamar a la función padre
      onModuloHabilitadoChange(role.cdRol, cdModulo, nuevoEstado);
    }
  };

  const handleSave = () => {
    console.log('Guardando cambios para el rol:', role.cdRol, accesosLocales);
    setCambiosPendientes(false);
    onClose();
  };

  const handleClose = () => {
    if (cambiosPendientes) {
      const confirmar = window.confirm('Tienes cambios sin guardar. ¿Seguro que quieres cerrar?');
      if (confirmar) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Función helper para contar usuarios
  const contarUsuariosDelRol = (cdRol: string) => {
    const usuariosPorRol: Record<string, number> = {
      'ROL01': 3,
      'ROL02': 1,
      'ROL03': 2,
      'ROL04': 4,
      'ROL05': 8
    };
    return usuariosPorRol[cdRol] || 0;
  };

  if (!isOpen || !role) return null;

  return (
    <div className="modal-overlay">
      <div className="role-details-modal">
        <div className="modal-header">
          <div className="modal-title">
            <h2>🎭 {role.nombre}</h2>
            <div className="role-subtitle">
              <span className="role-code">{role.cdRol}</span>
              <span className="users-count">👥 {contarUsuariosDelRol(role.cdRol)} usuarios</span>
            </div>
          </div>
          <button onClick={handleClose} className="close-button" type="button">
            ×
          </button>
        </div>

        <div className="modal-content">
          <div className="modules-section">
            <h3>📦 Módulos y Permisos</h3>
            <div className="modules-list">
              {modulos.map(modulo => {
                const habilitado = moduloEstaHabilitado(modulo.cdModulo);
                const acceso = accesosLocales.find(a => a.cdModulo === modulo.cdModulo);
                
                return (
                  <div key={modulo.cdModulo} className="module-item">
                    <div className="module-header">
                      <label className="module-toggle">
                        <input
                          type="checkbox"
                          checked={habilitado}
                          onChange={() => handleModuloToggle(modulo.cdModulo)}
                          className="toggle-input"
                        />
                        <span className={`toggle-slider ${habilitado ? 'active' : ''}`}>
                          {habilitado ? '✅' : '❌'}
                        </span>
                      </label>
                      <div className="module-info">
                        <div className="module-name">{modulo.dsModulo}</div>
                        <div className="module-code">{modulo.cdModulo}</div>
                      </div>
                      <span className={`module-status ${habilitado ? 'enabled' : 'disabled'}`}>
                        {habilitado ? 'Habilitado' : 'Deshabilitado'}
                      </span>
                    </div>
                    
                    {habilitado && (
                      <div className="permissions-grid">
                        {tiposPermisoDisponibles.map(tipoPermiso => {
                          const tieneElPermiso = tienePermiso(modulo.cdModulo, tipoPermiso);
                          
                          return (
                            <label key={tipoPermiso} className="permission-item">
                              <input
                                type="checkbox"
                                checked={tieneElPermiso}
                                onChange={() => handlePermisoToggle(modulo.cdModulo, tipoPermiso)}
                                className="permission-checkbox"
                              />
                              <span className={`permission-toggle ${tieneElPermiso ? 'active' : ''}`}>
                                <span className="permission-icon">
                                  {permisosConfig[tipoPermiso].icono}
                                </span>
                                <span className="permission-name">
                                  {permisosConfig[tipoPermiso].nombre}
                                </span>
                                <span className="permission-status">
                                  {tieneElPermiso ? '✓' : '✗'}
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-notes">
            {cambiosPendientes && (
              <span className="changes-warning">⚠️ Tienes cambios sin guardar</span>
            )}
          </div>
          <div className="footer-actions">
            <button
              onClick={handleClose}
              className="cancel-button"
              type="button"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="save-button"
              disabled={!cambiosPendientes}
              type="button"
            >
              💾 Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};