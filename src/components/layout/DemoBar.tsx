import React from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenId } from '../../types';

export const DemoBar: React.FC = () => {
  const { currentScreen, navigateTo, isMuted, toggleMute, resetDemoState, isAuthenticated, logout, user } = useApp();

  // Se o explorador já estiver logado, não exibe Início/Landing, Login nem Cadastro
  const screens: { id: ScreenId; label: string }[] = isAuthenticated
    ? [
        { id: 'trilha', label: '🌌 Trilha Celeste' },
        { id: 'constelacao', label: '🏹 Ficha Homem Velho' },
        { id: 'observatorio', label: '🔭 Guia Stellarium' },
        { id: 'exercicio', label: '✍️ Exercício' },
        { id: 'dicionario', label: '📖 Dicionário Tupi' }
      ]
    : [
        { id: 'landing', label: '🪐 Início' },
        { id: 'trilha', label: '🌌 Trilha Celeste' },
        { id: 'dicionario', label: '📖 Dicionário Tupi' },
        { id: 'login', label: '🔑 Entrar' },
        { id: 'cadastro', label: '📝 Criar Conta' }
      ];

  return (
    <header className="demo-bar">
      <div className="demo-bar-badge">
        <span className="live-dot" /> 
        {isAuthenticated ? `Aldeia Conectada • ${user.name}` : 'Trilha Celeste Potiguara'}
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
            style={{ 
              borderColor: 'rgba(244, 63, 94, 0.45)', 
              color: '#fda4af',
              background: 'rgba(244, 63, 94, 0.12)' 
            }}
            onClick={logout}
            title="Encerrar Sessão e Sair"
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
          title="Reiniciar Demonstração"
        >
          ↺
        </button>
      </div>
    </header>
  );
};
