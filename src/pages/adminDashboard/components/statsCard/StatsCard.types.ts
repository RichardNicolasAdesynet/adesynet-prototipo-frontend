// src/pages/adminDashboard/components/statsCard/StatsCard.types.ts
export interface StatsCardProps {
  titulo: string;
  valor: number | string;
  subtitulo?: string;
  variacion?: number;
  icono?: string;
  tipo?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}