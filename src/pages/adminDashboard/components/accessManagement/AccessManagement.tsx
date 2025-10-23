import React, { useState } from 'react';
import type { AccessManagementProps } from '../../../../types/admin.types';
import { AccessManagementTable } from './AccessManagementTable';
import { RoleDetailsModal } from './roleDetailsModal';
import { ExportButton } from '../../../../components/shared/exportButton';

export const AccessManagement: React.FC<AccessManagementProps> = ({
  roles,
  modulos,
  accesos,
  onPermisoChange,
  onModuloHabilitadoChange,
  onBulkPermissionChange,
  loading = false
}) => {
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  const handleExport = async (formato: 'excel' | 'pdf') => {
    setExportLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Exportando matriz de accesos a ${formato}`);
    setExportLoading(false);
  };

  const handleRoleClick = (rol: any) => {
    const accesosDelRol = accesos.filter(acceso => acceso.cdRol === rol.cdRol);
    setSelectedRole({
      ...rol,
      accesos: accesosDelRol
    });
    setIsDetailsModalOpen(true);
  };

  const handleBulkPermissions = () => {
    console.log('Abriendo modal para asignación masiva de permisos');
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedRole(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Principal */}
      <div className="
        flex flex-col sm:flex-row
        items-start sm:items-center
        justify-between
        gap-4
        p-6
        bg-gradient-to-r from-indigo-50/50 to-blue-50/30
        rounded-2xl
        border border-indigo-200/40
      ">
        <div className="flex-1 min-w-0">
          <h2 className="
            text-2xl sm:text-3xl
            font-bold
            bg-gradient-to-r from-indigo-700 to-blue-700
            bg-clip-text text-transparent
          ">
            Gestión de Accesos
          </h2>
          <p className="text-slate-600 mt-1">
            Vista agrupada por roles - Haz click en cualquier rol para gestionar sus permisos
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleBulkPermissions}
            className="
              px-6 py-3
              bg-gradient-to-r from-indigo-500 to-purple-600
              hover:from-indigo-600 hover:to-purple-700
              text-white font-medium
              rounded-xl
              shadow-lg shadow-indigo-500/25
              hover:shadow-xl hover:shadow-indigo-500/35
              transition-all duration-300
              transform hover:scale-105
              flex items-center space-x-2
              whitespace-nowrap
            "
            type="button"
          >
            <span className="text-lg">🎯</span>
            <span>Asignación Masiva</span>
          </button>
          
          <ExportButton 
            onExport={handleExport}
            loading={exportLoading}
          />
        </div>
      </div>

      {/* Estadísticas Resumen */}
      <div className="
        grid grid-cols-1 md:grid-cols-3
        gap-4
        p-6
        bg-white/80 backdrop-blur-sm
        border border-slate-200/60
        rounded-2xl
        shadow-lg
      ">
        <div className="text-center">
          <div className="
            w-12 h-12
            bg-indigo-100
            rounded-xl
            flex items-center justify-center
            mx-auto mb-3
          ">
            <span className="text-2xl text-indigo-600">🎭</span>
          </div>
          <div className="text-2xl font-bold text-indigo-700">{roles.length}</div>
          <div className="text-sm text-slate-600">Roles Activos</div>
        </div>
        
        <div className="text-center">
          <div className="
            w-12 h-12
            bg-emerald-100
            rounded-xl
            flex items-center justify-center
            mx-auto mb-3
          ">
            <span className="text-2xl text-emerald-600">📦</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700">{modulos.length}</div>
          <div className="text-sm text-slate-600">Módulos Disponibles</div>
        </div>
        
        <div className="text-center">
          <div className="
            w-12 h-12
            bg-cyan-100
            rounded-xl
            flex items-center justify-center
            mx-auto mb-3
          ">
            <span className="text-2xl text-cyan-600">🔐</span>
          </div>
          <div className="text-2xl font-bold text-cyan-700">
            {accesos.filter(a => a.moduloHabilitado).length}
          </div>
          <div className="text-sm text-slate-600">Accesos Habilitados</div>
        </div>
      </div>

      {/* Tabla de Gestión de Accesos */}
      <AccessManagementTable
        roles={roles}
        accesos={accesos}
        modulos={modulos}
        onRoleClick={handleRoleClick}
        loading={loading}
      />

      {/* Modal de Detalles del Rol */}
      <RoleDetailsModal
        role={selectedRole}
        isOpen={isDetailsModalOpen}
        modulos={modulos}
        onPermisoChange={onPermisoChange}
        onModuloHabilitadoChange={onModuloHabilitadoChange}
        onClose={closeDetailsModal}
      />

      {/* Instrucciones y Notas */}
      <div className="
        p-6
        bg-slate-50/80
        border border-slate-200/60
        rounded-2xl
        text-sm text-slate-700
      ">
        <h4 className="
          font-semibold text-slate-800
          mb-3
          flex items-center space-x-2
        ">
          <span>💡</span>
          <span>Instrucciones de Uso</span>
        </h4>
        <ul className="space-y-2">
          <li className="flex items-start space-x-3">
            <span className="text-indigo-600 mt-0.5">🎭</span>
            <div>
              <strong>Haz click en cualquier rol</strong> para gestionar sus permisos detallados
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-emerald-600 mt-0.5">📦</span>
            <div>
              <strong>Módulos mostrados:</strong> Se muestran hasta 3 módulos principales por rol
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-cyan-600 mt-0.5">👥</span>
            <div>
              <strong>Usuarios:</strong> Cantidad de usuarios asignados a cada rol
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-purple-600 mt-0.5">✅</span>
            <div>
              <strong>Accesos:</strong> Módulos habilitados vs módulos disponibles
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};