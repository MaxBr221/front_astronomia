// Catálogo Oficial do Vocabulário e Dicionário Astronômico Tupi-Guarani Potiguara

import { TermoDicionarioDTO } from '../types';

export const DICIONARIO_ASTRONOMICO: TermoDicionarioDTO[] = [
  {
    id: 'iasytata',
    tupi: 'Iasytatá',
    portugues: 'Estrela',
    categoria: 'astros',
    categoriaLabel: 'Astros & Céu',
    icone: '⭐',
    detalhe: 'Termo fundamental que designa qualquer estrela ou ponto de fogo celeste no firmamento noturno.'
  },
  {
    id: 'iasy',
    tupi: 'Iasy',
    portugues: 'Lua',
    categoria: 'lua',
    categoriaLabel: 'Lua & Ciclos',
    icone: '🌙',
    detalhe: 'A divindade e corpo celeste lunar (Jaci), soberana das marés, da gestação dos seres e do calendário das plantações.'
  },
  {
    id: 'kuarasy',
    tupi: 'Kuarasy',
    portugues: 'Sol',
    categoria: 'astros',
    categoriaLabel: 'Astros & Céu',
    icone: '☀️',
    detalhe: 'O Sol (Coaraci), astro-rei diurno doando calor, vitalidade à floresta e marcando as estações do ano.'
  },
  {
    id: 'jaguaresapy',
    tupi: 'Jaguaresapy',
    portugues: 'Estrela Antares (Alpha Scorpii)',
    categoria: 'estrelas',
    categoriaLabel: 'Estrelas Sagradas',
    icone: '🔴',
    detalhe: 'Estrela supergigante vermelha no coração do Escorpião ocidental. Na cosmovisão Tupi, é associada ao olho reluzente da onça/jaguar mítico.',
    regiaoCeleste: 'Constelação de Escorpião'
  },
  {
    id: 'jaguaresakoia',
    tupi: 'Jaguaresakõia',
    portugues: 'Estrela Aldebarã (Alpha Tauri)',
    categoria: 'estrelas',
    categoriaLabel: 'Estrelas Sagradas',
    icone: '🟠',
    detalhe: 'Estrela gigante laranja avermelhada na região de Touro. Na tradição do Homem Velho (Tuiba\'e), sinaliza a perna decepada vertendo o orvalho e as chuvas da fertilidade.',
    regiaoCeleste: 'Constelação de Touro / Tuiba\'e'
  },
  {
    id: 'suara',
    tupi: 'Suarã',
    portugues: 'Estrela Sírio (Alpha Canis Majoris)',
    categoria: 'estrelas',
    categoriaLabel: 'Estrelas Sagradas',
    icone: '💎',
    detalhe: 'A estrela mais brilhante de todo o céu noturno visual a olho nu, com cintilação azul-esbranquiçada vigorosa.',
    regiaoCeleste: 'Cão Maior'
  },
  {
    id: 'ybakybypa',
    tupi: 'Ybakybypá',
    portugues: 'Universo',
    categoria: 'universo',
    categoriaLabel: 'Cosmologia & Espaço',
    icone: '🌌',
    detalhe: 'A vastidão universal; a totalidade da criação cósmica que abrange os céus, as águas primordiais e a terra habitada.'
  },
  {
    id: 'tapiirape',
    tupi: 'Tapi’irapé',
    portugues: 'Via Láctea (Caminho da Anta)',
    categoria: 'universo',
    categoriaLabel: 'Cosmologia & Espaço',
    icone: '✨',
    detalhe: 'A galáxia Via Láctea. Para os antepassados, somente a Anta (Tapi\'ira), maior mamífero do Brasil, seria capaz de abrir uma estrada tão grandiosa no firmamento.',
    regiaoCeleste: 'Faixa Central da Via Láctea'
  },
  {
    id: 'iasytatatyba_galaxia',
    tupi: 'Iasytatatyba',
    portugues: 'Galáxia',
    categoria: 'universo',
    categoriaLabel: 'Cosmologia & Espaço',
    icone: '🌀',
    detalhe: 'Campo ou ajuntamento imenso de estrelas reunidas em um mesmo domínio celestial.'
  },
  {
    id: 'ybaka',
    tupi: 'Ybaka',
    portugues: 'Céu / Firmamento',
    categoria: 'universo',
    categoriaLabel: 'Cosmologia & Espaço',
    icone: '☁️',
    detalhe: 'O céu sagrado, morada dos seres ancestrais, dos trovões de Tupã e das constelações orientadoras.'
  },
  {
    id: 'iasytatabebe',
    tupi: 'Iasytatabebé',
    portugues: 'Estrela Cadente / Meteoro',
    categoria: 'astros',
    categoriaLabel: 'Astros & Céu',
    icone: '💫',
    detalhe: 'Literalmente "estrela que voa" (bebui/bebé). Trilha fugaz e veloz de luz deixada por meteoros no manto noturno.'
  },
  {
    id: 'iasytataguasu_pirapanema',
    tupi: 'Iasytataguasu / Pirapanema',
    portugues: 'Estrela-d’alva (Planeta Vênus)',
    categoria: 'astros',
    categoriaLabel: 'Astros & Céu',
    icone: '🌟',
    detalhe: 'Planeta Vênus quando brilha intensamente antes da aurora. Iasytataguasu significa "Grande Estrela"; Pirapanema liga-se à sabedoria ancestral das marés e peixes.'
  },
  {
    id: 'iasytatatyba_constelacao',
    tupi: 'Iasytatatyba',
    portugues: 'Constelação',
    categoria: 'constelacoes',
    categoriaLabel: 'Constelações & Figuras',
    icone: '🔭',
    detalhe: 'Configuração figurativa de estrelas que reflete animais, guardiões e narrativas cosmogônicas da aldeia.'
  },
  {
    id: 'kurusa',
    tupi: 'Kurusá / Kurusu',
    portugues: 'Cruzeiro do Sul',
    categoria: 'constelacoes',
    categoriaLabel: 'Constelações & Figuras',
    icone: '✝️',
    detalhe: 'Constelação do Cruzeiro do Sul. Na etnoastronomia indígena, suas estrelas demarcam a cabeça e bico da Ema Celeste (Guyrá Nhandu).',
    regiaoCeleste: 'Hemisfério Sul Celeste'
  },
  {
    id: 'tuibae',
    tupi: 'Tuiba’e',
    portugues: 'Ancião / Homem Velho',
    categoria: 'constelacoes',
    categoriaLabel: 'Constelações & Figuras',
    icone: '👴',
    detalhe: 'O sábio ancestral que segura um cajado. Seu surgimento a Leste no anoitecer de dezembro anuncia as chuvas no Norte e o verão no Sul do Brasil.',
    regiaoCeleste: 'Região de Touro e Órion'
  },
  {
    id: 'tapiira',
    tupi: 'Tapi’ira',
    portugues: 'Anta / Anta do Norte',
    categoria: 'constelacoes',
    categoriaLabel: 'Constelações & Figuras',
    icone: '🦏',
    detalhe: 'Inspirada no maior mamífero do Brasil. Constelação indígena totalmente contida no traçado denso da Via Láctea.',
    regiaoCeleste: 'Via Láctea Austral'
  },
  {
    id: 'nhandu',
    tupi: 'Nhandu (Guyrá Nhandu)',
    portugues: 'Ema Celeste',
    categoria: 'constelacoes',
    categoriaLabel: 'Constelações & Figuras',
    icone: '🦤',
    detalhe: 'Grande ave cósmica que funciona como calendário agrícola natural, situada entre o Cruzeiro do Sul e o Escorpião.',
    regiaoCeleste: 'Entre Cruzeiro do Sul e Escorpião'
  },
  {
    id: 'tingasu',
    tupi: 'Tingasu',
    portugues: 'Constelação do Pássaro Tingasu',
    categoria: 'constelacoes',
    categoriaLabel: 'Constelações & Figuras',
    icone: '🦅',
    detalhe: 'Constelação em forma de pássaro carregando as Plêiades nas costas, cujo bico (a estrela 31 de Áries) nasce 15 dias antes delas. Essa ave situa-se na mesma região de Pégaso, Andrômeda, Peixes, Triângulo e Áries.',
    regiaoCeleste: 'Região de Pégaso, Andrômeda, Peixes, Triângulo e Áries'
  },
  {
    id: 'iasyobaguasu',
    tupi: 'Iasyobaguasu',
    portugues: 'Lua Cheia',
    categoria: 'lua',
    categoriaLabel: 'Lua & Ciclos',
    icone: '🌕',
    detalhe: 'Fase da lua cheia ("face grande e cheia de luz"). Tempo de grandes marés na costa litorânea e claridade plena na mata.'
  },
  {
    id: 'iasysemamo',
    tupi: 'Iasysẽmamo',
    portugues: 'Lua Nova',
    categoria: 'lua',
    categoriaLabel: 'Lua & Ciclos',
    icone: '🌑',
    detalhe: 'Fase da lua nova (o surgimento primordial/renovação). Período de céu escuro ideal para visualizar o caminho das estrelas e nebulosas escuras.'
  },
  {
    id: 'iasykyrai',
    tupi: 'Iasykyra’ĩ',
    portugues: 'Lua Crescente',
    categoria: 'lua',
    categoriaLabel: 'Lua & Ciclos',
    icone: '🌓',
    detalhe: 'Fase da lua crescente (lua nova-jovem/tenra). Momento consagrado para semear sementes de milho e feijão de corda.'
  },
  {
    id: 'iasyangaibara',
    tupi: 'Iasyangaibara',
    portugues: 'Lua Minguante',
    categoria: 'lua',
    categoriaLabel: 'Lua & Ciclos',
    icone: '🌗',
    detalhe: 'Fase da lua minguante (lua que se recolhe e declina). Sinal tradicional para colheita de tubérculos e manejo das roças.'
  }
];
