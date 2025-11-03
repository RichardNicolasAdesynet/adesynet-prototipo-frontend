// src/context/AlertContext.tsx
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AlertType } from '../components/shared/alert/Alert';

export interface AlertState {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: number;
}

interface AlertContextType {
  alerts: AlertState[];
  showAlert: (type: AlertType, title: string, message: string, autoClose?: boolean) => void;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
   maxAlerts?: number; 
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children,  maxAlerts = 3 }) => {
  const [alerts, setAlerts] = useState<AlertState[]>([]);

  const showAlert = useCallback((
    type: AlertType, 
    title: string, 
    message: string,
    autoClose: boolean = true
  ) => {
    const newAlert: AlertState = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: Date.now()
    };

    console.log('🚨 ALERTA MOSTRADA:', { type, title, message }); // DEBUG

    setAlerts(prev =>{
      const updatedAlerts = [newAlert, ...prev];
      return updatedAlerts.slice(0, maxAlerts);
    });

    if (autoClose) {
      setTimeout(() => {
        removeAlert(newAlert.id);
      }, 5000);
    }
  }, [maxAlerts]);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const value: AlertContextType = {
    alerts,
    showAlert,
    removeAlert,
    clearAlerts
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert debe ser usado dentro de un AlertProvider');
  }
  return context;
};