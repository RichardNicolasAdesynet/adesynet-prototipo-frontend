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
    // Obtener todos los accesos para este rol
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
    <div className="access-management">
      <div className="section-header">
        <h2 className="section-title">Gestión de Accesos</h2>
        <p className="section-description">
          Vista agrupada por roles - Haz click en cualquier rol para gestionar sus permisos
        </p>
        <div className="header-actions">
          <button
            onClick={handleBulkPermissions}
            className="bulk-permissions-button"
            type="button"
          >
            🎯 Asignación Masiva
          </button>
          <ExportButton 
            onExport={handleExport}
            loading={exportLoading}
          />
        </div>
      </div>

      <div className="access-summary">
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-value">{roles.length}</span>
            <span className="stat-label">Roles Activos</span>
          </div>
          <div className="stat">
            <span className="stat-value">{modulos.length}</span>
            <span className="stat-label">Módulos Disponibles</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {accesos.filter(a => a.moduloHabilitado).length}
            </span>
            <span className="stat-label">Accesos Habilitados</span>
          </div>
        </div>
      </div>

      <AccessManagementTable
        roles={roles}
        accesos={accesos}
        modulos={modulos}
        onRoleClick={handleRoleClick}
        loading={loading}
      />

      <RoleDetailsModal
        role={selectedRole}
        isOpen={isDetailsModalOpen}
        modulos={modulos}
        onPermisoChange={onPermisoChange}
        onModuloHabilitadoChange={onModuloHabilitadoChange}
        onClose={closeDetailsModal}
      />

      <div className="access-notes">
        <h4>Instrucciones:</h4>
        <ul>
          <li>🎭 <strong>Haz click en cualquier rol</strong> para gestionar sus permisos detallados</li>
          <li>📦 <strong>Módulos mostrados:</strong> Se muestran hasta 3 módulos principales</li>
          <li>👥 <strong>Usuarios:</strong> Cantidad de usuarios asignados a cada rol</li>
          <li>✅ <strong>Accesos:</strong> Módulos habilitados vs módulos disponibles</li>
        </ul>
      </div>
    </div>
  );
};