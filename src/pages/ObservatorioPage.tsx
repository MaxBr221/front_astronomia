import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { observatoryService } from '../services/observatoryService';
import { ObservatoryGuideDTO } from '../types/backend';
import { GUIA_STELLARIUM_HOMEM_VELHO, CONSTELACAO_HOMEM_VELHO } from '../services/mockDatabase';
import { audioSystem } from '../utils/audioSystem';

import { MOCK_OBSERVATORY_HOMEM_VELHO } from '../services/mockBackendData';

export const ObservatorioPage: React.FC = () => {
  const { navigateTo } = useApp();
  const fallbackGuide = GUIA_STELLARIUM_HOMEM_VELHO;

  const [guideData, setGuideData] = useState<ObservatoryGuideDTO>(MOCK_OBSERVATORY_HOMEM_VELHO);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(15);
  const [activeMarker, setActiveMarker] = useState<number>(0);
  const [timeValue, setTimeValue] = useState<number>(20.5);
  const [nightVision, setNightVision] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [skyRotation, setSkyRotation] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchGuide() {
      setIsSyncing(true);
      try {
        const data = await observatoryService.getGuideByConstellation('homem_velho');
        if (isMounted && data) {
          setGuideData(data);
        }
      } catch (err) {
        console.warn('Usando dados de contingência para o observatório:', err);
      } finally {
        if (isMounted) {
          setIsSyncing(false);
        }
      }
    }
    fetchGuide();
    return () => {
      isMounted = false;
    };
  }, []);

  const guide = guideData || fallbackGuide;

  // Controle de reprodução do áudio guia
  const toggleAudio = () => {
    const nextState = !isPlayingAudio;
    setIsPlayingAudio(nextState);

    if (nextState) {
      audioSystem.speak(
        "Para encontrar o Homem Velho no céu potiguar, olhe na direção sudeste a quarenta e cinco graus acima do horizonte. As Três Marias formam seu cinturão sagrado."
      );
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
          return prev + 2;
        });
      }, 500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlayingAudio]);

  // Rotação contínua do céu quando ativada
  useEffect(() => {
    let interval: number | undefined;
    if (isRotating) {
      interval = window.setInterval(() => {
        setSkyRotation(prev => prev + 0.5);
      }, 50);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRotating]);

  // Renderização da forma de onda (Waveform) no Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    canvas.width = canvas.parentElement?.clientWidth || 400;
    canvas.height = canvas.parentElement?.clientHeight || 52;

    const barsCount = 48;
    const barWidth = canvas.width / barsCount - 2;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() * 0.005;

      for (let i = 0; i < barsCount; i++) {
        const heightMultiplier = isPlayingAudio
          ? Math.sin(time + i * 0.35) * 0.4 + Math.cos(time * 0.7 + i * 0.2) * 0.4 + 0.5
          : Math.sin(i * 0.2) * 0.15 + 0.25;

        const barHeight = Math.max(4, heightMultiplier * (canvas.height - 10));
        const x = i * (barWidth + 2);
        const y = (canvas.height - barHeight) / 2;

        const isPast = (i / barsCount) * 100 <= audioProgress;
        ctx.fillStyle = isPast ? '#38bdf8' : isPlayingAudio ? '#7c3aed' : 'rgba(255, 255, 255, 0.2)';

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [isPlayingAudio, audioProgress]);

  const handleMarkerClick = (index: number, timeStr: string) => {
    audioSystem.playClick();
    setActiveMarker(index);
    const parts = timeStr.split(':').map(Number);
    const seconds = (parts[0] || 0) * 60 + (parts[1] || 0);
    setAudioProgress((seconds / 105) * 100);
    if (!isPlayingAudio) toggleAudio();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setTimeValue(val);
    setSkyRotation((val - 20) * 15);
  };

  const hour = Math.floor(timeValue);
  const minute = Math.round((timeValue % 1) * 60);
  const formattedHour = hour >= 24 ? hour - 24 : hour;
  const timeFormattedLabel = `${formattedHour < 10 ? '0' : ''}${formattedHour}:${minute === 0 ? '00' : minute < 10 ? '0' + minute : minute}`;

  const copyCoords = () => {
    audioSystem.playClick();
    const textToCopy = guide.coordinatesText || "-06° 24' 49\" S, 34° 55' 44\" O (Baía da Traição - PB)";
    navigator.clipboard?.writeText(textToCopy);
    setToastMessage(`Coordenadas copiadas: ${textToCopy}`);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const totalSec = 105;
  const curSec = Math.floor((audioProgress / 100) * totalSec);
  const curMins = Math.floor(curSec / 60);
  const curSecs = curSec % 60;
  const guideTimeFormatted = `${curMins}:${curSecs < 10 ? '0' : ''}${curSecs}`;

  const stepsList = guideData?.steps || fallbackGuide.steps.map(s => ({
    stepNumber: s.number,
    title: s.title,
    tag: s.tag,
    instruction: s.instruction,
    value: s.value,
    icon: s.icon,
    detail: s.detail
  }));

  return (
    <div className="screen-wrapper">
      {/* Navegação Superior */}
      <div className="page-navigation-bar">
        <button
          className="btn-back"
          onClick={() => {
            if (isPlayingAudio) toggleAudio();
            navigateTo('constelacao');
          }}
        >
          ← Voltar à Ficha da Constelação
        </button>
        <div className="screen-breadcrumbs">
          Trilha &gt; Homem Velho &gt; <span>Observatório Stellarium</span>
        </div>
      </div>

      {/* Título da Tela */}
      <div className="stellarium-hero-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="hud-badge">🪐 PLANETÁRIO INTEGRADO</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold-light)' }}>
            {guide.location || 'Baía da Traição - PB (Litoral Norte)'}
          </span>
          {isSyncing && (
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontStyle: 'italic' }}>
              • Sincronizando com API...
            </span>
          )}
        </div>
        <h2>{guide.title}</h2>
        <p>{guide.subtitle || 'Guia Prático de Observação com Stellarium'} • Melhores Épocas: {guide.bestViewingSeason || 'Verão Potiguar'}</p>
      </div>

          {/* Grid Principal */}
          <div className="stellarium-layout-grid">
            
            {/* Coluna Esquerda: Planetário Simulado */}
            <div className="planetarium-column">
              <div
                className="planetarium-viewport-card"
                style={{
                  filter: nightVision ? 'sepia(1) saturate(5) hue-rotate(-50deg) contrast(1.2)' : 'none'
                }}
              >
                <div
                  className="planetarium-screen"
                  style={{
                    backgroundImage: `url('${CONSTELACAO_HOMEM_VELHO.image}')`,
                    transform: `rotate(${skyRotation}deg) scale(1.15)`,
                    transition: isRotating ? 'none' : 'transform 0.2s ease-out'
                  }}
                >
                  <div className="planetarium-grid-overlay" />
                  <div className="planetarium-crosshair" />

                  <div className="planetarium-top-hud">
                    <span className="hud-badge">CÉU INDÍGENA & OCIDENTAL</span>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.78rem',
                        color: '#fff',
                        background: 'rgba(0,0,0,0.6)',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {guide.azimuth || 'Az 72° ENE'} • {guide.altitude || 'Alt 34°'}
                    </span>
                  </div>

                  <div className="planetarium-compass">
                    <span>LESTE (90°)</span>
                    <span className="highlight">SUDESTE (160° - TUIRA)</span>
                    <span>SUL (180°)</span>
                  </div>
                </div>

                {/* Controles de Simulação */}
                <div className="planetarium-controls-strip">
                  <div className="sim-slider-group">
                    <span>⏰ Hora do Céu:</span>
                    <input
                      type="range"
                      className="sim-slider"
                      min="18"
                      max="28"
                      step="0.5"
                      value={timeValue}
                      onChange={handleSliderChange}
                    />
                    <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>
                      {timeFormattedLabel}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className={`toggle-chip ${nightVision ? 'active' : ''}`}
                      onClick={() => {
                        audioSystem.playClick();
                        setNightVision(!nightVision);
                      }}
                    >
                      🔴 Visão Noturna
                    </button>
                    <button
                      className={`toggle-chip ${isRotating ? 'active' : ''}`}
                      onClick={() => {
                        audioSystem.playClick();
                        setIsRotating(!isRotating);
                      }}
                    >
                      🔄 Girar Céu
                    </button>
                  </div>
                </div>
              </div>

              {/* Termos de Busca Sugeridos no Stellarium */}
              {guide.searchTerms && guide.searchTerms.length > 0 && (
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Termos de Busca:</span>
                  {guide.searchTerms.map((term, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        color: 'var(--accent-cyan)'
                      }}
                    >
                      {term}
                    </span>
                  ))}
                </div>
              )}

              {/* Card de Ação Stellarium */}
              <div className="stellarium-action-card" style={{ marginTop: '14px' }}>
                <div className="stellarium-action-text">
                  <h4>Pronto para observar no Stellarium oficial?</h4>
                  <p>Abra o simulador web com coordenadas sincronizadas ou copie para seu software desktop.</p>
                </div>

                <div className="stellarium-buttons-group">
                  <button
                    className="btn-open-stellarium"
                    onClick={() => {
                      audioSystem.playClick();
                      setIsModalOpen(true);
                    }}
                  >
                    Abrir no Stellarium Web ↗
                  </button>
                  <button
                    className="btn-secondary-action"
                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    onClick={copyCoords}
                  >
                    📋 Copiar Coordenadas
                  </button>
                </div>
              </div>
            </div>

            {/* Coluna Direita: Guia com Waveform & Passos */}
            <div className="stellarium-guide-panel">
              
              {/* Player Waveform */}
              <div className="guide-audio-card">
                <div className="guide-audio-header">
                  <div>
                    <h3>{guide.audioTitle || 'Guia Prático de Campo'}</h3>
                    <p>Voz e Sabedoria: <strong>{guide.narrator || 'Yara Potiguara'}</strong></p>
                  </div>
                  <div className="node-status-badge badge-in-progress" style={{ fontSize: '0.72rem' }}>
                    Áudio Guia
                  </div>
                </div>

                <div className="waveform-canvas-box">
                  <canvas ref={canvasRef} id="waveform-canvas" />
                </div>

                {/* Marcadores Clicáveis */}
                <div className="audio-markers-strip">
                  {fallbackGuide.audioMarkers.map((m, idx) => (
                    <button
                      key={idx}
                      className={`marker-pill ${activeMarker === idx ? 'active' : ''}`}
                      onClick={() => handleMarkerClick(idx, m.time)}
                    >
                      📍 {m.time} - {m.label}
                    </button>
                  ))}
                </div>

                {/* Controles de Áudio */}
                <div className="player-controls-row">
                  <button
                    className="btn-play-pause"
                    onClick={toggleAudio}
                    title={isPlayingAudio ? 'Pausar áudio' : 'Tocar áudio'}
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
                      <span>{guideTimeFormatted}</span>
                      <span>{guide.audioDuration || fallbackGuide.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passos Sincronizados de Observação */}
              <div className="observation-steps-list">
                {stepsList.map(step => (
                  <div key={step.stepNumber} className="obs-step-card">
                    <div className="obs-step-top">
                      <div className="obs-step-number">
                        <span>{step.stepNumber}</span>
                        {step.title}
                      </div>
                      <span className="obs-step-tag">{step.tag}</span>
                    </div>
                    <p className="obs-step-instruction">{step.instruction}</p>
                    <div className="obs-step-value">
                      <span>{step.value}</span>
                      <span style={{ fontSize: '0.9rem' }}>{step.icon}</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                      💡 {step.detail}
                    </div>
                  </div>
                ))}
              </div>

              {/* Botão de Avançar para a Tela 4 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  className="btn-advance-challenge"
                  onClick={() => {
                    if (isPlayingAudio) toggleAudio();
                    navigateTo('exercicio');
                  }}
                >
                  Avançar para o Desafio Prático ➔
                </button>
              </div>

            </div>

          </div>

          {/* Modal Stellarium Web */}
          {isModalOpen && (
            <div className="modal-backdrop">
              <div className="modal-content-card" style={{ maxWidth: '600px' }}>
                <div className="modal-emblem-badge">🔭</div>
                <h3>Simulação Planetária Stellarium</h3>
                <div className="modal-xp-reward">Coordenadas: {guide.coordinatesText}</div>
                <p>
                  O protótipo preparou os parâmetros ideais de observação: <strong>Solstício de Verão • {guide.targetDate || '15 de Dezembro às 20h30'} • {guide.azimuth || 'Azimute 72° ENE'}</strong>.
                </p>
                <div
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '20px',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    color: 'var(--accent-cyan)',
                    textAlign: 'left'
                  }}
                >
                  &gt; Local: {guide.location || 'Baía da Traição - PB'}<br />
                  &gt; Alvo: Homem Velho (Tuira / Orion)<br />
                  &gt; Azimute: {guide.azimuth || '72° ENE'} | Altitude: {guide.altitude || '34°'}<br />
                  &gt; Status: Sincronização pronta para observação
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href={guide.stellariumWebUrl || 'https://stellarium-web.org'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-modal-conclude"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    Abrir Stellarium Web Oficial ↗
                  </a>
                  <button
                    className="btn-secondary-action"
                    onClick={() => {
                      audioSystem.playClick();
                      setIsModalOpen(false);
                    }}
                  >
                    Fechar Simulação
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Toast Notification */}
          {toastMessage && (
            <div className="cosmic-toast">
              <span>✨</span>
              <div>{toastMessage}</div>
            </div>
          )}
    </div>
  );
};
