import { apiClient } from './api';
import { 
  ExerciseDTO, 
  ValidateExercisePayload, 
  ExerciseValidationResponse, 
  ExerciseResultPair 
} from '../types/backend';
import { MOCK_EXERCISE_DATA } from './mockBackendData';

export const exerciseService = {
  // GET /api/exercicios/{code}
  async getExercise(code: string = 'exercicio_associacao_ecologica'): Promise<ExerciseDTO> {
    try {
      const response = await apiClient.get<ExerciseDTO>(`/api/exercicios/${code}`);
      return response.data;
    } catch (error) {
      console.warn(`Falha ao obter exercício ${code}. Usando fallback local.`, error);
      return MOCK_EXERCISE_DATA;
    }
  },

  // POST /api/exercicios/{code}/validar
  async validateExercise(
    code: string, 
    payload: ValidateExercisePayload
  ): Promise<ExerciseValidationResponse> {
    try {
      const response = await apiClient.post<ExerciseValidationResponse>(
        `/api/exercicios/${code}/validar`, 
        payload
      );
      return response.data;
    } catch (error) {
      console.warn('Spring Boot offline para validação de exercício. Executando validação local.', error);

      // Gabarito correto esperado
      const expectedMatches: Record<string, string> = {
        homem_velho: 'chuvas_milho',
        ema_celeste: 'solsticio_mares',
        caminho_antas: 'estrada_antepassados',
        veado: 'primavera_renovacao'
      };

      const results: ExerciseResultPair[] = Object.entries(expectedMatches).map(([leftId, expectedRight]) => {
        const selected = payload.answers[leftId] || '';
        return {
          leftId,
          selectedRightId: selected,
          expectedRightId: expectedRight,
          isCorrect: selected === expectedRight
        };
      });

      const correctCount = results.filter(r => r.isCorrect).length;
      const total = results.length;
      const score = Math.round((correctCount / total) * 100);
      const passed = correctCount >= 3;

      return {
        exerciseCode: code,
        totalPairs: total,
        correctAnswers: correctCount,
        scorePercentage: score,
        passed,
        xpEarned: passed ? 150 : 0,
        userLivesRemaining: passed ? 3 : 2,
        results,
        feedbackMessage: passed
          ? 'Parabéns! Você conectou com sabedoria as constelações aos seus ciclos ecológicos correspondentes.'
          : 'Alguma das conexões não corresponde ao saber tradicional dos mais velhos. Relembre os ensinamentos e tente novamente.'
      };
    }
  }
};
