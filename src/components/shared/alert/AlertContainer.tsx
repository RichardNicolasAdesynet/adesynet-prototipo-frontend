// src/components/shared/Alert/AlertContainer.tsx
import React from 'react';
import { Alert } from './Alert';
import { useAlert } from '../../../context/AlertContext';

export const AlertContainer: React.FC = () => {
  const { alerts, removeAlert } = useAlert();

  console.log('🔔 AlertContainer - Alertas actuales:', alerts.length); // DEBUG

  if (alerts.length === 0) return null;

  return (
    <div className="alert-container" style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 10000,
      maxWidth: '400px'
    }}>
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => removeAlert(alert.id)}
          autoClose={true}
        />
      ))}
    </div>
  );
};