import { apiClient } from './api';
import { RegisterPayload, LoginPayload, AuthResponse, UserBackendDTO } from '../types/backend';
import { MOCK_BACKEND_USER } from './mockBackendData';

export const authService = {
  // POST /api/auth/cadastro
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/cadastro', payload);
      if (response.data.token) {
        localStorage.setItem('potiguara_auth_token', response.data.token);
        localStorage.setItem('potiguara_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.warn('Spring Boot offline ou erro no cadastro. Utilizando mock de desenvolvimento.', error);
      
      // Fallback Mock
      const mockUser: UserBackendDTO = {
        ...MOCK_BACKEND_USER,
        id: Date.now(),
        username: payload.username,
        email: payload.email,
        fullName: payload.fullName,
        avatarUrl: payload.avatarUrl || '/assets/tuira_avatar.jpg',
        xp: 150 // Bônus de entrada
      };
      const mockResponse: AuthResponse = {
        success: true,
        message: 'Cadastro realizado com sucesso! Bem-vindo(a) à Trilha Celeste Potiguara.',
        token: 'potiguara-auth-uuid-' + Date.now(),
        user: mockUser
      };
      localStorage.setItem('potiguara_auth_token', mockResponse.token);
      localStorage.setItem('potiguara_user', JSON.stringify(mockResponse.user));
      return mockResponse;
    }
  },

  // POST /api/auth/login
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/login', payload);
      if (response.data.token) {
        localStorage.setItem('potiguara_auth_token', response.data.token);
        localStorage.setItem('potiguara_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.warn('Spring Boot offline ou credenciais mock. Usando fallback de desenvolvimento.', error);

      // Se for credencial demo ou teste
      const mockUser: UserBackendDTO = {
        ...MOCK_BACKEND_USER,
        email: payload.identifier.includes('@') ? payload.identifier : MOCK_BACKEND_USER.email,
        username: !payload.identifier.includes('@') ? payload.identifier : MOCK_BACKEND_USER.username
      };

      const mockResponse: AuthResponse = {
        success: true,
        message: 'Login efetuado com sucesso!',
        token: 'potiguara-auth-uuid-demo',
        user: mockUser
      };
      localStorage.setItem('potiguara_auth_token', mockResponse.token);
      localStorage.setItem('potiguara_user', JSON.stringify(mockResponse.user));
      return mockResponse;
    }
  },

  // GET /api/auth/me
  async getMe(userId?: number): Promise<UserBackendDTO> {
    try {
      const url = userId ? `/api/auth/me?userId=${userId}` : '/api/auth/me';
      const response = await apiClient.get<UserBackendDTO>(url);
      localStorage.setItem('potiguara_user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      const cached = localStorage.getItem('potiguara_user');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // fallback
        }
      }
      return MOCK_BACKEND_USER;
    }
  },

  // Logout local
  logout(): void {
    localStorage.removeItem('potiguara_auth_token');
    localStorage.removeItem('potiguara_token');
    localStorage.removeItem('potiguara_user');
  },

  getCurrentUser(): UserBackendDTO | null {
    const raw = localStorage.getItem('potiguara_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!(
      localStorage.getItem('potiguara_auth_token') ||
      localStorage.getItem('potiguara_token') ||
      localStorage.getItem('potiguara_user')
    );
  }
};
