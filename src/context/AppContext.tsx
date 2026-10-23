import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ScreenId, UsuarioDTO, NoTrilhaDTO } from '../types';
import { UserBackendDTO, RegisterPayload, LoginPayload } from '../types/backend';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { checkServerHealth } from '../services/api';
import { INITIAL_TRAIL_NODES } from '../services/mockDatabase';
import { audioSystem } from '../utils/audioSystem';

interface AppContextType {
  currentScreen: ScreenId;
  navigateTo: (screen: ScreenId) => void;
  user: UsuarioDTO;
  rawUser: UserBackendDTO | null;
  nodes: Record<string, NoTrilhaDTO>;
  isMuted: boolean;
  toggleMute: () => void;
  completeHomemVelho: () => Promise<void>;
  resetDemoState: () => void;
  isBackendConnected: boolean;
  checkBackendConnection: () => Promise<void>;
  isAuthenticated: boolean;
  pendingXp: number;
  setPendingXp: (xp: number) => void;
  login: (credentials: LoginPayload) => Promise<{ success: boolean; message: string }>;
  registerUser: (data: RegisterPayload) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  recoverUserLives: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const VALID_SCREENS: ScreenId[] = [
  'landing',
  'trilha',
  'constelacao',
  'observatorio',
  'exercicio',
  'login',
  'cadastro'
];

function mapBackendUserToUsuarioDTO(backendUser: UserBackendDTO): UsuarioDTO {
  return {
    id: String(backendUser.id),
    name: backendUser.fullName || backendUser.username || 'Explorador Potiguara',
    avatar: backendUser.avatarUrl || '/assets/tuira_avatar.jpg',
    level: backendUser.level || 'Explorador Iniciante • Nível 1',
    xp: backendUser.xp ?? 0,
    maxXp: backendUser.maxXp ?? 500,
    progressPercentage: backendUser.maxXp ? Math.min(100, Math.round((backendUser.xp / backendUser.maxXp) * 100)) : 25,
    lunarCycle: backendUser.lunarCycle || 'Lua Nova (Jaci) • Céu Limpo',
    lives: backendUser.lives ?? 3,
    maxLives: backendUser.maxLives ?? 3
  };
}

const DEFAULT_BACKEND_USER: UserBackendDTO = {
  id: 1,
  username: 'yara_potiguara',
  email: 'yara@potiguara.org',
  fullName: 'Yara Potiguara',
  avatarUrl: '/assets/tuira_avatar.jpg',
  level: 'Iniciante Astral • Nível 1',
  xp: 150,
  maxXp: 500,
  lives: 3,
  maxLives: 3,
  lunarCycle: 'Lua Nova (Jaci) • Céu Limpo',
  progressList: [
    { constellationCode: 'homem_velho', status: 'LIBERADO', progress: 85 },
    { constellationCode: 'ema_celeste', status: 'BLOQUEADO', progress: 0 },
    { constellationCode: 'caminho_antas', status: 'BLOQUEADO', progress: 0 },
    { constellationCode: 'veado', status: 'BLOQUEADO', progress: 0 }
  ]
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => authService.isAuthenticated());

  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    const isAuth = authService.isAuthenticated();
    const hash = window.location.hash.replace('#', '') as ScreenId;
    if (isAuth && (hash === 'landing' || hash === 'login' || hash === 'cadastro' || !hash)) {
      return 'trilha';
    }
    return VALID_SCREENS.includes(hash) ? hash : isAuth ? 'trilha' : 'landing';
  });

  const [rawUser, setRawUser] = useState<UserBackendDTO>(() => {
    const stored = authService.getCurrentUser();
    return stored || DEFAULT_BACKEND_USER;
  });

  const [user, setUser] = useState<UsuarioDTO>(() => mapBackendUserToUsuarioDTO(rawUser));
  const [nodes, setNodes] = useState<Record<string, NoTrilhaDTO>>(INITIAL_TRAIL_NODES);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [pendingXp, setPendingXp] = useState<number>(0);

  // Sincroniza hash na URL
  const navigateTo = (screen: ScreenId) => {
    audioSystem.playClick();
    // Se o usuário já está autenticado, não faz sentido ir para login, cadastro ou landing
    if (authService.isAuthenticated() && (screen === 'landing' || screen === 'login' || screen === 'cadastro')) {
      screen = 'trilha';
    }
    setCurrentScreen(screen);
    window.location.hash = screen;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as ScreenId;
      const isAuth = authService.isAuthenticated();

      if (isAuth && (hash === 'landing' || hash === 'login' || hash === 'cadastro')) {
        setCurrentScreen('trilha');
        window.location.hash = 'trilha';
        return;
      }

      if (VALID_SCREENS.includes(hash)) {
        setCurrentScreen(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Monitora integridade de conexão com Spring Boot
  const checkBackendConnection = async () => {
    const online = await checkServerHealth();
    setIsBackendConnected(online);
  };

  useEffect(() => {
    checkBackendConnection();
    const interval = setInterval(checkBackendConnection, 12000);
    return () => clearInterval(interval);
  }, []);

  // Atualiza UsuarioDTO sempre que rawUser mudar
  useEffect(() => {
    setUser(mapBackendUserToUsuarioDTO(rawUser));
  }, [rawUser]);

  const toggleMute = () => {
    const muted = audioSystem.toggleMute();
    setIsMuted(muted);
  };

  // Ao concluir a lição/exercício
  const completeHomemVelho = async () => {
    setNodes(prev => ({
      ...prev,
      homem_velho: {
        ...prev.homem_velho,
        status: 'concluido',
        badgeLabel: 'CONCLUÍDO ⭐',
        progress: 100
      }
    }));

    const addedXp = 150;
    setRawUser(prev => {
      const updated: UserBackendDTO = {
        ...prev,
        xp: prev.xp + addedXp,
        level: prev.xp + addedXp >= 300 ? 'Guardião dos Saberes • Nível 2' : prev.level
      };
      localStorage.setItem('potiguara_user', JSON.stringify(updated));
      return updated;
    });

    if (!isAuthenticated) {
      setPendingXp(prev => prev + addedXp);
    }

    try {
      if (rawUser && rawUser.id) {
        await userService.updateProgress(rawUser.id, {
          constellationCode: 'homem_velho',
          exerciseCompleted: true,
          lessonCompleted: true
        });
      }
    } catch (err) {
      console.warn('Progresso registrado localmente.', err);
    }
  };

  // Autenticação: Login
  const login = async (credentials: LoginPayload): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await authService.login(credentials);
      if (res && res.token && res.user) {
        setIsAuthenticated(true);
        setRawUser(res.user);
        return { success: true, message: res.message || 'Login efetuado com sucesso!' };
      }
      return { success: false, message: res.message || 'Credenciais incorretas' };
    } catch {
      return { success: false, message: 'Falha ao autenticar. Verifique seus dados.' };
    }
  };

  // Autenticação: Cadastro
  const registerUser = async (data: RegisterPayload): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await authService.register(data);
      if (res && res.token && res.user) {
        setIsAuthenticated(true);
        const bonus = pendingXp > 0 ? pendingXp : 0;
        const userWithBonus: UserBackendDTO = {
          ...res.user,
          xp: res.user.xp + bonus
        };
        setRawUser(userWithBonus);
        setPendingXp(0);
        return { success: true, message: res.message || 'Bem-vindo à aldeia cósmica!' };
      }
      return { success: false, message: res.message || 'Erro ao realizar cadastro.' };
    } catch {
      return { success: false, message: 'Falha ao conectar com o serviço de cadastro.' };
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setRawUser(DEFAULT_BACKEND_USER);
    navigateTo('login');
  };

  // Recuperar vidas
  const recoverUserLives = async () => {
    if (rawUser && rawUser.id) {
      const updated = await userService.recoverLives(rawUser.id);
      setRawUser(updated);
    }
  };

  // Reiniciar estado da demonstração
  const resetDemoState = () => {
    audioSystem.playClick();
    setRawUser(DEFAULT_BACKEND_USER);
    setNodes(INITIAL_TRAIL_NODES);
    setPendingXp(0);
    navigateTo('landing');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        user,
        rawUser,
        nodes,
        isMuted,
        toggleMute,
        completeHomemVelho,
        resetDemoState,
        isBackendConnected,
        checkBackendConnection,
        isAuthenticated,
        pendingXp,
        setPendingXp,
        login,
        registerUser,
        logout,
        recoverUserLives
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider');
  }
  return context;
};
