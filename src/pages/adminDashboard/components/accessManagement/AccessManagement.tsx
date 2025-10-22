import React, { useState } from 'react';
import type { AccessManagementProps } from '../../../../types/admin.types';
import { MatrizAccesos } from './matrizAccesos';
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

  const handleExport = async (formato: 'excel' | 'pdf') => {
    setExportLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Exportando matriz de accesos a ${formato}`);
    setExportLoading(false);
  };

  const handleBulkPermissions = () => {
    // Aquí podrías abrir un modal para asignación masiva
    console.log('Abriendo modal para asignación masiva de permisos');
  };

  return (
    <div className="access-management">
      <div className="section-header">
        <h2 className="section-title">Gestión de Accesos</h2>
        <p className="section-description">
          Matriz de permisos: Asigna permisos específicos a cada rol por módulo
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
            <span className="stat-label">Roles</span>
          </div>
          <div className="stat">
            <span className="stat-value">{modulos.length}</span>
            <span className="stat-label">Módulos</span>
          </div>
          <div className="stat">
            <span className="stat-value">{accesos.length}</span>
            <span className="stat-label">Accesos Configurados</span>
          </div>
        </div>
      </div>

      <MatrizAccesos
        roles={roles}
        modulos={modulos}
        accesos={accesos}
        onPermisoChange={onPermisoChange}
        onModuloHabilitadoChange={onModuloHabilitadoChange}
        loading={loading}
      />

      <div className="access-notes">
        <h4>Notas:</h4>
        <ul>
          <li>✅ <strong>Habilitado:</strong> El rol tiene acceso al módulo</li>
          <li>❌ <strong>No Habilitado:</strong> El rol no tiene acceso al módulo</li>
          <li>👁️ <strong>Consultar:</strong> Solo puede ver información</li>
          <li>➕ <strong>Ingresar:</strong> Puede crear nuevos registros</li>
          <li>✏️ <strong>Modificar:</strong> Puede editar registros existentes</li>
          <li>🗑️ <strong>Eliminar:</strong> Puede eliminar registros</li>
          <li>⚡ <strong>Control Total:</strong> Todos los permisos anteriores</li>
        </ul>
      </div>
    </div>
  );
};