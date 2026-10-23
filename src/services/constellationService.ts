import { apiClient } from './api';
import { ConstellationListItemDTO, ConstellationDetailDTO } from '../types/backend';
import { MOCK_CONSTELLATIONS_LIST, MOCK_CONSTELLATION_HOMEM_VELHO } from './mockBackendData';

export const constellationService = {
  // GET /api/constelacoes
  async getConstellations(): Promise<ConstellationListItemDTO[]> {
    try {
      const response = await apiClient.get<ConstellationListItemDTO[]>('/api/constelacoes');
      return response.data;
    } catch (error) {
      console.warn('Falha ao obter constelações do Spring Boot. Usando dados locais.', error);
      return MOCK_CONSTELLATIONS_LIST;
    }
  },

  // GET /api/constelacoes/{code}
  async getConstellationByCode(code: string): Promise<ConstellationDetailDTO> {
    try {
      const response = await apiClient.get<ConstellationDetailDTO>(`/api/constelacoes/${code}`);
      return response.data;
    } catch (error) {
      console.warn(`Falha ao obter detalhes da constelação ${code}. Usando fallback local.`, error);
      if (code === 'homem_velho') {
        return MOCK_CONSTELLATION_HOMEM_VELHO;
      }
      const item = MOCK_CONSTELLATIONS_LIST.find(c => c.code === code) || MOCK_CONSTELLATIONS_LIST[0];
      return {
        ...item,
        narrativeTupi: 'Mito ancestral guardado pelos mais velhos.',
        narrativePt: 'História sagrada e relações com a natureza da aldeia.',
        audioTupiUrl: '/audio/tupi.mp3',
        audioPtUrl: '/audio/pt.mp3',
        audioDurationSeconds: 120,
        stars: MOCK_CONSTELLATION_HOMEM_VELHO.stars,
        ecologicalCalendar: MOCK_CONSTELLATION_HOMEM_VELHO.ecologicalCalendar
      };
    }
  }
};
