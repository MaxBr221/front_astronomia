// Dados Mockados de Fallback estruturados exatamente no formato dos DTOs do Spring Boot

import { 
  UserBackendDTO, 
  ConstellationListItemDTO, 
  ConstellationDetailDTO, 
  ObservatoryGuideDTO, 
  ExerciseDTO 
} from '../types/backend';

export const MOCK_BACKEND_USER: UserBackendDTO = {
  id: 1,
  username: 'yara_potiguara',
  email: 'yara@potiguara.org',
  fullName: 'Yara Potiguara',
  avatarUrl: '/assets/tuira_avatar.jpg',
  level: 'Exploradora Cósmica • Nível 2',
  xp: 650,
  maxXp: 1000,
  lives: 3,
  maxLives: 3,
  lunarCycle: 'Lua Crescente (Jaci) • Estação das Chuvas',
  progressList: [
    { constellationCode: 'homem_velho', status: 'EM_PROGRESSO', progress: 85 },
    { constellationCode: 'ema_celeste', status: 'CONCLUIDO', progress: 95 },
    { constellationCode: 'caminho_antas', status: 'BLOQUEADO', progress: 40 },
    { constellationCode: 'veado', status: 'BLOQUEADO', progress: 0 }
  ]
};

export const MOCK_CONSTELLATIONS_LIST: ConstellationListItemDTO[] = [
  {
    code: 'homem_velho',
    title: 'HOMEM VELHO',
    indigenousName: 'Tuira',
    culture: 'Tronco Tupi / Potiguara',
    seasonInfo: 'Verão e Outono • Prenúncio das Chuvas',
    status: 'EM_PROGRESSO',
    progressPercentage: 85,
    westernEquivalence: 'Orion e Touro',
    climateMarker: 'Chegada das águas e época de semear o milho',
    stepsCount: 4,
    imageUrl: '/assets/tuira_orion.jpg'
  },
  {
    code: 'ema_celeste',
    title: 'A EMA CELESTE',
    indigenousName: 'Guyra Nhandu',
    culture: 'Tronco Tupi / Guarani',
    seasonInfo: 'Inverno Austral • Solstício',
    status: 'CONCLUIDO',
    progressPercentage: 95,
    westernEquivalence: 'Cruzeiro do Sul e Mosca',
    climateMarker: 'Solstício de inverno e marés altas de pesca',
    stepsCount: 3,
    imageUrl: '/assets/ema_celeste.jpg'
  },
  {
    code: 'caminho_antas',
    title: 'CAMINHO DAS ANTAS',
    indigenousName: 'Tapi\'i Rape (Via Láctea)',
    culture: 'Potiguara / Tupi-Guarani',
    seasonInfo: 'Visível ao longo do ano no zênite',
    status: 'BLOQUEADO',
    progressPercentage: 40,
    westernEquivalence: 'Faixa Central da Via Láctea',
    climateMarker: 'Orientação noturna e estrada dos espíritos',
    stepsCount: 3,
    imageUrl: '/assets/antas_milkyway.jpg'
  },
  {
    code: 'veado',
    title: 'O VEADO CELESTE',
    indigenousName: 'Guará Guasu',
    culture: 'Cosmologia Litorânea Potiguara',
    seasonInfo: 'Primavera e Noites Claras',
    status: 'BLOQUEADO',
    progressPercentage: 0,
    westernEquivalence: 'Escorpião e Sagitário',
    climateMarker: 'Tempo de renovação da flora e caçadas',
    stepsCount: 3,
    imageUrl: '/assets/starfield_bg.jpg'
  }
];

