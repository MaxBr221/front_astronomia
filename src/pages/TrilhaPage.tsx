import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { constellationService } from '../services/constellationService';
import { ConstellationListItemDTO } from '../types/backend';
import { audioSystem } from '../utils/audioSystem';

export const TrilhaPage: React.FC = () => {
  const { navigateTo } = useApp();

  const [constellations, setConstellations] = useState<ConstellationListItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await constellationService.getConstellations();
        if (isMounted) {
          setConstellations(data);
        }
      } catch (err) {
        console.warn('Erro ao carregar constelações da trilha:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleNodeClick = (item: ConstellationListItemDTO) => {
    if (item.status === 'BLOQUEADO') {
      audioSystem.playError();
      return;
    }
    audioSystem.playClick();
    if (item.code === 'homem_velho') {
      navigateTo('constelacao');
    } else if (item.code === 'ema_celeste') {
      navigateTo('observatorio');
    } else if (item.code === 'caminho_antas') {
      navigateTo('exercicio');
    } else {
      navigateTo('constelacao');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONCLUIDO':
        return <span className="node-status-badge badge-completed">🏆 CONCLUÍDO</span>;
      case 'EM_PROGRESSO':
        return <span className="node-status-badge badge-in-progress">⚡ EM PROGRESSO</span>;
      case 'LIBERADO':
        return <span className="node-status-badge badge-in-progress" style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>✨ LIBERADO</span>;
      default:
        return <span className="node-status-badge badge-locked">🔒 BLOQUEADO</span>;
    }
  };

  return (
    <div className="screen-wrapper">
      {/* Hero da Trilha */}
      <div className="trail-hero">
        <div className="trail-hero-badge">
          <span>✨</span> Trilha de Iniciação Cosmológica Potiguara
        </div>
        <h2>O Céu dos Encantados & <span>As Quatro Estações</span></h2>
        <p>
          Acompanhe o caminho dos ancestrais através das constelações que orientam a vida, a agricultura e as marés da Baía da Traição e do Litoral Potiguar.
        </p>
      </div>

      {/* Container do Mapa das Constelações */}
      <div className="trail-constellation-container">
        {/* SVG Conector Estelar Cósmico */}
        <svg className="trail-path-svg" viewBox="0 0 1200 480" preserveAspectRatio="none">
          <defs>
            <linearGradient id="trailGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.7" />
            </linearGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path
            d="M 160 220 C 340 100, 480 320, 680 180 S 960 300, 1080 200"
            fill="none"
            stroke="url(#trailGoldGrad)"
            strokeWidth="3"
            strokeDasharray="6,6"
            filter="url(#glowEffect)"
          />
        </svg>

        {/* Grid de Cards dos Nós da Trilha */}
        <div className="trail-nodes-grid">
          {isLoading ? (
            /* Esqueletos Cósmicos com Shimmer */
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-node-card">
                <div className="skeleton-bar cosmic-shimmer" style={{ width: '45%' }} />
                <div className="cosmic-shimmer" style={{ height: '170px', borderRadius: '14px' }} />
                <div className="skeleton-bar cosmic-shimmer" style={{ width: '70%', height: '24px' }} />
                <div className="skeleton-bar cosmic-shimmer" style={{ width: '90%' }} />
                <div className="skeleton-bar cosmic-shimmer" style={{ width: '60%', marginTop: 'auto' }} />
              </div>
            ))
          ) : (
            constellations.map((item, index) => {
              const isLocked = item.status === 'BLOQUEADO';
              const isCompleted = item.status === 'CONCLUIDO';
              const cardClass = isLocked 
                ? 'node-card locked-node' 
                : isCompleted 
                  ? 'node-card completed-node' 
                  : 'node-card active-node';

              return (
                <div
                  key={item.code}
                  className={cardClass}
                  id={`node-${item.code}`}
                  onClick={() => handleNodeClick(item)}
                >
                  <div className="node-top-bar">
                    {getStatusBadge(item.status)}
                    <span style={{ fontSize: '0.8rem', color: isLocked ? 'var(--text-muted)' : 'var(--accent-gold-light)' }}>
                      Nó 0{index + 1}
                    </span>
                  </div>

                  <div className="node-preview-media">
                    <img
                      src={item.imageUrl || (index === 0 ? '/assets/tuira_orion.jpg' : index === 1 ? '/assets/ema_celeste.jpg' : index === 2 ? '/assets/antas_milkyway.jpg' : '/assets/veado_celeste.jpg')}
                      alt={item.title}
                      style={isLocked ? { filter: 'brightness(0.4) grayscale(0.5)' } : {}}
                    />
                    <div className="node-preview-overlay">
                      <span className="node-preview-stars">
                        {isLocked ? '🔒 Bloqueado' : `🔭 ${item.westernEquivalence}`}
                      </span>
                    </div>
                  </div>

                  <div className="node-title-group">
                    <div className="indigenous-subtitle">{item.indigenousName}</div>
                    <h3>{item.title}</h3>
                  </div>

                  <p className="node-description">
                    {item.climateMarker || item.seasonInfo}
                  </p>

                  <div className="node-badges-list">
                    <span className="node-feature-badge">🌿 {item.seasonInfo}</span>
                    <span className="node-feature-badge">📖 {item.stepsCount} Lições</span>
                  </div>

                  <div className="node-card-footer">
                    <div className="node-progress-info">
                      Progresso: <strong>{item.progressPercentage}%</strong>
                    </div>
                    {isLocked ? (
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Requer Nó Anterior</span>
                    ) : (
                      <button
                        className="btn-explore"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNodeClick(item);
                        }}
                      >
                        {isCompleted ? 'Rever Lição ➔' : 'Explorar Nó ➔'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Banner de Acesso ao Dicionário Cósmico */}
      <div
        className="trail-dict-banner"
        style={{
          maxWidth: '1200px',
          margin: '40px auto 20px auto',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(124, 58, 237, 0.15))',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '18px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              fontSize: '2.2rem',
              background: 'rgba(0, 0, 0, 0.35)',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: '1px solid rgba(245, 158, 11, 0.4)'
            }}
          >
            📖
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1.25rem', marginBottom: '4px' }}>
              Dicionário Cósmico Tupi-Guarani
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: 0 }}>
              Consulte 22 termos ancestrais para estrelas, constelações (Tinguasú, Tuiba’e), fases da lua e galáxias com áudio e pronúncia.
            </p>
          </div>
        </div>

        <button
          className="btn-primary-highlight"
          onClick={() => {
            audioSystem.playClick();
            navigateTo('dicionario');
          }}
          style={{ whiteSpace: 'nowrap' }}
        >
          Explorar Dicionário ➔
        </button>
      </div>
    </div>
  );
};
