// Banco de Dados Mockado estruturado no formato das entidades do Spring Boot / PostgreSQL

import { ConstelacaoDTO, NoTrilhaDTO, GuiaStellariumDTO, ExercicioLigarColunasDTO, UsuarioDTO } from '../types';

export const INITIAL_USER: UsuarioDTO = {
  id: 'usr_potiguara_01',
  name: 'Yara R.',
  avatar: '/assets/tuira_avatar.jpg',
  level: 'Exploradora Cósmica • Nível 2',
  xp: 650,
  maxXp: 1000,
  progressPercentage: 65,
  lunarCycle: 'Lua Crescente (Jaci) • Estação das Chuvas',
  lives: 2,
  maxLives: 2,
};

export const INITIAL_TRAIL_NODES: Record<string, NoTrilhaDTO> = {
  homem_velho: {
    id: 'homem_velho',
    title: 'HOMEM VELHO',
    indigenousName: 'Tuira',
    subtitle: 'A Criação & Ciclos da Natureza',
    status: 'em_progresso',
    badgeLabel: 'LIBERADO',
    progress: 85,
    badges: [
      { icon: '🎧', text: 'Áudio do Ancião' },
      { icon: '📖', text: 'Lição Sagrada' },
      { icon: '🔭', text: 'Stellarium' },
      { icon: '✍️', text: 'Exercício' }
    ],
    image: '/assets/tuira_orion.jpg',
    starsEquiv: 'Orion e Touro'
  },
  ema_celeste: {
    id: 'ema_celeste',
    title: 'A EMA CELESTE',
    indigenousName: 'Guyra Nhandu',
    subtitle: 'O Mito & a Observação no RN',
    status: 'concluido',
    badgeLabel: 'MESTRE 🏆',
    progress: 95,
    badges: [
      { icon: '🎧', text: 'Áudio' },
      { icon: '📖', text: 'Lição' },
      { icon: '📺', text: 'Vídeo' }
    ],
    image: '/assets/ema_celeste.jpg',
    starsEquiv: 'Cruzeiro do Sul e Mosca'
  },
  caminho_antas: {
    id: 'caminho_antas',
    title: 'CAMINHO DAS ANTAS',
    indigenousName: 'Tapi\'i Rape (Via Láctea)',
    subtitle: 'A Via Láctea como trilha espiritual',
    status: 'bloqueado',
    badgeLabel: 'BLOQUEADO 🔒',
    progress: 40,
    badges: [
      { icon: '🎧', text: 'Áudio' },
      { icon: '📖', text: 'Lição' },
      { icon: '📺', text: 'Vídeo' }
    ],
    image: '/assets/antas_milkyway.jpg',
    starsEquiv: 'Via Láctea Austral'
  },
  cervo_celeste: {
    id: 'cervo_celeste',
    title: 'O CERVO CELESTE',
    indigenousName: 'Guará Guasu',
    subtitle: 'O guardião das matas e das noites claras',
    status: 'bloqueado',
    badgeLabel: 'BLOQUEADO 🔒',
    progress: 0,
    badges: [
      { icon: '🔒', text: 'Requer Nível 3' }
    ],
    image: '/assets/starfield_bg.jpg',
    starsEquiv: 'Escorpião e Sagitário'
  }
};