export const MOCK_CONSTELLATION_HOMEM_VELHO: ConstellationDetailDTO = {
  ...MOCK_CONSTELLATIONS_LIST[0],
  narrativeTupi: 'Tuira... Tamõi yvypóra ojekuaa yvategua, amana ruru.',
  narrativePt: 'O sábio Tuira, guerreiro ancestral cuja perna cortada reluz na estrela Aldebaran. Tupã o elevou aos céus com sua borduna para governar o ritmo imutável das estações, alertando a aldeia quando as primeiras chuvas chegam para nutrir o milharal.',
  audioTupiUrl: '/audio/tuira_tupi.mp3',
  audioPtUrl: '/audio/tuira_portugues.mp3',
  audioDurationSeconds: 135,
  stars: [
    { name: 'Betelgeuse', traditionalName: 'Ombro Esquerdo de Tuira', westernName: 'Alpha Orionis', brightness: '0.42 (Supergigante Vermelha)', description: 'Marca o peito e ombro do guerreiro', x: 35.8, y: 37, color: 'orange' },
    { name: 'Rigel', traditionalName: 'Perna Saudável', westernName: 'Beta Orionis', brightness: '0.18 (Supergigante Azul)', description: 'Perna esquerda firme no chão celeste', x: 50.4, y: 73.5, color: 'blue' },
    { name: 'Três Marias (Joykó)', traditionalName: 'Cinturão Sagrado', westernName: 'Alnitak, Alnilam, Mintaka', brightness: 'Aglomerado brilhante', description: 'Faixa de contas cerimoniais', x: 42, y: 55, color: 'white' },
    { name: 'Aldebaran', traditionalName: 'Perna Cortada de Tuira', westernName: 'Alpha Tauri', brightness: '0.85 (Gigante Laranja)', description: 'A ferida mítica que goteja chuva na terra', x: 59.5, y: 19, color: 'gold' },
    { name: 'Plêiades (Seichu)', traditionalName: 'Penacho de Plumas', westernName: 'M45', brightness: 'Aglomerado Aberto', description: 'O cocar cerimonial brilhante de Tuira', x: 67, y: 10, color: 'blue' }
  ],
  ecologicalCalendar: {
    indicator: 'O surgimento ao entardecer no horizonte Leste/Nordeste no início de dezembro anuncia o fim da estiagem.',
    planting: 'Sinal primordial para arar a terra e semear o milho, feijão de corda e macaxeira.',
    tidesAndFishing: 'Alinhamento com as marés de sizígia, ideal para currais de pesca na Baía da Traição.'
  }
};

export const MOCK_OBSERVATORY_HOMEM_VELHO: ObservatoryGuideDTO = {
  constellationCode: 'homem_velho',
  title: 'Guia de Observação Stellarium',
  subtitle: 'Localize Tuira no céu noturno ou no planetário virtual',
  narrator: 'Pajé Karai Potiguara • Aldeia São Francisco',
  audioTitle: 'Relato do Ancião: O Mapa Celeste de Tuira',
  audioDuration: '1:45',
  location: 'Baía da Traição - PB (Litoral Norte)',
  targetDate: '15 de Dezembro às 20h30 (ou 20 de Junho às 20h00)',
  azimuth: '72° ENE (Leste-Nordeste) / 160° Sudeste',
  altitude: '34° a 45° acima do horizonte',
  bestViewingSeason: 'Verão Potiguar (Dezembro a Março)',
  searchTerms: ['Betelgeuse', 'Rigel', 'Bellatrix', 'M42', 'Aldebaran'],
  steps: [
    {
      stepNumber: 1,
      title: 'Passo 1: Ajuste de Localização e Data',
      tag: 'Data & Hora',
      icon: '⏳',
      instruction: 'No menu lateral do Stellarium (F5), defina a data para a época de observação ideal:',
      value: '15 de Dezembro às 20h30 BRT (ou 20 de Junho)',
      detail: 'Tuira estará livre da poluição crepuscular do sol poente.'
    },
    {
      stepNumber: 2,
      title: 'Passo 2: Direção de Visada e Horizonte',
      tag: 'Posicionamento',
      icon: '🧭',
      instruction: 'Aponte o olhar para a direção Leste/Sudeste:',
      value: 'Azimute: 160° (Sudeste) • Altitude: 45°',
      detail: 'Centralize a visão entre 40° e 50° de elevação acima do horizonte litorâneo.'
    },
    {
      stepNumber: 3,
      title: 'Passo 3: Coordenadas e Busca Rápida',
      tag: 'Coordenadas RA/Dec',
      icon: '🔭',
      instruction: 'Abra a janela de localização (F3) e digite Rigel ou Betelgeuse:',
      value: 'RA: 05h 35m 17s | Dec: -05° 23\' 28" • Magnitude: 0.42',
      detail: 'Ative as linhas ocidentais para comparar como a cultura Potiguara unifica Orion e Touro.'
    }
  ],
  stellariumWebUrl: 'https://stellarium-web.org/',
  coordinatesText: 'RA 05h 35m 17s / Dec -05° 23\' 28"'
};

