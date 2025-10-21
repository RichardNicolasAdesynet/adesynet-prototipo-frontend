import React from 'react';
import type { LoginHeaderProps } from './Login.types';

export const LoginHeader: React.FC<LoginHeaderProps> = ({ 
    titulo, 
    subtitulo 
}) => {
    return (
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
                {titulo}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
                {subtitulo}
            </p>
        </div>
    );
};