export const CONSTELACAO_HOMEM_VELHO: ConstelacaoDTO = {
  id: 'homem_velho',
  title: 'Constelação: O Homem Velho (Tuira)',
  tupiTitle: 'Tupã Ñamandú Tuira',
  tags: ['Astronomia Indígena Potiguara', 'Orion e Touro', 'Ciclos Sazonais'],
  starsEquiv: 'Orion e Touro',
  image: '/assets/tuira_orion.jpg',
  stars: [
    { name: 'Betelgeuse', indigenous: 'Ombro Esquerdo de Tuira', mag: '0.42 (Supergigante Vermelha)', x: 35.8, y: 37, color: 'orange' },
    { name: 'Rigel', indigenous: 'Perna Saudável de Tuira', mag: '0.18 (Supergigante Azul)', x: 50.4, y: 73.5, color: 'blue' },
    { name: 'Três Marias (Cinturão)', indigenous: 'Joykó (Cinturão Ancestral)', mag: 'Alnitak, Alnilam, Mintaka', x: 42, y: 55, color: 'white' },
    { name: 'Aldebaran', indigenous: 'O Olho de Muçurana (Perna Cortada)', mag: '0.85 (Gigante Laranja)', x: 59.5, y: 19, color: 'gold' },
    { name: 'Plêiades', indigenous: 'Seichu (Penacho de Plumas)', mag: 'Aglomerado Aberto M45', x: 67, y: 10, color: 'blue' }
  ],
  audioPlayer: {
    title: 'Pronúncia em Tupi e História em Português',
    tupiSnippet: 'Tuira... Tamõi yvypóra ojekuaa yvategua, amana ruru.',
    tupiPhonetics: '[Tu-i-rá... Ta-mo-ĩ y-vy-pó-ra o-je-ku-á-a y-va-te-guá]',
    tupiTranslation: '"Tuira... O Ancião Celeste surge no alto, prenunciando as águas fecundas."',
    portugueseNarration: 'O Homem Velho (Tuira) é uma das mais importantes constelações dos povos Tupi e Potiguara do Nordeste brasileiro. Ele personifica a sabedoria ancestral e o ritmo imutável da natureza.',
    duration: '2:15'
  },
  tabs: {
    historia: {
      id: 'historia',
      label: 'História & Cosmologia Potiguara',
      badge: 'Saber Ancestral',
      content: [
        {
          heading: 'O Mito do Sábio Tuira',
          text: 'Na cosmovisão Potiguara e dos povos do tronco Tupi, Tuira era um grande xamã e guerreiro respeitado por sua profunda intimidade com as matas e os rios. Segundo a tradição oral, ele era casado com uma mulher jovem que se apaixonou pelo cunhado. Em uma emboscada na mata, deceparam sua perna direita.'
        },
        {
          heading: 'A Elevação ao Céu por Tupã',
          text: 'Compadecidos pela injustiça contra o sábio que mantinha os rituais sagrados, os deuses elevaram Tuira ao céu eterno. Na mão esquerda ele segura seu bastão de guerra (borduna) e na cabeça ostenta o penacho de plumas (Plêiades). A perna cortada termina na estrela avermelhada Aldebaran, vertendo o sangue mítico que fertiliza a terra.'
        },
        {
          heading: 'Papel Espiritual na Aldeia',
          text: 'Para os Potiguara do litoral norte da Paraíba e Rio Grande do Norte, avistar Tuira orienta as estações, a preparação do roçado e os ritos de passagem.'
        }
      ]
    },
    equivalencia: {
      id: 'equivalencia',
      label: 'Equivalência Ocidental (Orion e Touro)',
      badge: 'Ciência Moderna',
      content: [
        {
          heading: 'Mapeamento com as Constelações Ocidentais',
          text: 'Enquanto a astronomia greco-romana divide esta região entre as constelações de Órion e Touro, a etnoastronomia Potiguara unifica ambas em uma única figura cósmica grandiosa.'
        },
        {
          heading: 'Tabela de Equivalência Estelar',
          table: [
            { elemento: 'Cabeça e Penacho', ocidental: 'Plêiades e estrelas de Touro', significado: 'Seichu (Penas cerimoniais)' },
            { elemento: 'Braço e Borduna', ocidental: 'Bellatrix e Betelgeuse (Alpha Orionis)', significado: 'Braço com a borduna sagrada' },
            { elemento: 'Cinturão', ocidental: 'Três Marias (Alnitak, Alnilam, Mintaka)', significado: 'Joykó (faixa de contas ancestrais)' },
            { elemento: 'Perna Saudável', ocidental: 'Rigel (Beta Orionis) e Saiph', significado: 'Perna esquerda firme no chão do céu' },
            { elemento: 'Perna Cortada', ocidental: 'Aldebaran e Híades (Touro)', significado: 'A ferida mítica e o corte sagrado' }
          ]
        },
        {
          heading: 'Visibilidade no Hemisfério Sul',
          text: 'Betelgeuse brilha com tom avermelhado quente (supergigante vermelha), enquanto Rigel reluz em azul potente. No Nordeste brasileiro, a constelação reina no céu durante o verão e outono.'
        }
      ]
    },
    calendario: {
      id: 'calendario',
      label: 'Calendário de Plantio & Clima',
      badge: 'Indicadores Ecológicos',
      content: [
        {
          heading: 'O Prenúncio da Estação Chuvosa',
          text: 'Quando o Homem Velho surge ao entardecer no horizonte Leste/Nordeste no início de dezembro, ele sinaliza a transição sazonal e a chegada das primeiras precipitações no litoral e agreste potiguar.'
        },
        {
          heading: 'Orientação para o Plantio do Milho e Mandioca',
          text: 'Os mais velhos da aldeia ensinam: com Tuira visível, a terra deve ser preparada para receber as sementes de milho e ramas de macaxeira. A umidade iminente garante a germinação fértil.'
        },
        {
          heading: 'Regime de Marés e Pesca Artesanal',
          text: 'O ângulo de inclinação de Tuira coincide com as marés de sizígia na Baía da Traição, determinando o período ideal para os currais de pesca e a mariscagem nos manguezais.'
        }
      ]
    }
  }
};

