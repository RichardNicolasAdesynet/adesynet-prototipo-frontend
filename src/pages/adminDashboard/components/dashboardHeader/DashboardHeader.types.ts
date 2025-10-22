import type { DashboardStats } from '../../../../types/admin.types';

export interface DashboardHeaderProps {
  stats: DashboardStats;
  onRefresh?: () => void;
}