// Definições de Tipos estritos mapeados para os modelos Java Spring Boot & PostgreSQL

export type ConstellationStatus = 'LIBERADO' | 'EM_PROGRESSO' | 'CONCLUIDO' | 'BLOQUEADO';

export interface ProgressItem {
  constellationCode: string;
  status: ConstellationStatus;
  progress: number;
}

export interface UserBackendDTO {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  level: string;
  xp: number;
  maxXp: number;
  lives: number;
  maxLives: number;
  lunarCycle: string;
  progressList?: ProgressItem[];
}

// 🔑 Módulo 1: Autenticação
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  fullName: string;
  avatarUrl: string;
}

export interface LoginPayload {
  identifier: string; // Aceita e-mail OU nome de usuário
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: UserBackendDTO;
}

// 🌌 Módulo 2: Constelações
export interface StarBackendDTO {
  name: string;
  traditionalName: string;
  westernName: string;
  brightness: string;
  description: string;
  x: number; // Coordenada X relativa (0 a 100%)
  y: number; // Coordenada Y relativa (0 a 100%)
  color?: string;
}

export interface ConstellationListItemDTO {
  code: string; // "homem_velho" | "ema_celeste" | "caminho_antas" | "veado"
  title: string;
  indigenousName: string;
  culture: string;
  seasonInfo: string;
  status: ConstellationStatus;
  progressPercentage: number;
  westernEquivalence: string;
  climateMarker: string;
  stepsCount: number;
  imageUrl?: string;
}

export interface ConstellationDetailDTO extends ConstellationListItemDTO {
  narrativeTupi: string;
  narrativePt: string;
  audioTupiUrl: string;
  audioPtUrl: string;
  audioDurationSeconds: number;
  stars: StarBackendDTO[];
  ecologicalCalendar: {
    indicator: string;
    planting: string;
    tidesAndFishing: string;
  };
}

// 🔭 Módulo 3: Observatório & Stellarium
export interface ObservatoryStepDTO {
  stepNumber: number;
  title: string;
  tag: string;
  instruction: string;
  value: string;
  icon: string;
  detail: string;
}

export interface ObservatoryGuideDTO {
  constellationCode: string;
  title: string;
  subtitle: string;
  narrator: string;
  audioTitle: string;
  audioDuration: string;
  location: string;
  targetDate: string;
  azimuth: string;
  altitude: string;
  bestViewingSeason: string;
  searchTerms: string[];
  steps: ObservatoryStepDTO[];
  stellariumWebUrl: string;
  coordinatesText: string;
}

// ✍️ Módulo 4: Exercícios & Gamificação
export interface ExercisePairDTO {
  leftId: string;
  leftLabel: string;
  leftNative: string;
  leftIcon: string;
  leftAudio?: string;
  leftTooltip: string;
  rightId: string;
  rightLabel: string;
  rightSub: string;
  rightIcon: string;
  rightColor: string;
}

export interface ExerciseDTO {
  code: string;
  title: string;
  subtitle: string;
  questionStep: string;
  level: string;
  culturalIntro: string;
  hint: string;
  pairs: ExercisePairDTO[];
}

export interface ValidateExercisePayload {
  userId: number;
  answers: Record<string, string>; // { [leftId]: rightId }
}

export interface ExerciseResultPair {
  leftId: string;
  selectedRightId: string;
  expectedRightId: string;
  isCorrect: boolean;
}

export interface ExerciseValidationResponse {
  exerciseCode: string;
  totalPairs: number;
  correctAnswers: number;
  scorePercentage: number;
  passed: boolean;
  xpEarned: number;
  userLivesRemaining: number;
  results: ExerciseResultPair[];
  feedbackMessage: string;
}

// 👤 Módulo 5: Progresso do Usuário
export interface UpdateProgressPayload {
  constellationCode: string;
  audioCompleted?: boolean;
  lessonCompleted?: boolean;
  stellariumCompleted?: boolean;
  exerciseCompleted?: boolean;
}
