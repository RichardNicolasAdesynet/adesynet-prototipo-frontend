import React from 'react';

export interface UserAvatarProps {
  nombre: string;
  email?: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  nombre,
  email,
  avatarUrl,
  size = 'md'
}) => {
  const getIniciales = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div className="user-avatar-container">
      <div className="avatar-wrapper">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={nombre}
            className={`avatar-image ${sizeClasses[size]}`}
          />
        ) : (
          <div className={`avatar-fallback ${sizeClasses[size]}`}>
            {getIniciales(nombre)}
          </div>
        )}
      </div>
      <div className="user-info">
        <div className="user-name">{nombre}</div>
        {email && <div className="user-email">{email}</div>}
      </div>
    </div>
  );
};