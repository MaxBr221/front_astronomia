import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DICIONARIO_ASTRONOMICO } from '../services/dicionarioData';
import { TermoDicionarioDTO } from '../types';
import { audioSystem } from '../utils/audioSystem';

export const DicionarioPage: React.FC = () => {
  const { navigateTo } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [sortOrder, setSortOrder] = useState<'tupi' | 'pt'>('tupi');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const categories = [
    { id: 'todos', label: '✨ Todos os Termos', count: DICIONARIO_ASTRONOMICO.length },
    { id: 'astros', label: '☀️ Astros & Céu', count: DICIONARIO_ASTRONOMICO.filter(t => t.categoria === 'astros').length },
    { id: 'estrelas', label: '⭐ Estrelas Sagradas', count: DICIONARIO_ASTRONOMICO.filter(t => t.categoria === 'estrelas').length },
    { id: 'constelacoes', label: '🏹 Constelações', count: DICIONARIO_ASTRONOMICO.filter(t => t.categoria === 'constelacoes').length },
    { id: 'lua', label: '🌙 Fases da Lua', count: DICIONARIO_ASTRONOMICO.filter(t => t.categoria === 'lua').length },
    { id: 'universo', label: '🌌 Cosmos & Universo', count: DICIONARIO_ASTRONOMICO.filter(t => t.categoria === 'universo').length }
  ];

  // Filtro e Ordenação
  const filteredTerms = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return DICIONARIO_ASTRONOMICO.filter(item => {
      const matchCategory = selectedCategory === 'todos' || item.categoria === selectedCategory;
      const matchSearch =
        item.tupi.toLowerCase().includes(query) ||
        item.portugues.toLowerCase().includes(query) ||
        (item.detalhe && item.detalhe.toLowerCase().includes(query)) ||
        (item.regiaoCeleste && item.regiaoCeleste.toLowerCase().includes(query));

      return matchCategory && matchSearch;
    }).sort((a, b) => {
      if (sortOrder === 'tupi') {
        return a.tupi.localeCompare(b.tupi, 'pt-BR');
      }
      return a.portugues.localeCompare(b.portugues, 'pt-BR');
    });
  }, [searchTerm, selectedCategory, sortOrder]);

  const handlePronounce = (item: TermoDicionarioDTO) => {
    audioSystem.playClick();
    setSpeakingId(item.id);
    const textToSpeak = `${item.tupi}... Em português: ${item.portugues}`;
    audioSystem.speak(textToSpeak);

    setTimeout(() => {
      setSpeakingId(null);
    }, 2800);
  };

  return (
    <div className="screen-wrapper">
      {/* Navegação Superior */}
      <div className="page-navigation-bar">
        <button
          className="btn-back"
          onClick={() => {
            audioSystem.playClick();
            navigateTo('trilha');
          }}
        >
          ← Voltar para a Trilha
        </button>
        <div className="screen-breadcrumbs">
          Trilha Celeste &gt; <span>Dicionário Astronômico Tupi-Guarani</span>
        </div>
      </div>

      {/* Hero do Dicionário */}
      <div className="dict-hero">
        <div className="dict-hero-badge">
          <span>📖</span> Vocabulário Etnoastronômico Indígena
        </div>
        <h2>Dicionário Cósmico & <span>Língua Tupi-Guarani</span></h2>
        <p>
          Glossário sagrado das constelações, estrelas, fases da lua (Iasy) e elementos celestes preservados pelas tradições dos povos originários do Brasil.
        </p>

        {/* Barra de Pesquisa */}
        <div className="dict-search-wrapper">
          <span className="dict-search-icon">🔍</span>
          <input
            type="text"
            className="dict-search-input"
            placeholder="Buscar por termo em Tupi (ex: Iasy, Tapi'ira, Kuarasy) ou significado em Português..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="dict-search-clear"
              onClick={() => setSearchTerm('')}
              title="Limpar busca"
            >
              ✕
            </button>
          )}
        </div>

        {/* Pílulas de Categoria */}
        <div className="dict-category-pills">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`dict-cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => {
                audioSystem.playClick();
                setSelectedCategory(cat.id);
              }}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Barra de Controles: Contagem e Ordenação */}
      <div className="dict-toolbar-row">
        <div className="dict-count-info">
          Exibindo <strong>{filteredTerms.length}</strong> de <strong>{DICIONARIO_ASTRONOMICO.length}</strong> palavras registradas
        </div>

        <div className="dict-sort-group">
          <span className="dict-sort-label">Ordenar por:</span>
          <button
            className={`dict-sort-btn ${sortOrder === 'tupi' ? 'active' : ''}`}
            onClick={() => setSortOrder('tupi')}
          >
            Tupi (A-Z)
          </button>
          <button
            className={`dict-sort-btn ${sortOrder === 'pt' ? 'active' : ''}`}
            onClick={() => setSortOrder('pt')}
          >
            Português (A-Z)
          </button>
        </div>
      </div>

      {/* Grid de Cards do Dicionário */}
      <div className="dict-cards-grid">
        {filteredTerms.length === 0 ? (
          <div className="dict-empty-state">
            <div className="dict-empty-icon">🌌</div>
            <h3>Nenhum termo encontrado</h3>
            <p>Nenhuma palavra correspondeu aos critérios da busca "{searchTerm}".</p>
            <button
              className="btn-primary-highlight"
              style={{ marginTop: '14px' }}
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('todos');
              }}
            >
              Limpar Filtros e Ver Todos
            </button>
          </div>
        ) : (
          filteredTerms.map(item => {
            const isSpeaking = speakingId === item.id;

            return (
              <div key={item.id} className="dict-card" id={`term-${item.id}`}>
                <div className="dict-card-header">
                  <div className="dict-card-badge-group">
                    <span className="dict-item-icon">{item.icone}</span>
                    <span className="dict-cat-tag">{item.categoriaLabel}</span>
                  </div>

                  <button
                    className={`btn-dict-listen ${isSpeaking ? 'speaking' : ''}`}
                    onClick={() => handlePronounce(item)}
                    title="Ouvir pronúncia e significado"
                  >
                    {isSpeaking ? '🔊 Ouvindo...' : '🗣️ Pronunciar'}
                  </button>
                </div>

                <div className="dict-card-body">
                  <div className="dict-word-tupi">
                    {item.tupi}
                  </div>
                  <div className="dict-word-pt">
                    {item.portugues}
                  </div>

                  {item.regiaoCeleste && (
                    <div className="dict-region-tag">
                      📍 {item.regiaoCeleste}
                    </div>
                  )}

                  {item.detalhe && (
                    <p className="dict-detail-text">
                      {item.detalhe}
                    </p>
                  )}
                </div>

                <div className="dict-card-footer">
                  <span className="dict-footer-hint">Tronco Tupi-Guarani</span>
                  <button
                    className="dict-quick-copy"
                    onClick={() => {
                      navigator.clipboard.writeText(`${item.tupi} - ${item.portugues}`);
                      audioSystem.playSuccess();
                    }}
                    title="Copiar termo"
                  >
                    📋 Copiar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
