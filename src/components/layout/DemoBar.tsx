import React from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenId } from '../../types';

export const DemoBar: React.FC = () => {
  const { currentScreen, navigateTo, isMuted, toggleMute, resetDemoState, isAuthenticated, logout } = useApp();

  const screens: { id: ScreenId; label: string }[] = [
    { id: 'landing', label: '🪐 Início / Landing' },
    { id: 'trilha', label: '🌌 1. Trilha Celeste' },
    { id: 'constelacao', label: '🏹 2. Ficha Homem Velho' },
    { id: 'observatorio', label: '🔭 3. Guia Stellarium' },
    { id: 'exercicio', label: '✍️ 4. Exercício' },
    { id: 'login', label: '🔑 Login' },
    { id: 'cadastro', label: '📝 Cadastro' }
  ];

  return (
    <header className="demo-bar">
      <div className="demo-bar-badge">
        <span className="live-dot" /> React + Spring Boot Ready
      </div>

      <nav className="demo-nav-pills" id="demo-nav">
        {screens.map(s => (
          <button
            key={s.id}
            className={`demo-pill ${currentScreen === s.id ? 'active' : ''}`}
            onClick={() => navigateTo(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <div className="demo-actions">
        {isAuthenticated && (
          <button
            className="demo-pill"
            style={{ borderColor: 'var(--accent-rose)', color: 'var(--accent-rose)' }}
            onClick={logout}
            title="Encerrar Sessão"
          >
            🚪 Sair
          </button>
        )}

        <button
          className="btn-icon-soft"
          onClick={toggleMute}
          title={isMuted ? 'Ativar Efeitos Sonoros' : 'Desativar Efeitos Sonoros'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>

        <button
          className="btn-icon-soft"
          onClick={resetDemoState}
          title="Reiniciar Estado do Protótipo"
        >
          ↺
        </button>
      </div>
    </header>
  );
};
