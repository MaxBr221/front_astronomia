import React from 'react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { navigateTo, isAuthenticated, user } = useApp();

  return (
    <div className="screen-wrapper" style={{ maxWidth: '1360px' }}>
      {/* Barra de Navegação Pública da Landing Page */}
      <nav className="landing-navbar">
        <div className="brand-section">
          <div className="brand-emblem" style={{ width: '38px', height: '38px' }}>
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
              <circle cx="50" cy="50" r="16" fill="#f59e0b" opacity="0.4" />
              <path d="M 50 15 A 35 35 0 0 1 85 50 A 35 35 0 0 1 50 85 A 35 35 0 0 1 15 50 A 35 35 0 0 1 50 15" strokeDasharray="8 6" />
              <circle cx="50" cy="50" r="6" fill="#ffffff" />
            </svg>
          </div>
          <div className="brand-text">
            <h1 style={{ fontSize: '1.1rem' }}>ASTRONOMIA POTIGUARA</h1>
            <p style={{ fontSize: '0.68rem' }}>Ciência Ancestral & Guia Stellarium</p>
          </div>
        </div>

        <div className="landing-nav-links">
          <a href="#constelacoes-destaque" className="nav-anchor">Constelações</a>
          <a href="#metodologia" className="nav-anchor">Metodologia</a>
          <a href="#stellarium-preview" className="nav-anchor">Stellarium</a>
        </div>

        <div className="landing-auth-actions">
          {isAuthenticated ? (
            <button className="btn-primary-highlight" onClick={() => navigateTo('trilha')}>
              Ir para Minha Trilha ({user.name}) ➔
            </button>
          ) : (
            <>
              <button className="btn-secondary-action" onClick={() => navigateTo('login')}>
                Entrar
              </button>
              <button className="btn-primary-highlight" onClick={() => navigateTo('cadastro')}>
                Criar Conta Gratuita
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero-section">
        <div className="landing-hero-badge">
          <span>✨</span> Resgate da Etnoastronomia dos Povos Originários do Nordeste
        </div>
        <h1 className="landing-hero-title">
          Explore o Universo Pelos Olhos do <span>Povo Potiguara</span>
        </h1>
        <p className="landing-hero-subtitle">
          Descubra como os povos indígenas da Paraíba e Rio Grande do Norte liam o ritmo das chuvas, 
          as marés de pesca e a colheita do milho através das constelações que a astronomia moderna não ensina.
        </p>

        {/* CTAs de Conversão Rápida */}
        <div className="landing-hero-cta-group">
          <button
            className="btn-hero-primary"
            onClick={() => navigateTo('exercicio')}
          >
            🚀 Começar a Aprender Agora (Sem Cadastro) ➔
          </button>
          <button
            className="btn-hero-secondary"
            onClick={() => navigateTo('trilha')}
          >
            🌌 Explorar Trilha Completa
          </button>
        </div>

        <div className="landing-proof-pills">
          <span>✓ 100% Interativo</span>
          <span>✓ Áudios em Tupi Antigo</span>
          <span>✓ Coordenadas para Stellarium</span>
          <span>✓ Sem necessidade de cadastro inicial</span>
        </div>
      </section>

      {/* Seção: As Constelações Principais */}
      <section className="landing-section" id="constelacoes-destaque">
        <div className="section-title-center">
          <span className="section-kicker">CÉU ANCESTRAL</span>
          <h2>As Grandes Constelações da Tradição</h2>
          <p>Figuras míticas e científicas que conectam o cosmos à biodiversidade brasileira.</p>
        </div>

        <div className="constellations-showcase-grid">
          
          {/* Card 1: Homem Velho */}
          <div className="showcase-card highlight-glow" onClick={() => navigateTo('constelacao')}>
            <div className="showcase-card-image">
              <img src="/assets/tuira_orion.jpg" alt="Constelação do Homem Velho" />
              <div className="showcase-card-tag">Orion & Touro</div>
            </div>
            <div className="showcase-card-body">
              <span className="indigenous-tag">Tupã Ñamandú Tuira</span>
              <h3>O Homem Velho (Tuira)</h3>
              <p>
                O sábio guerreiro cuja perna amputada reluz em Aldebaran. Quando surge ao nascente, 
                anuncia a chegada das primeiras águas para a semeadura do milho sagrado.
              </p>
              <div className="showcase-footer">
                <span>🎧 Áudio do Pajé • 🔭 Stellarium</span>
                <span className="btn-link-arrow">Ver Ficha ➔</span>
              </div>
            </div>
          </div>

          {/* Card 2: A Ema Celeste */}
          <div className="showcase-card" onClick={() => navigateTo('observatorio')}>
            <div className="showcase-card-image">
              <img src="/assets/ema_celeste.jpg" alt="A Ema Celeste" />
              <div className="showcase-card-tag">Cruzeiro do Sul & Mosca</div>
            </div>
            <div className="showcase-card-body">
              <span className="indigenous-tag">Guyra Nhandu</span>
              <h3>A Ema Celeste</h3>
              <p>
                A grande ave estelar que bebe a água da Via Láctea para evitar a seca no solstício 
                de inverno e orienta as grandes marés altas de pesca no litoral.
              </p>
              <div className="showcase-footer">
                <span>🏆 Módulo Avançado</span>
                <span className="btn-link-arrow">Observar ➔</span>
              </div>
            </div>
          </div>

          {/* Card 3: Caminho das Antas */}
          <div className="showcase-card" onClick={() => navigateTo('trilha')}>
            <div className="showcase-card-image">
              <img src="/assets/antas_milkyway.jpg" alt="Caminho das Antas" />
              <div className="showcase-card-tag">Via Láctea Austral</div>
            </div>
            <div className="showcase-card-body">
              <span className="indigenous-tag">Tapi'i Rape</span>
              <h3>Caminho das Antas</h3>
              <p>
                A imensa estrada luminosa por onde viajam as almas dos antepassados e a fauna cósmica, 
                servindo de bússola para as caçadas noturnas na mata.
              </p>
              <div className="showcase-footer">
                <span>🌌 Estrada Espiritual</span>
                <span className="btn-link-arrow">Ver Trilha ➔</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Seção: Metodologia de Ensino */}
      <section className="landing-section" id="metodologia">
        <div className="section-title-center">
          <span className="section-kicker">METODOLOGIA IMERSIVA</span>
          <h2>Como Você Vai Aprender</h2>
          <p>Uma ponte viva entre a sabedoria dos povos originários e as ferramentas astronômicas contemporâneas.</p>
        </div>

        <div className="methodology-cards-grid">
          <div className="method-card">
            <div className="method-icon-box">🏹</div>
            <h3>Cosmovisão & Tradição Oral</h3>
            <p>
              Aprenda os mitos, a pronúncia em Tupi e o sentido cultural narrado por anciãos e pajés 
              das aldeias Potiguara da Baía da Traição.
            </p>
          </div>

          <div className="method-card">
            <div className="method-icon-box">🔭</div>
            <h3>Guia Prático para Stellarium</h3>
            <p>
              Ajuste data, hora e coordenadas de azimute e altitude no software planetário para enxergar 
              as figuras no céu real da sua cidade.
            </p>
          </div>

          <div className="method-card">
            <div className="method-icon-box">🌧️</div>
            <h3>Indicadores Ecológicos</h3>
            <p>
              Entenda como cada constelação governa o plantio do milho, a colheita da mandioca, o ciclo 
              das marés e o regime das chuvas.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final de Conversão */}
      <section className="landing-cta-banner">
        <div className="cta-banner-content">
          <h2>Pronto para testar seus conhecimentos em 1 minuto?</h2>
          <p>
            Experimente agora mesmo o desafio de conectar as constelações aos seus ciclos da natureza. 
            Não precisa de cadastro para começar!
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-hero-primary"
              onClick={() => navigateTo('exercicio')}
            >
              Fazer Exercício Prático Imediato ➔
            </button>
            <button
              className="btn-secondary-action"
              onClick={() => navigateTo('cadastro')}
            >
              Criar Conta Gratuita
            </button>
          </div>
        </div>
      </section>

      {/* Rodapé da Landing Page */}
      <footer className="landing-footer">
        <p>Projeto Etnoastronomia Indígena Potiguara & Stellarium • Saberes Ancestrais e Astronomia Cultural</p>
      </footer>
    </div>
  );
};
