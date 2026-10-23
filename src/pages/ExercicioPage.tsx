import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { exerciseService } from '../services/exerciseService';
import { ExerciseDTO, ExerciseValidationResponse } from '../types/backend';
import { EXERCICIO_LIGAR_COLUNAS } from '../services/mockDatabase';
import { audioSystem } from '../utils/audioSystem';
import { launchCosmicConfetti } from '../utils/confetti';

import { MOCK_EXERCISE_DATA } from '../services/mockBackendData';

interface CableCoord {
  id: string;
  d: string;
  color: string;
}

export const ExercicioPage: React.FC = () => {
  const { navigateTo, completeHomemVelho, isAuthenticated, rawUser } = useApp();
  const fallbackData = EXERCICIO_LIGAR_COLUNAS;

  const [exerciseData, setExerciseData] = useState<ExerciseDTO>(MOCK_EXERCISE_DATA);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const [userMatches, setUserMatches] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [cables, setCables] = useState<CableCoord[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastValidation, setLastValidation] = useState<ExerciseValidationResponse | null>(null);

  const boardRef = useRef<HTMLDivElement | null>(null);

  const cableColors: Record<string, string> = {
    homem_velho: '#38bdf8', // ciano
    ema_celeste: '#7c3aed', // violeta
    caminho_antas: '#f59e0b', // dourado
    veado: '#10b981' // esmeralda
  };

  useEffect(() => {
    let isMounted = true;
    async function loadExercise() {
      try {
        const data = await exerciseService.getExercise('exercicio_associacao_ecologica');
        if (isMounted && data) {
          setExerciseData(data);
        }
      } catch (err) {
        console.warn('Usando dados locais de exercício:', err);
      }
    }
    loadExercise();
    return () => {
      isMounted = false;
    };
  }, []);

  // Recalcular posições das linhas curvas SVG
  const updateCables = () => {
    if (!boardRef.current) return;
    const boardRect = boardRef.current.getBoundingClientRect();
    const newCables: CableCoord[] = [];

    Object.entries(userMatches).forEach(([leftId, rightId]) => {
      const leftPin = document.querySelector(`#card-left-${leftId} .connector-pin`) as HTMLElement | null;
      const rightPin = document.querySelector(`#card-right-${rightId} .connector-pin`) as HTMLElement | null;

      if (!leftPin || !rightPin) return;

      const leftRect = leftPin.getBoundingClientRect();
      const rightRect = rightPin.getBoundingClientRect();

      const x1 = leftRect.left + leftRect.width / 2 - boardRect.left;
      const y1 = leftRect.top + leftRect.height / 2 - boardRect.top;
      const x2 = rightRect.left + rightRect.width / 2 - boardRect.left;
      const y2 = rightRect.top + rightRect.height / 2 - boardRect.top;

      const dx = Math.abs(x2 - x1) * 0.5;
      const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

      newCables.push({
        id: `${leftId}-${rightId}`,
        d: pathD,
        color: cableColors[leftId] || '#38bdf8'
      });
    });

    setCables(newCables);
  };

  useEffect(() => {
    updateCables();
    window.addEventListener('resize', updateCables);
    return () => window.removeEventListener('resize', updateCables);
  }, [userMatches]);

  const handleLeftCardClick = (id: string) => {
    audioSystem.playClick();
    setSelectedLeft(prev => (prev === id ? null : id));
  };

  const handleRightCardClick = (rightId: string) => {
    if (selectedLeft) {
      setUserMatches(prev => {
        const next = { ...prev };
        for (const [lId, rId] of Object.entries(next)) {
          if (rId === rightId) delete next[lId];
        }
        next[selectedLeft] = rightId;
        return next;
      });
      audioSystem.playConnect();
      setSelectedLeft(null);
    } else {
      setUserMatches(prev => {
        const next = { ...prev };
        for (const [lId, rId] of Object.entries(next)) {
          if (rId === rightId) {
            delete next[lId];
            audioSystem.playClick();
            break;
          }
        }
        return next;
      });
    }
  };

  const handlePronounce = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioSystem.playClick();
    audioSystem.speak(text);
  };

  const handleResetMatches = () => {
    audioSystem.playClick();
    setUserMatches({});
    setSelectedLeft(null);
  };

  const handleVerify = async () => {
    if (Object.keys(userMatches).length < 3) {
      audioSystem.playError();
      setToastMessage('⚠️ Conecte pelo menos 3 constelações aos seus ciclos antes de validar!');
      setTimeout(() => setToastMessage(null), 3400);
      return;
    }

    setIsValidating(true);
    try {
      const res = await exerciseService.validateExercise('exercicio_associacao_ecologica', {
        userId: rawUser?.id || 1,
        answers: userMatches
      });

      setLastValidation(res);

      if (res.passed) {
        audioSystem.playSuccess();
        launchCosmicConfetti();
        await completeHomemVelho();
        setIsSuccessModalOpen(true);
      } else {
        audioSystem.playError();
        setIsErrorModalOpen(true);
      }
    } catch (err) {
      console.warn('Erro ao validar respostas:', err);
      // Validação local de contingência
      const isAllCorrect = userMatches['homem_velho'] === 'chuvas_milho';
      if (isAllCorrect) {
        audioSystem.playSuccess();
        launchCosmicConfetti();
        await completeHomemVelho();
        setIsSuccessModalOpen(true);
      } else {
        audioSystem.playError();
        setIsErrorModalOpen(true);
      }
    } finally {
      setIsValidating(false);
    }
  };

  const title = exerciseData?.title || fallbackData.title;
  const subtitle = exerciseData?.subtitle || fallbackData.subtitle;
  const levelText = exerciseData?.level || fallbackData.level;
  const hintText = exerciseData?.hint || fallbackData.hint;

  return (
    <div className="screen-wrapper">
      {/* HUD Superior */}
      <div className="exercise-top-hud">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            className="btn-icon-soft"
            onClick={() => navigateTo('observatorio')}
            title="Voltar ao Observatório"
          >
            ←
          </button>
          <div className="exercise-steps-bullets">
            <div className="step-bullet completed">1</div>
            <div className="step-bullet active">2</div>
            <div className="step-bullet">3</div>
            <div className="step-bullet">4</div>
            <div className="step-bullet">5</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="exercise-lives-box">
            <span>❤️❤️</span>
            <span>{rawUser?.lives || 3}/{rawUser?.maxLives || 3}</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
            {levelText}
          </div>
        </div>
      </div>

      {/* Título */}
      <div className="exercise-title-center">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {/* Tabuleiro de Ligação de Colunas */}
      <div className="match-board-container" id="match-board" ref={boardRef}>
            {/* Camada SVG dos Cabos */}
            <svg className="match-cables-svg" id="cables-svg">
              <defs>
                <filter id="cableGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <g id="cables-group">
                {cables.map(c => (
                  <g key={c.id}>
                    <path
                      d={c.d}
                      fill="none"
                      stroke={c.color}
                      strokeWidth="4"
                      strokeLinecap="round"
                      filter="url(#cableGlow)"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        const [leftId] = c.id.split('-');
                        setUserMatches(prev => {
                          const next = { ...prev };
                          delete next[leftId];
                          return next;
                        });
                      }}
                    />
                    <circle r="4" fill="#ffffff">
                      <animateMotion path={c.d} dur="2s" repeatCount="indefinite" />
                    </circle>
                  </g>
                ))}
              </g>
            </svg>

            {/* Coluna Esquerda: Constelações */}
            <div className="match-column" id="left-column">
              <div className="column-header-label">
                <span>✨</span> CONSTELAÇÕES POTIGUARA
              </div>

              {fallbackData.leftItems.map(item => {
                const isSelected = selectedLeft === item.id;
                const isMatched = !!userMatches[item.id];

                return (
                  <div
                    key={item.id}
                    className={`match-card left-card ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''}`}
                    id={`card-left-${item.id}`}
                    onClick={() => handleLeftCardClick(item.id)}
                  >
                    <div className="match-card-content">
                      <div className="match-card-icon">
                        <img src={item.icon} alt={item.name} />
                      </div>
                      <div className="match-card-text">
                        <h4>{item.name}</h4>
                        <p>{item.tooltip}</p>
                      </div>
                    </div>

                    <div className="match-card-actions">
                      <button
                        className="btn-card-audio"
                        onClick={(e) => handlePronounce(e, item.audioText)}
                        title="Ouvir pronúncia ancestral"
                      >
                        🔊
                      </button>
                      <div className={`connector-pin ${isMatched ? 'connected' : ''}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coluna Direita: Ciclos Ecológicos */}
            <div className="match-column" id="right-column">
              <div className="column-header-label">
                <span>🌿</span> CICLOS & FENÔMENOS DA NATUREZA
              </div>

              {fallbackData.rightItems.map(item => {
                const isConnected = Object.values(userMatches).includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`match-card right-card ${isConnected ? 'matched' : ''}`}
                    id={`card-right-${item.id}`}
                    onClick={() => handleRightCardClick(item.id)}
                  >
                    <div className={`connector-pin ${isConnected ? 'connected' : ''}`} />

                    <div className="match-card-content">
                      <div className="match-card-icon">
                        <img src={item.icon} alt={item.title} />
                      </div>
                      <div className="match-card-text">
                        <h4 style={{ color: item.color }}>{item.title}</h4>
                        <p>{item.subtitle}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Barra de Ações Inferior */}
          <div className="exercise-bottom-bar">
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-secondary-action"
                onClick={() => {
                  audioSystem.playClick();
                  setIsHintModalOpen(true);
                }}
              >
                💡 Ouvir Dica dos Mais Velhos
              </button>
              <button
                className="btn-secondary-action"
                onClick={handleResetMatches}
              >
                ↺ Limpar Ligações
              </button>
            </div>

            <button
              className="btn-verify-match"
              onClick={handleVerify}
              disabled={isValidating}
              id="btn-verify-exercise"
            >
              {isValidating ? 'Validando no Spring Boot...' : 'Verificar Conexões Sagradas ➔'}
            </button>
          </div>

      {/* Modal de Sucesso */}
      {isSuccessModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content-card">
            <div className="modal-emblem-badge">🏆</div>
            <h3>{lastValidation?.feedbackMessage || 'Sabedoria Celeste Confirmada!'}</h3>
            <div className="modal-xp-reward">+{lastValidation?.xpEarned || 150} XP Conquistados!</div>
            <p style={{ marginTop: '10px' }}>
              Você conectou com maestria as constelações sagradas aos seus ciclos ecológicos correspondentes na Baía da Traição.
            </p>

            {!isAuthenticated ? (
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.84rem',
                    color: 'var(--accent-gold-light)'
                  }}
                >
                  ✨ <strong>Crie sua conta de explorador</strong> para eternizar seus 150 XP e subir no ranking da aldeia!
                </div>

                <button
                  className="btn-modal-conclude"
                  onClick={() => {
                    audioSystem.playClick();
                    setIsSuccessModalOpen(false);
                    navigateTo('cadastro');
                  }}
                >
                  Criar Conta e Salvar 150 XP ➔
                </button>

                <button
                  className="btn-secondary-action"
                  onClick={() => {
                    audioSystem.playClick();
                    setIsSuccessModalOpen(false);
                    navigateTo('trilha');
                  }}
                >
                  Continuar na Trilha como Visitante ➔
                </button>

                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Já possui conta?{' '}
                  <button
                    className="btn-text-link"
                    style={{ fontSize: '0.76rem' }}
                    onClick={() => {
                      setIsSuccessModalOpen(false);
                      navigateTo('login');
                    }}
                  >
                    Entrar agora
                  </button>
                </p>
              </div>
            ) : (
              <button
                className="btn-modal-conclude"
                onClick={() => {
                  audioSystem.playClick();
                  setIsSuccessModalOpen(false);
                  navigateTo('trilha');
                }}
              >
                Concluir Lição e Voltar à Trilha ⭐
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal de Incorreção */}
      {isErrorModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content-card" style={{ borderColor: 'var(--accent-rose)' }}>
            <div className="modal-emblem-badge" style={{ background: 'var(--accent-rose)', color: '#fff' }}>
              💡
            </div>
            <h3>Quase lá, Explorador!</h3>
            <p style={{ marginTop: '10px' }}>
              {lastValidation?.feedbackMessage || 'Alguma das conexões não corresponde ao saber tradicional dos mais velhos. Relembre o ciclo:'}
            </p>
            <div
              style={{
                background: 'rgba(0,0,0,0.4)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                fontSize: '0.84rem',
                color: 'var(--accent-gold-light)',
                textAlign: 'left'
              }}
            >
              🏹 "Quando o sábio <strong>Tuira</strong> ergue seu bastão no nascente, ele chama as nuvens de chuva que alimentam o milharal recém-semeado..."
            </div>
            <button
              className="btn-secondary-action"
              onClick={() => {
                audioSystem.playClick();
                setIsErrorModalOpen(false);
              }}
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}

      {/* Modal de Dica */}
      {isHintModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content-card">
            <div className="modal-emblem-badge">🌿</div>
            <h3>Ensinamento dos Anciãos Potiguara</h3>
            <p style={{ marginTop: '10px' }}>{hintText}</p>
            <button
              className="btn-secondary-action"
              style={{ marginTop: '16px' }}
              onClick={() => {
                audioSystem.playClick();
                setIsHintModalOpen(false);
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="cosmic-toast">
          <div>{toastMessage}</div>
        </div>
      )}
    </div>
  );
};
