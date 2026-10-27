import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { constellationService } from '../services/constellationService';
import { ConstellationDetailDTO } from '../types/backend';
import { CONSTELACAO_HOMEM_VELHO } from '../services/mockDatabase';
import { MOCK_CONSTELLATION_HOMEM_VELHO } from '../services/mockBackendData';
import { audioSystem } from '../utils/audioSystem';
import { FullscreenViewerModal } from '../components/constellation/FullscreenViewerModal';

export const ConstelacaoPage: React.FC = () => {
  const { navigateTo } = useApp();
  const fallbackData = CONSTELACAO_HOMEM_VELHO;

  // Inicia com dados já prontos para nunca ficar tela preta/vazia
  const [detail, setDetail] = useState<ConstellationDetailDTO>(MOCK_CONSTELLATION_HOMEM_VELHO);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'historia' | 'equivalencia' | 'calendario' | 'fontes'>('historia');
  const [fonteFilter, setFonteFilter] = useState<'todas' | 'tuiba' | 'tapiira' | 'tapiirape' | 'nhandu'>('todas');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioLang, setAudioLang] = useState<'tupi' | 'pt'>('tupi');
  const [audioProgress, setAudioProgress] = useState<number>(28);
  const [showStars, setShowStars] = useState<boolean>(true);
  const [showArt, setShowArt] = useState<boolean>(true);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadConstellation() {
      setIsUpdating(true);
      try {
        const res = await constellationService.getConstellationByCode('homem_velho');
        if (isMounted && res) {
          setDetail(prev => ({
            ...prev,
            ...res,
            stars: (res.stars && res.stars.length > 0) ? res.stars : prev.stars
          }));
        }
      } catch (err) {
        console.warn('Usando dados de contingência para constelação:', err);
      } finally {
        if (isMounted) {
          setIsUpdating(false);
        }
      }
    }
    loadConstellation();
    return () => {
      isMounted = false;
    };
  }, []);

  // Controle de reprodução do áudio bilíngue
  const toggleAudio = () => {
    const nextState = !isPlayingAudio;
    setIsPlayingAudio(nextState);

    if (nextState) {
      if (audioLang === 'tupi') {
        const text = detail?.narrativeTupi || "Tuira... Tamõi yvypóra ojekuaa yvategua, amana ruru.";
        audioSystem.speak(text);
      } else {
        const text = detail?.narrativePt || "O Homem Velho, Tuira, é a constelação indígena que anuncia as chuvas e a época fértil de plantar o milho.";
        audioSystem.speak(text);
      }
    } else {
      audioSystem.stopSpeech();
    }
  };

  useEffect(() => {
    let timer: number | undefined;
    if (isPlayingAudio) {
      timer = window.setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            audioSystem.stopSpeech();
            return 0;
          }
          return prev + 1.5;
        });
      }, 500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlayingAudio]);

  const handleLangChange = (lang: 'tupi' | 'pt') => {
    audioSystem.playClick();
    setAudioLang(lang);
    if (isPlayingAudio) {
      audioSystem.stopSpeech();
      if (lang === 'tupi') {
        audioSystem.speak(detail?.narrativeTupi || "Tuira... Tamõi yvypóra ojekuaa yvategua, amana ruru.");
      } else {
        audioSystem.speak(detail?.narrativePt || "O Homem Velho, Tuira, é a constelação indígena que anuncia as chuvas e a época fértil de plantar o milho.");
      }
    }
  };

  const totalSec = detail?.audioDurationSeconds || 135;
  const curSec = Math.floor((audioProgress / 100) * totalSec);
  const mins = Math.floor(curSec / 60);
  const secs = curSec % 60;
  const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  const title = detail?.title || fallbackData.title;
  const indigenousName = detail?.indigenousName || fallbackData.tupiTitle;
  const westernEquiv = detail?.westernEquivalence || fallbackData.starsEquiv;
  
  // Lista de estrelas ultra segura contra nulos
  const starsList = (detail?.stars && detail.stars.length > 0)
    ? detail.stars
    : fallbackData.stars.map(s => ({
        name: s.name,
        traditionalName: s.indigenous,
        westernName: s.name,
        brightness: s.mag,
        description: '',
        x: s.x,
        y: s.y,
        color: s.color
      }));

  return (
    <div className="screen-wrapper">
      {/* Navegação Superior */}
      <div className="page-navigation-bar">
        <button
          className="btn-back"
          onClick={() => {
            if (isPlayingAudio) toggleAudio();
            navigateTo('trilha');
          }}
        >
          ← Voltar para a Trilha
        </button>
        <div className="screen-breadcrumbs">
          Trilha Celeste &gt; <span>Ficha da Constelação</span>
        </div>
      </div>

      {/* Cabeçalho da Constelação */}
      <div className="constellation-header">
        <div className="constellation-meta-tags">
          <span className="node-status-badge badge-in-progress">Constelação Guia</span>
          <span className="constellation-region-badge">
            Região Celeste: {westernEquiv}
          </span>
          {isUpdating && (
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold-light)', fontStyle: 'italic' }}>
              • Sincronizando com o Firmamento...
            </span>
          )}
        </div>
        <h2>{title}</h2>
        <div className="native-title">
          {indigenousName} • Guardião das Águas e dos Ciclos Sazonais
        </div>
      </div>

      {/* Grid: Visualizador Celeste + Abas de Conhecimento */}
      <div className="constellation-grid">
        
        {/* Coluna Esquerda: Visualizador + Player de Áudio */}
        <div className="viewer-column">
          <div className="celestial-viewer-card">
            <div className="viewer-media-wrapper" id="viewer-wrapper">
              <img
                src={fallbackData.image || '/assets/tuira_orion.jpg'}
                alt="Constelação Tuira sobre Orion"
                id="viewer-img"
                style={{ filter: showArt ? 'none' : 'contrast(1.4) brightness(0.7) hue-rotate(180deg)' }}
              />

              {/* Toggles de Camada */}
              <div className="viewer-overlay-toggles">
                <button
                  className={`toggle-chip ${showArt ? 'active' : ''}`}
                  onClick={() => {
                    audioSystem.playClick();
                    setShowArt(!showArt);
                  }}
                >
                  🎨 Arte
                </button>
                <button
                  className={`toggle-chip ${showStars ? 'active' : ''}`}
                  onClick={() => {
                    audioSystem.playClick();
                    setShowStars(!showStars);
                  }}
                >
                  ⭐ Estrelas
                </button>
                <button
                  className="toggle-chip"
                  onClick={() => {
                    audioSystem.playClick();
                    setIsFullscreenModalOpen(true);
                  }}
                >
                  ⛶ Expandir
                </button>
              </div>

              {/* Hotspots das Estrelas com Tooltips seguros */}
              {showStars && (
                <div className="star-interactive-overlay">
                  {starsList.map((s, idx) => {
                    const starName = s?.name || s?.westernName || 'Estrela';
                    const starTrad = s?.traditionalName || s?.westernName || '';
                    const isOrange = starName.toLowerCase().includes('betelgeuse') || starName.toLowerCase().includes('aldebaran');

                    return (
                      <div
                        key={idx}
                        className={`star-point ${isOrange ? 'orange' : ''}`}
                        style={{ top: `${s?.y ?? 50}%`, left: `${s?.x ?? 50}%` }}
                        title={`${starName} (${starTrad}) - Mag: ${s?.brightness || 'Brilhante'}`}
                      >
                        <div className="star-dot" />
                        <div className="star-label">{starName}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Barra Inferior com Legenda */}
            <div className="viewer-bottom-bar">
              <div className="viewer-legend-dots">
                <div className="legend-item">
                  <span className="dot" style={{ background: '#f97316', boxShadow: '0 0 8px #f97316' }} />
                  <span>Betelgeuse (Ombro)</span>
                </div>
                <div className="legend-item">
                  <span className="dot" style={{ background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
                  <span>Rigel (Perna Sadia)</span>
                </div>
                <div className="legend-item">
                  <span className="dot" style={{ background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
                  <span>Aldebaran (Perna Cortada)</span>
                </div>
              </div>
              <span className="viewer-hint-text" style={{ fontSize: '0.74rem', color: 'var(--accent-gold-light)' }}>
                Passe o mouse nas estrelas
              </span>
            </div>
          </div>

          {/* Player Bilíngue Simulado Conectado à API */}
          <div className="bilingual-player-card">
            <div className="player-header">
              <div className="player-title-box">
                <div className="player-sound-wave-icon">🎧</div>
                <div>
                  <h4>Player Bilíngue da Tradição</h4>
                  <p>Pronúncia nativa em Tupi e narração em Português</p>
                </div>
              </div>

              {/* Seletor de Idioma */}
              <div className="player-language-selector">
                <button
                  className={`lang-btn ${audioLang === 'tupi' ? 'active' : ''}`}
                  onClick={() => handleLangChange('tupi')}
                >
                  🏹 Tupi
                </button>
                <button
                  className={`lang-btn ${audioLang === 'pt' ? 'active' : ''}`}
                  onClick={() => handleLangChange('pt')}
                >
                  🇵🇹 Português
                </button>
              </div>
            </div>

            {/* Controles do Player */}
            <div className="player-controls-row">
              <button
                className="btn-play-pause"
                onClick={toggleAudio}
                title={isPlayingAudio ? 'Pausar narração' : 'Tocar narração'}
              >
                {isPlayingAudio ? '⏸' : '▶'}
              </button>

              <div className="player-scrubber-container">
                <div className="scrubber-track">
                  <div
                    className="scrubber-progress"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
                <div className="player-time-row">
                  <span>{timeFormatted}</span>
                  <span>{mins}:{totalSec % 60 < 10 ? '0' : ''}{totalSec % 60}</span>
                </div>
              </div>
            </div>

            {/* Transcrição Dinâmica */}
            <div className="player-transcript-box">
              {audioLang === 'tupi' ? (
                <>
                  "{detail?.narrativeTupi || fallbackData.audioPlayer.tupiSnippet}"<br />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Tradução: {fallbackData.audioPlayer.tupiTranslation}
                  </span>
                </>
              ) : (
                <>"{detail?.narrativePt || fallbackData.audioPlayer.portugueseNarration}"</>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Abas de Conhecimento & Ações */}
        <div className="knowledge-tabs-card">
          <div>
            {/* Botões das Abas */}
            <div className="knowledge-tab-buttons">
              <button
                className={`tab-btn ${activeTab === 'historia' ? 'active' : ''}`}
                onClick={() => {
                  audioSystem.playClick();
                  setActiveTab('historia');
                }}
              >
                📖 História & Cosmologia Potiguara
              </button>
              <button
                className={`tab-btn ${activeTab === 'equivalencia' ? 'active' : ''}`}
                onClick={() => {
                  audioSystem.playClick();
                  setActiveTab('equivalencia');
                }}
              >
                🔭 Equivalência Ocidental
              </button>
              <button
                className={`tab-btn ${activeTab === 'calendario' ? 'active' : ''}`}
                onClick={() => {
                  audioSystem.playClick();
                  setActiveTab('calendario');
                }}
              >
                🌧️ Calendário Ecológico & Clima
              </button>
              <button
                className={`tab-btn ${activeTab === 'fontes' ? 'active' : ''}`}
                onClick={() => {
                  audioSystem.playClick();
                  setActiveTab('fontes');
                }}
              >
                📚 Fontes & Registros Didáticos
              </button>
            </div>

            {/* Conteúdo da Aba Ativa */}
            <div className="tab-content-area">
              {activeTab === 'historia' && (
                <>
                  <div className="tab-content-heading">Cosmovisão Ancestral & A Origem de Tuira</div>
                  <div style={{ marginBottom: '14px' }}>
                    <h4 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '0.96rem', marginBottom: '4px' }}>
                      O Mito do Homem Velho e o Casamento Proibido
                    </h4>
                    <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.55' }}>
                      {detail?.narrativePt || fallbackData.tabs?.historia?.content?.[0]?.text || 'O sábio Tuira, guerreiro ancestral cuja perna cortada reluz na estrela Aldebaran.'}
                    </p>
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '0.96rem', marginBottom: '4px' }}>
                      A Perna Cortada e o Surgimento no Nascente
                    </h4>
                    <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.55' }}>
                      {fallbackData.tabs?.historia?.content?.[1]?.text || 'A perna cortada termina na estrela avermelhada Aldebaran, vertendo o sangue mítico que fertiliza a terra.'}
                    </p>
                  </div>
                </>
              )}

              {activeTab === 'fontes' && (
                <div className="fontes-tab-container">
                  <div className="tab-content-heading">Registros da Astronomia Cultural & Fontes Didáticas</div>
                  
                  {/* Contexto Introdutório */}
                  <div className="fontes-intro-card">
                    <span className="fontes-intro-tag">Sequência Didática & Tradição Oral</span>
                    <p>
                      Mapeamento fundamentado na pesquisa acadêmica de <strong>Furtado, Pacheco & Igna (2024)</strong> sobre etnoastronomia no Ensino Médio, somado aos relatos ancestrais do tronco Tupi (Neves, 2007).
                    </p>
                  </div>

                  {/* Filtro Rápido entre as Figuras Celestes */}
                  <div className="fontes-filter-pills">
                    <button
                      className={`filter-pill-btn ${fonteFilter === 'todas' ? 'active' : ''}`}
                      onClick={() => {
                        audioSystem.playClick();
                        setFonteFilter('todas');
                      }}
                    >
                      ✨ Todas as 4 Figuras
                    </button>
                    <button
                      className={`filter-pill-btn ${fonteFilter === 'tuiba' ? 'active' : ''}`}
                      onClick={() => {
                        audioSystem.playClick();
                        setFonteFilter('tuiba');
                      }}
                    >
                      👴 Tuiba’e (Homem Velho)
                    </button>
                    <button
                      className={`filter-pill-btn ${fonteFilter === 'tapiira' ? 'active' : ''}`}
                      onClick={() => {
                        audioSystem.playClick();
                        setFonteFilter('tapiira');
                      }}
                    >
                      🦏 Tapi’ira (Anta do Norte)
                    </button>
                    <button
                      className={`filter-pill-btn ${fonteFilter === 'tapiirape' ? 'active' : ''}`}
                      onClick={() => {
                        audioSystem.playClick();
                        setFonteFilter('tapiirape');
                      }}
                    >
                      🌌 Tapi’irapé (Caminho da Anta)
                    </button>
                    <button
                      className={`filter-pill-btn ${fonteFilter === 'nhandu' ? 'active' : ''}`}
                      onClick={() => {
                        audioSystem.playClick();
                        setFonteFilter('nhandu');
                      }}
                    >
                      🦤 Nhandu (Ema)
                    </button>
                  </div>

                  {/* Lista de Registros */}
                  <div className="fontes-cards-list">
                    {/* 1. Tuiba'e – Homem Velho */}
                    {(fonteFilter === 'todas' || fonteFilter === 'tuiba') && (
                      <div className="fonte-item-card" id="card-tuiba">
                        <div className="fonte-card-top">
                          <div className="fonte-title-group">
                            <span className="fonte-figure-icon">👴</span>
                            <div>
                              <h4 className="fonte-figure-title">Tuiba’e – homem velho</h4>
                              <span className="fonte-region-badge">Região de Touro e Órion • Verão no Sul & Chuvas no Norte</span>
                            </div>
                          </div>
                          <button
                            className="btn-pronounce-small"
                            onClick={() => audioSystem.speak("Tuiba'e... Homem Velho.")}
                            title="Ouvir pronúncia"
                          >
                            🔊 Ouvir
                          </button>
                        </div>

                        <p className="fonte-description-text">
                          A constelação indígena do Homem Velho (<em>Tuiba'e</em>), localizada na região de Touro e Órion, tem a forma de um idoso com um bastão. Seu surgimento total ao anoitecer, na segunda quinzena de dezembro ao Leste, sinaliza o início do verão no sul do Brasil e da estação chuvosa no Norte.
                        </p>

                        <div className="fonte-academic-citation">
                          <div className="citation-header">
                            <span>📖 Fonte:</span>
                          </div>
                          <p className="citation-text">
                            FURTADO, Kenedy Daniel Calegari; PACHECO, Hualan Patrício; IGNA, Fernando Dall. <strong>Astronomia Cultural no Ensino Médio: Uma Sequência Didática para a abordagem das constelações celestes indígenas</strong>. Revista Latino-Americana de Educação em Astronomia, n. 38, p. 61-91, 2024.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 2. Tapi'ira – Anta do Norte */}
                    {(fonteFilter === 'todas' || fonteFilter === 'tapiira') && (
                      <div className="fonte-item-card" id="card-tapiira" style={{ borderLeftColor: '#38bdf8' }}>
                        <div className="fonte-card-top">
                          <div className="fonte-title-group">
                            <span className="fonte-figure-icon">🦏</span>
                            <div>
                              <h4 className="fonte-figure-title">Tapi’ira – Anta do Norte</h4>
                              <span className="fonte-region-badge" style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)' }}>
                                Totalmente contida na Via Láctea • Maior Mamífero do Brasil
                              </span>
                            </div>
                          </div>
                          <button
                            className="btn-pronounce-small"
                            onClick={() => audioSystem.speak("Tapi'ira... Anta do Norte.")}
                            title="Ouvir pronúncia"
                          >
                            🔊 Ouvir
                          </button>
                        </div>

                        <p className="fonte-description-text">
                          Inspirada no maior mamífero do Brasil, a constelação indígena Anta do Norte fica totalmente contida na Via Láctea, cuja estrutura ajuda a definir seu contorno visual marcante. Ela recebe esse nome específico para se diferenciar de outras constelações da Anta também presentes na galáxia.
                        </p>

                        <div className="fonte-academic-citation">
                          <div className="citation-header">
                            <span>📖 Fonte:</span>
                          </div>
                          <p className="citation-text">
                            FURTADO, Kenedy Daniel Calegari; PACHECO, Hualan Patrício; IGNA, Fernando Dall. <strong>Astronomia Cultural no Ensino Médio: Uma Sequência Didática para a abordagem das constelações celestes indígenas</strong>. Revista Latino-Americana de Educação em Astronomia, n. 38, p. 61-91, 2024.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 3. Tapi'irapé – O Caminho da Anta */}
                    {(fonteFilter === 'todas' || fonteFilter === 'tapiirape') && (
                      <div className="fonte-item-card" id="card-tapiirape" style={{ borderLeftColor: '#c084fc' }}>
                        <div className="fonte-card-top">
                          <div className="fonte-title-group">
                            <span className="fonte-figure-icon">🌌</span>
                            <div>
                              <h4 className="fonte-figure-title">Tapi’irapé – O Caminho da Anta</h4>
                              <span className="fonte-region-badge" style={{ borderColor: 'rgba(192, 132, 252, 0.4)', color: '#c084fc', background: 'rgba(192, 132, 252, 0.08)' }}>
                                A Galáxia Via Láctea • Mito Suruí (Tronco Tupi)
                              </span>
                            </div>
                          </div>
                          <button
                            className="btn-pronounce-small"
                            onClick={() => audioSystem.speak("Tapi'irapé... O Caminho da Anta.")}
                            title="Ouvir pronúncia"
                          >
                            🔊 Ouvir
                          </button>
                        </div>

                        <p className="fonte-description-text">
                          Para nossos antepassados, somente a anta, maior mamífero do Brasil, poderia abrir um caminho tão grande no céu. Por isso, chamavam a nossa galáxia de Caminho da Anta (<em>tapi’irapé</em>).
                        </p>

                        <div className="fonte-potiguara-note">
                          Entre o nosso povo Potiguara do século XXI, infelizmente não sobreviveu nenhuma lenda, conto ou mito relacionado ao Caminho da Anta. Todavia, o povo Suruí, que também é do tronco tupi, tem um mito um tanto curioso sobre isso:
                        </div>

                        <div className="surui-myth-box">
                          <p className="surui-myth-text">
                            “Os animais estavam cuidando de suas vidas na floresta, como sempre faziam. De repente, ouviram um canto muito bonito vindo do céu. Mas, como a maioria não voava, pensaram logo em construir uma escada. Alguns animais, dentre eles a anta, lançaram suas flechas em direção ao céu, mas não conseguiam acertar uma atrás da outra para montar a escada. Então, lembraram-se do tatu, ele era considerado o melhor atirador, um craque. O tatuzinho veio e com suas flechas conseguiu fazer o caminho para o céu e todos os animais foram ver de perto o pássaro cantar. Na hora de voltar, todos procuraram o caminho, mas agoniados, entraram ao mesmo tempo. Quando a anta foi entrando, pelo peso da bicha as flechas se partiram. Alguns animais caíram na floresta e viraram caça para a gente comer. Outros ficaram no céu, presos no caminho da anta.”
                          </p>
                          <div className="myth-attribution">— (NEVES, 2007, p. 2)</div>
                        </div>

                        <div className="fonte-academic-citation">
                          <div className="citation-header">
                            <span>📖 Referências:</span>
                          </div>
                          <p className="citation-text">
                            • FURTADO, Kenedy Daniel Calegari; PACHECO, Hualan Patrício; IGNA, Fernando Dall. <strong>Astronomia Cultural no Ensino Médio: Uma Sequência Didática para a abordagem das constelações celestes indígenas</strong>. Revista Latino-Americana de Educação em Astronomia, n. 38, p. 61-91, 2024.<br />
                            • NEVES, I. dos S. (2007). <strong>Tapirapé: discurso fundador da identidade tupi</strong>. Revista do SETA, 1. ISSN 1981-9153.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 4. Nhandu – Ema */}
                    {(fonteFilter === 'todas' || fonteFilter === 'nhandu') && (
                      <div className="fonte-item-card" id="card-nhandu" style={{ borderLeftColor: '#34d399' }}>
                        <div className="fonte-card-top">
                          <div className="fonte-title-group">
                            <span className="fonte-figure-icon">🦤</span>
                            <div>
                              <h4 className="fonte-figure-title">Nhandu – Ema</h4>
                              <span className="fonte-region-badge" style={{ borderColor: 'rgba(52, 211, 153, 0.4)', color: '#34d399', background: 'rgba(52, 211, 153, 0.08)' }}>
                                Entre Cruzeiro do Sul e Escorpião • Calendário Agrícola Natural
                              </span>
                            </div>
                          </div>
                          <button
                            className="btn-pronounce-small"
                            onClick={() => audioSystem.speak("Guyrá Nhandu... A Ema Celeste.")}
                            title="Ouvir pronúncia"
                          >
                            🔊 Ouvir
                          </button>
                        </div>

                        <p className="fonte-description-text">
                          Para os povos Tupi-Guarani, a abóboda celeste funciona como um calendário agrícola natural. Um dos seus principais referenciais é a constelação da Ema (<em>Guyrá Nhandu</em>) localizada no trecho celeste situado entre o Cruzeiro do Sul e o Escorpião.
                        </p>

                        <div className="fonte-academic-citation">
                          <div className="citation-header">
                            <span>📖 Fonte:</span>
                          </div>
                          <p className="citation-text">
                            FURTADO, Kenedy Daniel Calegari; PACHECO, Hualan Patrício; IGNA, Fernando Dall. <strong>Astronomia Cultural no Ensino Médio: Uma Sequência Didática para a abordagem das constelações celestes indígenas</strong>. Revista Latino-Americana de Educação em Astronomia, n. 38, p. 61-91, 2024.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'equivalencia' && (
                <>
                  <div className="tab-content-heading">Correspondência Astronômica Ocidental</div>
                  <p style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>
                    {fallbackData.tabs?.equivalencia?.content?.[0]?.text || 'Enquanto a astronomia ocidental separa em Órion e Touro, a etnoastronomia Potiguara unifica ambas em Tuira.'}
                  </p>

                  <div className="equivalencia-table-wrapper">
                    <table className="equivalencia-table">
                      <thead>
                        <tr>
                          <th>Parte de Tuira</th>
                          <th>Estrelas Ocidentais</th>
                          <th>Sentido Cosmológico</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(fallbackData.tabs?.equivalencia?.content?.[1]?.table || [
                          { elemento: 'Cabeça e Penacho', ocidental: 'Plêiades e Touro', significado: 'Seichu (Penas cerimoniais)' },
                          { elemento: 'Braço e Borduna', ocidental: 'Betelgeuse e Bellatrix', significado: 'Braço com a borduna sagrada' },
                          { elemento: 'Cinturão', ocidental: 'Três Marias', significado: 'Joykó (faixa de contas)' },
                          { elemento: 'Perna Saudável', ocidental: 'Rigel', significado: 'Perna firme no chão do céu' },
                          { elemento: 'Perna Cortada', ocidental: 'Aldebaran', significado: 'A ferida mítica e fertilidade' }
                        ]).map((row, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 700, color: '#fff' }}>{row.elemento}</td>
                            <td>
                              <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{row.ocidental}</span>
                            </td>
                            <td>{row.significado}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p style={{ color: '#cbd5e1', fontSize: '0.86rem', marginTop: '10px' }}>
                    {fallbackData.tabs?.equivalencia?.content?.[2]?.text || 'Betelgeuse brilha com tom avermelhado quente, enquanto Rigel reluz em azul potente.'}
                  </p>
                </>
              )}

              {activeTab === 'calendario' && (
                <>
                  <div className="tab-content-heading">Calendário Ecológico & Indicadores da Natureza</div>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid var(--accent-emerald)',
                      marginBottom: '10px'
                    }}
                  >
                    <h4 style={{ fontFamily: 'var(--font-heading)', color: '#34d399', fontSize: '0.95rem', marginBottom: '4px' }}>
                      🌱 Indicador de Chuvas
                    </h4>
                    <p style={{ color: '#cbd5e1', fontSize: '0.86rem', lineHeight: '1.55' }}>
                      {detail?.ecologicalCalendar?.indicator || fallbackData.tabs?.calendario?.content?.[0]?.text || 'O surgimento ao entardecer no horizonte Leste/Nordeste no início de dezembro anuncia o fim da estiagem.'}
                    </p>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid var(--accent-gold)'
                    }}
                  >
                    <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-gold-light)', fontSize: '0.95rem', marginBottom: '4px' }}>
                      🌽 Plantio do Milho Sagrado e Pesca
                    </h4>
                    <p style={{ color: '#cbd5e1', fontSize: '0.86rem', lineHeight: '1.55' }}>
                      {detail?.ecologicalCalendar?.planting || fallbackData.tabs?.calendario?.content?.[1]?.text || 'Sinal primordial para arar a terra e semear o milho, feijão de corda e macaxeira.'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Rodapé com Botões de Ação */}
          <div className="ficha-actions-footer">
            <button
              className="btn-secondary-action"
              onClick={() => {
                if (isPlayingAudio) toggleAudio();
                navigateTo('exercicio');
              }}
            >
              ✍️ Fazer Exercício
            </button>
            <button
              className="btn-primary-highlight"
              onClick={() => {
                if (isPlayingAudio) toggleAudio();
                navigateTo('observatorio');
              }}
            >
              🔭 Observar no Stellarium ➔
            </button>
          </div>
        </div>

      </div>

      {/* Modal Panorâmico Expandido */}
      {isFullscreenModalOpen && (
        <FullscreenViewerModal
          data={fallbackData}
          initialShowStars={showStars}
          initialShowArt={showArt}
          onClose={() => setIsFullscreenModalOpen(false)}
        />
      )}
    </div>
  );
};
