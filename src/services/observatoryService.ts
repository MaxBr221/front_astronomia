import { apiClient } from './api';
import { ObservatoryGuideDTO } from '../types/backend';
import { MOCK_OBSERVATORY_HOMEM_VELHO } from './mockBackendData';

export const observatoryService = {
  // GET /api/observatorio
  async getGuides(): Promise<ObservatoryGuideDTO[]> {
    try {
      const response = await apiClient.get<ObservatoryGuideDTO[]>('/api/observatorio');
      return response.data;
    } catch (error) {
      console.warn('Falha ao obter lista do observatório. Usando dados locais.', error);
      return [MOCK_OBSERVATORY_HOMEM_VELHO];
    }
  },

  // GET /api/observatorio/{constellationCode}
  async getGuideByConstellation(constellationCode: string): Promise<ObservatoryGuideDTO> {
    try {
      const response = await apiClient.get<ObservatoryGuideDTO>(`/api/observatorio/${constellationCode}`);
      return response.data;
    } catch (error) {
      console.warn(`Falha ao obter guia do observatório para ${constellationCode}. Usando fallback.`, error);
      return MOCK_OBSERVATORY_HOMEM_VELHO;
    }
  }
};
