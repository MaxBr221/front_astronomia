// Serviço de Integração com o Backend Spring Boot + Fallback Resiliente para Modo Offline

import { 
  ConstelacaoDTO, 
  NoTrilhaDTO, 
  GuiaStellariumDTO, 
  ExercicioLigarColunasDTO, 
  UsuarioDTO,
  LoginDTO,
  RegisterDTO,
  AuthResponseDTO 
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_TRAIL_NODES, 
  CONSTELACAO_HOMEM_VELHO, 
  GUIA_STELLARIUM_HOMEM_VELHO, 
  EXERCICIO_LIGAR_COLUNAS 
} from './mockDatabase';

const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiClient {
  private isConnectedToBackend = false;

  constructor() {
    this.checkHealth();
  }

  // Verifica se a API Java / Spring Boot está online
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/health`, { method: 'GET' });
      this.isConnectedToBackend = response.ok;
    } catch {
      this.isConnectedToBackend = false;
    }
    return this.isConnectedToBackend;
  }

  getBackendStatus(): boolean {
    return this.isConnectedToBackend;
  }

  // Obter Perfil do Usuário & Progresso
  async getUsuario(): Promise<UsuarioDTO> {
    if (this.isConnectedToBackend) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/usuario/perfil`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Falha na requisição Spring Boot, usando cache local:', e);
      }
    }
    return INITIAL_USER;
  }

  // Obter Nós da Trilha Celeste
  async getNosTrilha(): Promise<Record<string, NoTrilhaDTO>> {
    if (this.isConnectedToBackend) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/trilha/nos`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Falha na requisição Spring Boot, usando cache local:', e);
      }
    }
    return INITIAL_TRAIL_NODES;
  }

  // Obter Detalhes da Constelação
  async getConstelacao(id: string): Promise<ConstelacaoDTO> {
    if (this.isConnectedToBackend) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/constelacoes/${id}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Falha na requisição Spring Boot, usando cache local:', e);
      }
    }
    return CONSTELACAO_HOMEM_VELHO;
  }

  // Obter Guia Stellarium
  async getGuiaStellarium(constellationId: string): Promise<GuiaStellariumDTO> {
    if (this.isConnectedToBackend) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/stellarium/${constellationId}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Falha na requisição Spring Boot, usando cache local:', e);
      }
    }
    return GUIA_STELLARIUM_HOMEM_VELHO;
  }

  // Obter Exercício
  async getExercicio(id: string): Promise<ExercicioLigarColunasDTO> {
    if (this.isConnectedToBackend) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/exercicios/${id}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Falha na requisição Spring Boot, usando cache local:', e);
      }
    }
    return EXERCICIO_LIGAR_COLUNAS;
  }

  // Autenticação: Login
  async login(credentials: LoginDTO): Promise<AuthResponseDTO | null> {
    if (this.isConnectedToBackend) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        if (res.ok) {
          const data: AuthResponseDTO = await res.json();
          localStorage.setItem('potiguara_token', data.token);
          return data;
        }
      } catch (e) {
        console.warn('Erro ao conectar ao Spring Boot auth:', e);
      }
    }

    // Mock Login: permite testar com qualquer e-mail/senha
    const mockUser: UsuarioDTO = {
      ...INITIAL_USER,
      name: credentials.email.split('@')[0] || 'Explorador Potiguara'
    };
    const mockResponse: AuthResponseDTO = {
      token: 'mock-jwt-token-potiguara',
      user: mockUser
    };
    localStorage.setItem('potiguara_token', mockResponse.token);
    return mockResponse;
  }

  // Autenticação: Cadastro
  async register(data: RegisterDTO): Promise<AuthResponseDTO | null> {
    if (this.isConnectedToBackend) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          const authData: AuthResponseDTO = await res.json();
          localStorage.setItem('potiguara_token', authData.token);
          return authData;
        }
      } catch (e) {
        console.warn('Erro ao registrar no Spring Boot:', e);
      }
    }

    // Mock Register
    const newUser: UsuarioDTO = {
      id: `usr_${Date.now()}`,
      name: data.name,
      avatar: data.avatar || '/assets/tuira_avatar.jpg',
      level: 'Iniciante Astral • Nível 1',
      xp: 150, // Já recebe os 150 XP do exercício de introdução!
      maxXp: 1000,
      progressPercentage: 25,
      lunarCycle: 'Lua Nova (Jaci) • Início da Jornada',
      lives: 2,
      maxLives: 2
    };
    const mockAuth: AuthResponseDTO = {
      token: 'mock-jwt-token-registered',
      user: newUser
    };
    localStorage.setItem('potiguara_token', mockAuth.token);
    return mockAuth;
  }

  logout(): void {
    localStorage.removeItem('potiguara_token');
    localStorage.removeItem('potiguara_auth_token');
    localStorage.removeItem('potiguara_user');
  }

  getToken(): string | null {
    return localStorage.getItem('potiguara_token');
  }
}

export const api = new ApiClient();
