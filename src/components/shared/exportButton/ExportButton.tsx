import React, { useState } from 'react';
import type { ExportButtonProps } from '../../../types/admin.types';

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  loading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (formato: 'excel' | 'pdf') => {
    onExport(formato);
    setIsOpen(false);
  };

  return (
    <div className="export-button-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="export-button"
        type="button"
      >
        {loading ? 'Exportando...' : 'Exportar'}
      </button>
      
      {isOpen && (
        <div className="export-dropdown">
          <button
            onClick={() => handleExport('excel')}
            className="export-option"
            type="button"
          >
            📊 Excel
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="export-option"
            type="button"
          >
            📄 PDF
          </button>
        </div>
      )}
    </div>
  );
};