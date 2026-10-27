// TypeScript Types & Models para o ecossistema Etnoastronomia Potiguara (Front-end + Spring Boot DTOs)

export type ScreenId = 'landing' | 'trilha' | 'constelacao' | 'observatorio' | 'exercicio' | 'login' | 'cadastro';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface AuthResponseDTO {
  token: string;
  user: UsuarioDTO;
}

export interface Estrela {
  name: string;
  indigenous: string;
  mag: string;
  x: number; // Porcentagem horizontal na imagem (0-100)
  y: number; // Porcentagem vertical na imagem (0-100)
  color?: 'orange' | 'blue' | 'gold' | 'white';
}

export interface TabConteudo {
  heading: string;
  text?: string;
  source?: string;
  tag?: string;
  table?: {
    elemento: string;
    ocidental: string;
    significado: string;
  }[];
}

export interface AbaConhecimento {
  id: string;
  label: string;
  badge: string;
  content: TabConteudo[];
}

export interface ConstelacaoDTO {
  id: string;
  title: string;
  tupiTitle: string;
  tags: string[];
  starsEquiv: string;
  image: string;
  stars: Estrela[];
  audioPlayer: {
    title: string;
    tupiSnippet: string;
    tupiPhonetics: string;
    tupiTranslation: string;
    portugueseNarration: string;
    duration: string;
  };
  tabs: {
    historia: AbaConhecimento;
    equivalencia: AbaConhecimento;
    calendario: AbaConhecimento;
    fontes?: AbaConhecimento;
  };
}

export interface BadgeTrilha {
  icon: string;
  text: string;
}

export type StatusNoTrilha = 'bloqueado' | 'em_progresso' | 'concluido';

export interface NoTrilhaDTO {
  id: string;
  title: string;
  indigenousName: string;
  subtitle: string;
  status: StatusNoTrilha;
  badgeLabel: string;
  progress: number;
  badges: BadgeTrilha[];
  image: string;
  starsEquiv: string;
}

export interface AudioMarker {
  time: string;
  label: string;
}

export interface PassoObservacao {
  number: number;
  title: string;
  tag: string;
  icon: string;
  instruction: string;
  value: string;
  detail: string;
}

export interface GuiaStellariumDTO {
  constellationId: string;
  title: string;
  subtitle: string;
  narrator: string;
  audioTitle: string;
  duration: string;
  audioMarkers: AudioMarker[];
  steps: PassoObservacao[];
  stellariumWebUrl: string;
  coordinatesText: string;
}

export interface ExercicioItemEsquerda {
  id: string;
  name: string;
  nativeName: string;
  icon: string;
  audioText: string;
  tooltip: string;
}

export interface ExercicioItemDireita {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
}

export interface ExercicioLigarColunasDTO {
  id: string;
  title: string;
  subtitle: string;
  questionStep: string;
  level: string;
  lives: number;
  leftItems: ExercicioItemEsquerda[];
  rightItems: ExercicioItemDireita[];
  correctMatches: Record<string, string>; // { leftId: rightId }
  hint: string;
  feedbackSuccess: {
    title: string;
    xpReward: number;
    message: string;
  };
}

export interface UsuarioDTO {
  id: string;
  name: string;
  avatar: string;
  level: string;
  xp: number;
  maxXp: number;
  progressPercentage: number;
  lunarCycle: string;
  lives: number;
  maxLives: number;
}
