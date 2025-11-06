// src/components/auth/AuthUpdater.tsx
import { useActualizacionAutomatica } from '../../hooks/useActualizacionAutomatica';
import { useActualizacionCritica } from '../../hooks/useActualizacionCritica';

export const AuthUpdater: React.FC = () => {
  useActualizacionAutomatica();
  useActualizacionCritica();
  
  return null; // Este componente no renderiza nada, solo ejecuta los hooks
};