export const MOCK_EXERCISE_DATA: ExerciseDTO = {
  code: 'exercicio_associacao_ecologica',
  title: 'EXERCÍCIO: IDENTIFICAÇÃO & COSMOVISÃO POTIGUARA',
  subtitle: 'Combine as Constelações Potiguara aos seus Indicadores Ecológicos e Sazonais correspondentes.',
  questionStep: 'Questão 2 de 5',
  level: 'Nível: Intermediário',
  culturalIntro: 'Na ciência indígena, os astros nunca estão desconectados da terra. Cada constelação anuncia um evento vital para a sobrevivência da aldeia.',
  hint: 'Lembre-se dos ensinamentos do Pajé: Quando Tuira surge com seu bastão no nascente, ele derrama as lágrimas que regam a semente de milho na aldeia!',
  pairs: [
    {
      leftId: 'homem_velho',
      leftLabel: 'Homem Velho (Tuira)',
      leftNative: 'Tuira',
      leftIcon: '/assets/tuira_avatar.jpg',
      leftAudio: 'Tuira',
      leftTooltip: 'O sábio ancião que traz o prenúncio da água e fertilidade da terra.',
      rightId: 'chuvas_milho',
      rightLabel: 'Início da Estação Chuvosa e Plantio do Milho',
      rightSub: 'Sinal de preparação do solo e primeiras águas',
      rightIcon: '/assets/rain_season.jpg',
      rightColor: '#38bdf8'
    },
    {
      leftId: 'ema_celeste',
      leftLabel: 'A Ema Celeste (Guyra Nhandu)',
      leftNative: 'Guyra Nhandu',
      leftIcon: '/assets/ema_celeste.jpg',
      leftAudio: 'Guyra Nhandu',
      leftTooltip: 'A grande ave que tenta beber as águas da Via Láctea durante o solstício.',
      rightId: 'solsticio_mares',
      rightLabel: 'Solstício de Inverno e Cheia das Marés',
      rightSub: 'Marés altas de inverno e época de pesca costeira',
      rightIcon: '/assets/fishing_tides.jpg',
      rightColor: '#7c3aed'
    },
    {
      leftId: 'caminho_antas',
      leftLabel: 'Caminho das Antas (Via Láctea)',
      leftNative: 'Tapi\'i Rape',
      leftIcon: '/assets/antas_milkyway.jpg',
      leftAudio: 'Tapi\'i Rape',
      leftTooltip: 'A trilha luminosa por onde caminham os espíritos e a grande anta celeste.',
      rightId: 'estrada_antepassados',
      rightLabel: 'Estrada dos Antepassados e Orientação Noturna',
      rightSub: 'Trilha espiritual na faixa mais brilhante do céu',
      rightIcon: '/assets/corn_harvest.jpg',
      rightColor: '#f59e0b'
    },
    {
      leftId: 'veado',
      leftLabel: 'O Veado Celeste (Guará Guasu)',
      leftNative: 'Guará Guasu',
      leftIcon: '/assets/starfield_bg.jpg',
      leftAudio: 'Guará Guasu',
      leftTooltip: 'O guardião das matas e dos períodos de estiagem e noites limpas.',
      rightId: 'primavera_renovacao',
      rightLabel: 'Estiagem e Tempo de Renovação da Mata',
      rightSub: 'Noites secas e movimentação da fauna terrestre',
      rightIcon: '/assets/tuira_avatar.jpg',
      rightColor: '#10b981'
    }
  ]
};
