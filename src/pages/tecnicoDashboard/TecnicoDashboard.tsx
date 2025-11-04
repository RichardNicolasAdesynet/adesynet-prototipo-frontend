import React from 'react';
import { useAuth } from '../../hooks/auth/useAuth';
import { BaseLayout } from '../layout/BaseLayout';

export const TecnicoDashboard: React.FC = () => {
  const { usuario, logout } = useAuth();

  // ✅ CORREGIDO: Verificar que usuario existe
  if (!usuario) {
    return <div>Error: No se encontró información del usuario</div>;
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <BaseLayout usuario={usuario} onLogout={logout}>
        <div className="tecnico-dashboard">
          <header className="dashboard-header">
            <h1>Dashboard Técnico</h1>
            <div className="user-info">
              <span>Bienvenido, {usuario.nombre}</span>
              <span className="user-role">{usuario.rol}</span>
            </div>
          </header>

          <main className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Incidencias Activas</h3>
                <p className="stat-value">12</p>
              </div>
              <div className="stat-card">
                <h3>En Progreso</h3>
                <p className="stat-value">5</p>
              </div>
              <div className="stat-card">
                <h3>Completadas</h3>
                <p className="stat-value">23</p>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Actividad Reciente</h2>
              <p>Aquí irá el contenido específico para técnicos...</p>
            </div>
          </main>
        </div>
      </BaseLayout>
    </div>
  );
};