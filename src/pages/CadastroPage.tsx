import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { audioSystem } from '../utils/audioSystem';
import { launchCosmicConfetti } from '../utils/confetti';

const AVATAR_OPTIONS = [
  { id: 'tuira', label: 'Tuira (Sábio)', src: '/assets/tuira_avatar.jpg' },
  { id: 'rain', label: 'Guardião das Águas', src: '/assets/rain_season.jpg' },
  { id: 'tides', label: 'Navegante das Marés', src: '/assets/fishing_tides.jpg' }
];

export const CadastroPage: React.FC = () => {
  const { registerUser, navigateTo, pendingXp } = useApp();

  const [fullName, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATAR_OPTIONS[0].src);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Notificações e validações
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    username?: string;
    email?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: {
      fullName?: string;
      username?: string;
      email?: string;
      password?: string;
    } = {};

    if (!fullName.trim()) {
      errors.fullName = 'Informe seu nome completo.';
    }

    if (!username.trim()) {
      errors.username = 'Escolha um nome de usuário (ex: kaua_tupi).';
    } else if (username.trim().length < 3) {
      errors.username = 'O nome de usuário deve ter pelo menos 3 caracteres.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = 'Informe um endereço de e-mail válido.';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Formato de e-mail inválido.';
    }

    if (!password) {
      errors.password = 'A senha é obrigatória.';
    } else if (password.length < 6) {
      errors.password = 'A senha deve conter no mínimo 6 caracteres.';
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
    const result = await registerUser({
      fullName: fullName.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password,
      avatarUrl: selectedAvatar
    });
    setIsLoading(false);

    if (result.success) {
      audioSystem.playSuccess();
      launchCosmicConfetti();
      setNotification({
        type: 'success',
        message: 'Bem-vindo à aldeia cósmica! Seu cadastro de explorador foi consagrado.'
      });
      setTimeout(() => {
        navigateTo('trilha');
      }, 900);
    } else {
      audioSystem.playError();
      setNotification({
        type: 'error',
        message: result.message || 'Falha ao registrar explorador. Tente novamente.'
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
            className="auth-nav-tab-btn"
            onClick={() => navigateTo('login')}
          >
            <span>🔑</span> Entrar
          </button>
          <button
            type="button"
            className="auth-nav-tab-btn active"
            onClick={() => {}}
          >
            <span>📝</span> Criar Conta de Explorador
          </button>
        </div>

        {/* Cabeçalho do Card */}
        <div className="auth-header">
          <div className="brand-emblem" style={{ width: '56px', height: '56px', margin: '0 auto 14px' }}>
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
              <circle cx="50" cy="50" r="18" fill="#f59e0b" opacity="0.35" />
              <path d="M 50 15 A 35 35 0 0 1 85 50 A 35 35 0 0 1 50 85 A 35 35 0 0 1 15 50 A 35 35 0 0 1 50 15" strokeDasharray="8 6" />
              <path d="M 50 28 A 22 22 0 0 1 72 50 A 22 22 0 0 1 50 72 A 22 22 0 0 1 28 50 A 22 22 0 0 1 50 28" stroke="#fbbf24" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="7" fill="#ffffff" />
            </svg>
          </div>
          <h2>Iniciação de Explorador</h2>
          <p>Consagre seu nome na aldeia celestial e registre sua evolução nas quatro constelações.</p>
        </div>

        {/* Banner de XP Pendente (Gamificação) */}
        {pendingXp > 0 && (
          <div className="auth-reward-banner">
            ⭐ <strong>+{pendingXp} XP Aguardando:</strong> Suas respostas no exercício introdutório serão guardadas no seu perfil!
          </div>
        )}

        {/* Notificação Estilizada Cósmica */}
        {notification && (
          <div className={`cosmic-notification ${notification.type}`}>
            <span>{notification.type === 'success' ? '✨' : '⚠️'}</span>
            <span>{notification.message}</span>
          </div>
        )}

        {/* Formulário de Cadastro */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          
          {/* Nome Completo */}
          <div className="auth-field-group">
            <label htmlFor="reg-fullname">
              <span>Nome Completo</span>
              {fieldErrors.fullName && <span className="input-field-hint">{fieldErrors.fullName}</span>}
            </label>
            <div className="auth-input-wrapper">
              <input
                id="reg-fullname"
                type="text"
                placeholder="ex: Kauã Potiguara"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (fieldErrors.fullName) setFieldErrors(prev => ({ ...prev, fullName: undefined }));
                }}
                className={`auth-input ${fieldErrors.fullName ? 'input-error' : ''}`}
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* Nome de Usuário */}
          <div className="auth-field-group">
            <label htmlFor="reg-username">
              <span>Nome de Usuário (Identificador)</span>
              {fieldErrors.username && <span className="input-field-hint">{fieldErrors.username}</span>}
            </label>
            <div className="auth-input-wrapper">
              <input
                id="reg-username"
                type="text"
                placeholder="ex: tupi_explorador"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username) setFieldErrors(prev => ({ ...prev, username: undefined }));
                }}
                className={`auth-input ${fieldErrors.username ? 'input-error' : ''}`}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* E-mail */}
          <div className="auth-field-group">
            <label htmlFor="reg-email">
              <span>E-mail</span>
              {fieldErrors.email && <span className="input-field-hint">{fieldErrors.email}</span>}
            </label>
            <div className="auth-input-wrapper">
              <input
                id="reg-email"
                type="email"
                placeholder="explorador@potiguara.org"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
                }}
                className={`auth-input ${fieldErrors.email ? 'input-error' : ''}`}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Senha com Alternância de Visibilidade */}
          <div className="auth-field-group">
            <label htmlFor="reg-password">
              <span>Senha de Proteção</span>
              {fieldErrors.password && <span className="input-field-hint">{fieldErrors.password}</span>}
            </label>
            <div className="auth-input-wrapper">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo de 6 caracteres"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
                }}
                className={`auth-input has-eye ${fieldErrors.password ? 'input-error' : ''}`}
                autoComplete="new-password"
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

          {/* Seleção de Avatar Indígena */}
          <div className="auth-field-group" style={{ marginTop: '2px' }}>
            <label>Avatar e Totem Protetor</label>
            <div className="avatar-selection-row">
              {AVATAR_OPTIONS.map((av) => (
                <div
                  key={av.id}
                  className={`avatar-option-card ${selectedAvatar === av.src ? 'selected' : ''}`}
                  onClick={() => {
                    audioSystem.playClick();
                    setSelectedAvatar(av.src);
                  }}
                  title={av.label}
                >
                  <img src={av.src} alt={av.label} />
                  <span>{av.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botão de Cadastro */}
          <button
            type="submit"
            className="btn-hero-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={isLoading}
            id="btn-submit-cadastro"
          >
            {isLoading ? 'Consagrando Explorador...' : 'Criar Conta de Explorador ➔'}
          </button>
        </form>

        {/* Rodapé do Card */}
        <div className="auth-footer-links">
          <p>
            Já possui uma conta de explorador?{' '}
            <button
              type="button"
              className="btn-text-link"
              onClick={() => navigateTo('login')}
            >
              Fazer Login
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
