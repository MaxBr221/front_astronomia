import { apiClient } from './api';
import { UserBackendDTO, UpdateProgressPayload } from '../types/backend';
import { MOCK_BACKEND_USER } from './mockBackendData';

export const userService = {
  // GET /api/usuarios/perfil
  async getProfile(): Promise<UserBackendDTO> {
    try {
      const response = await apiClient.get<UserBackendDTO>('/api/usuarios/perfil');
      localStorage.setItem('potiguara_user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.warn('Falha ao obter perfil do Spring Boot. Usando dados locais.', error);
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

  // POST /api/usuarios/{id}/progresso
  async updateProgress(userId: number, payload: UpdateProgressPayload): Promise<UserBackendDTO> {
    try {
      const response = await apiClient.post<UserBackendDTO>(`/api/usuarios/${userId}/progresso`, payload);
      localStorage.setItem('potiguara_user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.warn(`Falha ao sincronizar progresso para usuário ${userId}. Atualizando localmente.`, error);
      const cached = localStorage.getItem('potiguara_user');
      let user: UserBackendDTO = cached ? JSON.parse(cached) : { ...MOCK_BACKEND_USER, id: userId };

      // Atualiza lista de progresso se existir
      if (user.progressList) {
        user.progressList = user.progressList.map(item => {
          if (item.constellationCode === payload.constellationCode) {
            const newProgress = Math.min(100, item.progress + 25);
            return {
              ...item,
              progress: newProgress,
              status: newProgress >= 100 ? 'CONCLUIDO' : 'EM_PROGRESSO'
            };
          }
          return item;
        });
      }

      user.xp += 50;
      localStorage.setItem('potiguara_user', JSON.stringify(user));
      return user;
    }
  },

  // POST /api/usuarios/{id}/recuperar-vidas
  async recoverLives(userId: number): Promise<UserBackendDTO> {
    try {
      const response = await apiClient.post<UserBackendDTO>(`/api/usuarios/${userId}/recuperar-vidas`);
      localStorage.setItem('potiguara_user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.warn(`Falha ao recuperar vidas no backend para usuário ${userId}. Restaurando localmente.`, error);
      const cached = localStorage.getItem('potiguara_user');
      let user: UserBackendDTO = cached ? JSON.parse(cached) : { ...MOCK_BACKEND_USER, id: userId };
      user.lives = user.maxLives || 3;
      localStorage.setItem('potiguara_user', JSON.stringify(user));
      return user;
    }
  }
};
