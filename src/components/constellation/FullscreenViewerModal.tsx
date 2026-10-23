import React, { useState, useEffect } from 'react';
import { ConstelacaoDTO } from '../../types';
import { audioSystem } from '../../utils/audioSystem';

interface FullscreenViewerModalProps {
  data: ConstelacaoDTO;
  onClose: () => void;
  initialShowStars?: boolean;
  initialShowArt?: boolean;
}

export const FullscreenViewerModal: React.FC<FullscreenViewerModalProps> = ({
  data,
  onClose,
  initialShowStars = true,
  initialShowArt = true
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [showStars, setShowStars] = useState<boolean>(initialShowStars);
  const [showArt, setShowArt] = useState<boolean>(initialShowArt);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        audioSystem.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleZoom = (delta: number) => {
    audioSystem.playClick();
    setZoom(prev => Math.max(0.7, Math.min(2.5, prev + delta)));
  };

  const handleReset = () => {
    audioSystem.playClick();
    setZoom(1);
  };

  return (
    <div className="celestial-fullscreen-modal">
      <div className="fullscreen-top-nav">
        <div className="fullscreen-title-box">
          <span style={{ fontSize: '1.3rem' }}>🔭</span>
          <div>
            <h3>{data.title} • Modo Panorâmico Expandido</h3>
            <p>{data.tupiTitle} • Orion e Touro na Cosmovisão Ancestral</p>
          </div>
        </div>

        <div className="fullscreen-toolbar-actions">
          <button className="btn-fullscreen-control" onClick={() => handleZoom(-0.25)} title="Diminuir Zoom">
            🔍 -
          </button>
          <button className="btn-fullscreen-control" onClick={handleReset} title="Restaurar Tamanho">
            ↺ {Math.round(zoom * 100)}%
          </button>
          <button className="btn-fullscreen-control" onClick={() => handleZoom(0.25)} title="Aumentar Zoom">
            🔍 +
          </button>
          <button
            className={`btn-fullscreen-control ${showArt ? 'active' : ''}`}
            onClick={() => {
              audioSystem.playClick();
              setShowArt(!showArt);
            }}
          >
            🎨 Arte Ancestral
          </button>
          <button
            className={`btn-fullscreen-control ${showStars ? 'active' : ''}`}
            onClick={() => {
              audioSystem.playClick();
              setShowStars(!showStars);
            }}
          >
            ⭐ Estrelas
          </button>
          <button className="btn-close-fullscreen" onClick={onClose}>
            ✕ Fechar [ESC]
          </button>
        </div>
      </div>

      <div className="fullscreen-main-canvas" id="fs-canvas-stage">
        <div
          className="fullscreen-image-stage"
          id="fs-stage"
          style={{ transform: `scale(${zoom})` }}
        >
          <img
            src={data.image}
            alt="Constelação Expandida"
            id="fs-img"
            style={{ filter: showArt ? 'none' : 'contrast(1.4) brightness(0.7) hue-rotate(180deg)' }}
          />

          {showStars && (
            <div className="star-interactive-overlay">
              {data.stars.map((s, idx) => (
                <div
                  key={idx}
                  className={`star-point ${(s?.name || '')?.includes('Betelgeuse') ? 'orange' : ''}`}
                  style={{ top: `${s?.y ?? 50}%`, left: `${s?.x ?? 50}%` }}
                  title={`${s?.name || 'Estrela'} (${s?.indigenous || ''}) - Mag: ${s?.mag || ''}`}
                >
                  <div className="star-dot" />
                  <div className="star-label">{s?.name || ''}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fullscreen-bottom-legend">
        <div className="viewer-legend-dots">
          <div className="legend-item">
            <span className="dot" style={{ background: '#f97316', boxShadow: '0 0 8px #f97316' }} />
            <span>Betelgeuse (Ombro / Cabeça)</span>
          </div>
          <div className="legend-item">
            <span className="dot" style={{ background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
            <span>Rigel (Perna Sadia)</span>
          </div>
          <div className="legend-item">
            <span className="dot" style={{ background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
            <span>Aldebaran (Perna Cortada de Tuira)</span>
          </div>
          <div className="legend-item">
            <span className="dot" style={{ background: '#a78bfa', boxShadow: '0 0 8px #a78bfa' }} />
            <span>Três Marias (Joykó / Cinturão)</span>
          </div>
        </div>
        <span style={{ color: 'var(--accent-gold-light)' }}>
          Dica: Pressione ESC para fechar ou use os controles de zoom
        </span>
      </div>
    </div>
  );
};
