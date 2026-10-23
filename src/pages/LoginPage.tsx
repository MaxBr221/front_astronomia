import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { audioSystem } from '../utils/audioSystem';

export const LoginPage: React.FC = () => {
  const { login, navigateTo } = useApp();

  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Notificações estilizadas
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});

  // Credenciais de teste rápido "Entrar como Yara (Demo)"
  const handleQuickDemoLogin = () => {
    audioSystem.playClick();
    setIdentifier('yara@potiguara.org');
    setPassword('123456');
    setFieldErrors({});
    setNotification(null);
  };

  const validateForm = (): boolean => {
    const errors: { identifier?: string; password?: string } = {};

    if (!identifier.trim()) {
      errors.identifier = 'Informe seu e-mail ou nome de usuário.';
    }

    if (!password) {
      errors.password = 'A senha é obrigatória.';
    } else if (password.length < 6) {
      errors.password = 'A senha deve possuir no mínimo 6 dígitos.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (!validateForm()) {
      audioSystem.playError();
      return;
    }

    setIsLoading(true);
    const result = await login({
      identifier: identifier.trim(),
      password
    });
    setIsLoading(false);

    if (result.success) {
      audioSystem.playSuccess();
      setNotification({
        type: 'success',
        message: 'Bem-vindo à aldeia cósmica! Conectando à Trilha Celeste...'
      });
      // Pequeno delay para o usuário ver o feedback visual amigável
      setTimeout(() => {
        navigateTo('trilha');
      }, 700);
    } else {
      audioSystem.playError();
      setNotification({
        type: 'error',
        message: result.message || 'Credenciais incorretas'
      });
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card-container">
        
        {/* Abas Alternáveis Cósmicas */}
        <div className="auth-nav-tabs">
          <button
            type="button"
            className="auth-nav-tab-btn active"
            onClick={() => {}}
          >
            <span>🔑</span> Entrar
          </button>
          <button
            type="button"
            className="auth-nav-tab-btn"
            onClick={() => navigateTo('cadastro')}
          >
            <span>📝</span> Criar Conta de Explorador
          </button>
        </div>

        {/* Cabeçalho */}
        <div className="auth-header">
          <div className="brand-emblem" style={{ width: '56px', height: '56px', margin: '0 auto 14px' }}>
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
              <circle cx="50" cy="50" r="18" fill="#f59e0b" opacity="0.35" />
              <path d="M 50 15 A 35 35 0 0 1 85 50 A 35 35 0 0 1 50 85 A 35 35 0 0 1 15 50 A 35 35 0 0 1 50 15" strokeDasharray="8 6" />
              <path d="M 50 28 A 22 22 0 0 1 72 50 A 22 22 0 0 1 50 72 A 22 22 0 0 1 28 50 A 22 22 0 0 1 50 28" stroke="#fbbf24" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="7" fill="#ffffff" />
            </svg>
          </div>
          <h2>Portal do Firmamento</h2>
          <p>Acesse sua conta para guardar suas constelações e continuar sua trilha ancestral.</p>
        </div>

        {/* Botão de Atalho Demo Rápido */}
        <button
          type="button"
          className="btn-quick-demo"
          onClick={handleQuickDemoLogin}
          id="btn-demo-yara"
        >
          <span>⚡</span> Entrar como Yara (Demo)
        </button>

        {/* Notificação Estilizada Cósmica */}
        {notification && (
          <div className={`cosmic-notification ${notification.type}`}>
            <span>{notification.type === 'success' ? '✨' : '⚠️'}</span>
            <span>{notification.message}</span>
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Identificador (Email ou Username) */}
          <div className="auth-field-group">
            <label htmlFor="login-identifier">
              <span>E-mail ou Nome de Usuário</span>
              {fieldErrors.identifier && (
                <span className="input-field-hint">{fieldErrors.identifier}</span>
              )}
            </label>
            <div className="auth-input-wrapper">
              <input
                id="login-identifier"
                type="text"
                placeholder="ex: yara@potiguara.org ou yara_potiguara"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (fieldErrors.identifier) setFieldErrors(prev => ({ ...prev, identifier: undefined }));
                }}
                className={`auth-input ${fieldErrors.identifier ? 'input-error' : ''}`}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Senha com alternância de visibilidade 👁️ */}
          <div className="auth-field-group">
            <label htmlFor="login-password">
              <span>Senha de Acesso</span>
              {fieldErrors.password && (
                <span className="input-field-hint">{fieldErrors.password}</span>
              )}
            </label>
            <div className="auth-input-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
                }}
                className={`auth-input has-eye ${fieldErrors.password ? 'input-error' : ''}`}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="btn-eye-toggle"
                onClick={() => setShowPassword(prev => !prev)}
                title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                aria-label="Alternar visibilidade da senha"
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          {/* Botão de Enviar */}
          <button
            type="submit"
            className="btn-hero-primary"
            style={{ width: '100%', marginTop: '6px' }}
            disabled={isLoading}
            id="btn-submit-login"
          >
            {isLoading ? 'Conectando à Trilha...' : 'Entrar no Céu Ancestral ➔'}
          </button>
        </form>

        {/* Rodapé do Card */}
        <div className="auth-footer-links">
          <p>
            Ainda não é um explorador da aldeia?{' '}
            <button
              type="button"
              className="btn-text-link"
              onClick={() => navigateTo('cadastro')}
            >
              Criar Conta Gratuita
            </button>
          </p>

          <button
            type="button"
            className="btn-text-link-muted"
            style={{ marginTop: '14px' }}
            onClick={() => navigateTo('landing')}
          >
            ← Voltar para a Página Inicial
          </button>
        </div>

      </div>
    </div>
  );
};
