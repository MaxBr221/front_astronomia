import React from 'react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { user, isBackendConnected } = useApp();

  return (
    <header className="main-header" id="platform-header">
      <div className="brand-section">
        <div className="brand-emblem">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
            <circle cx="50" cy="50" r="16" fill="#f59e0b" opacity="0.4" />
            <path d="M 50 15 A 35 35 0 0 1 85 50 A 35 35 0 0 1 50 85 A 35 35 0 0 1 15 50 A 35 35 0 0 1 50 15" strokeDasharray="8 6" />
            <path d="M 50 30 A 20 20 0 0 1 70 50 A 20 20 0 0 1 50 70 A 20 20 0 0 1 30 50 A 20 20 0 0 1 50 30" stroke="#fbbf24" strokeWidth="3" />
            <circle cx="50" cy="50" r="6" fill="#ffffff" />
          </svg>
        </div>
        <div className="brand-text">
          <h1>TRILHA CELESTE POTIGUARA</h1>
          <p>Cosmovisão Ancestral & Guia Stellarium</p>
        </div>
      </div>

      {/* Barra de Progresso Ancestral e Ciclos Lunares */}
      <div className="header-center-info">
        <div className="lunar-phase-badge">
          <span>🌙 {user.lunarCycle}</span>
          <span id="header-progress-pct">{user.progressPercentage}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            id="header-progress-bar"
            style={{ width: `${user.progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Perfil do Usuário e Status da Aldeia */}
      <div className="header-user-section">
        <div
          title={isBackendConnected ? 'Conectado à Trilha Celeste Ancestral' : 'Modo de Exploração Offline'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.7rem',
            fontWeight: 600,
            background: isBackendConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${isBackendConnected ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
            color: isBackendConnected ? '#34d399' : '#fbbf24'
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: isBackendConnected ? '#10b981' : '#f59e0b'
            }}
          />
          {isBackendConnected ? 'Aldeia Conectada' : 'Modo Offline'}
        </div>

        <div className="user-profile-badge">
          <img src={user.avatar} alt={user.name} className="user-avatar" />
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-meta" id="header-user-xp">{user.xp} XP • {user.level}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