export const GUIA_STELLARIUM_HOMEM_VELHO: GuiaStellariumDTO = {
  constellationId: 'homem_velho',
  title: 'Guia de Observação Stellarium',
  subtitle: 'Localize Tuira no céu noturno ou no planetário virtual',
  narrator: 'Pajé Karai Potiguara • Aldeia São Francisco',
  audioTitle: 'Relato do Ancião: O Mapa Celeste de Tuira',
  duration: '1:45',
  audioMarkers: [
    { time: '0:00', label: 'Saudação Ancestral' },
    { time: '0:25', label: 'Localizando as Três Marias' },
    { time: '0:55', label: 'Identificando a Perna Cortada' },
    { time: '1:20', label: 'O Sinal das Chuvas' }
  ],
  steps: [
    {
      number: 1,
      title: 'Passo 1: Ajuste de Tempo e Data',
      tag: 'Data & Hora',
      icon: '⏳',
      instruction: 'No menu lateral do Stellarium (atalho F5), defina a data para a época de observação ideal:',
      value: '20 de Junho • 20h00 BRT (ou 15 de Dezembro às 21h30)',
      detail: 'Nesta época Tuira está elevado e livre da luz crepuscular do sol.'
    },
    {
      number: 2,
      title: 'Passo 2: Direção de Visada e Horizonte',
      tag: 'Posicionamento',
      icon: '🧭',
      instruction: 'Aponte o olhar para a direção Sudeste / Leste:',
      value: 'Azimute: 160° (Sudeste) • Altitude: 45° acima do horizonte',
      detail: 'Centralize a visão entre 40° e 50° de elevação acima do horizonte litorâneo.'
    },
    {
      number: 3,
      title: 'Passo 3: Coordenadas e Busca Rápida',
      tag: 'Coordenadas RA/Dec',
      icon: '🔭',
      instruction: 'Abra a janela de localização (atalho F3) e digite Rigel ou Betelgeuse:',
      value: 'RA: 05h 35m 17s | Dec: -05° 23\' 28" • Magnitude: 0.42',
      detail: 'Ative as linhas ocidentais (C) para comparar como a cultura Potiguara unifica Orion e Touro.'
    }
  ],
  stellariumWebUrl: 'https://stellarium-web.org/',
  coordinatesText: 'RA 05h 35m 17s / Dec -05° 23\' 28"'
};

export const EXERCICIO_LIGAR_COLUNAS: ExercicioLigarColunasDTO = {
  id: 'exercicio_1',
  title: 'EXERCÍCIO: IDENTIFICAÇÃO & COSMOVISÃO POTIGUARA',
  subtitle: 'Combine as Constelações Potiguara aos seus Indicadores Ecológicos e Sazonais.',
  questionStep: 'Questão 2 de 5',
  level: 'Nível: Intermediário',
  lives: 2,
  leftItems: [
    {
      id: 'homem_velho',
      name: 'Homem Velho (Tuira)',
      nativeName: 'Tuira',
      icon: '/assets/tuira_avatar.jpg',
      audioText: 'Tuira',
      tooltip: 'O sábio ancião que traz o prenúncio da água e a fertilidade da terra.'
    },
    {
      id: 'ema_celeste',
      name: 'A Ema Celeste (Guyra Nhandu)',
      nativeName: 'Guyra Nhandu',
      icon: '/assets/ema_celeste.jpg',
      audioText: 'Guyra Nhandu',
      tooltip: 'A grande ave que tenta beber as águas da Via Láctea durante o solstício.'
    },
    {
      id: 'caminho_antas',
      name: 'Caminho das Antas (Via Láctea)',
      nativeName: 'Tapi\'i Rape',
      icon: '/assets/antas_milkyway.jpg',
      audioText: 'Tapi\'i Rape',
      tooltip: 'A trilha luminosa por onde caminham os espíritos e a grande anta celeste.'
    }
  ],
  rightItems: [
    {
      id: 'chuvas_milho',
      title: 'Início da Estação Chuvosa e Plantio do Milho',
      subtitle: 'Sinal de preparação do solo e primeiras águas',
      icon: '/assets/rain_season.jpg',
      color: '#38bdf8'
    },
    {
      id: 'solsticio_mares',
      title: 'Solstício de Inverno e Cheia das Marés',
      subtitle: 'Marés altas de inverno e época de pesca costeira',
      icon: '/assets/fishing_tides.jpg',
      color: '#7c3aed'
    },
    {
      id: 'estrada_antepassados',
      title: 'Estrada dos Antepassados e Orientação Noturna',
      subtitle: 'Trilha espiritual na faixa mais brilhante do céu',
      icon: '/assets/corn_harvest.jpg',
      color: '#f59e0b'
    }
  ],
  correctMatches: {
    homem_velho: 'chuvas_milho',
    ema_celeste: 'solsticio_mares',
    caminho_antas: 'estrada_antepassados'
  },
  hint: 'Lembre-se dos ensinamentos do Pajé: Quando o Homem Velho (Tuira) surge no nascente, suas lágrimas de chuva regam a semente de milho na aldeia!',
  feedbackSuccess: {
    title: 'Excelente Conexão Ancestral!',
    xpReward: 150,
    message: 'Você compreendeu profundamente a relação entre as constelações Potiguara, o calendário das águas e os ciclos ecológicos da Mata Atlântica e do Litoral!'
  }
};
