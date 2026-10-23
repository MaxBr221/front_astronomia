import React from 'react';
import { useApp } from './context/AppContext';
import { DemoBar } from './components/layout/DemoBar';
import { Header } from './components/layout/Header';
import { LandingPage } from './pages/LandingPage';
import { TrilhaPage } from './pages/TrilhaPage';
import { ConstelacaoPage } from './pages/ConstelacaoPage';
import { ObservatorioPage } from './pages/ObservatorioPage';
import { ExercicioPage } from './pages/ExercicioPage';
import { LoginPage } from './pages/LoginPage';
import { CadastroPage } from './pages/CadastroPage';

export const App: React.FC = () => {
  const { currentScreen, isAuthenticated } = useApp();

  const showMainHeader = ['trilha', 'constelacao', 'observatorio', 'exercicio'].includes(currentScreen);

  return (
    <div id="app">
      {/* Barra de Navegação Rápida (Demo Mode para Pitch) */}
      <DemoBar />

      {/* Cabeçalho Ancestral do Aluno (exibido nas telas do curso) */}
      {showMainHeader && <Header />}

      <main id="screen-container">
        {currentScreen === 'landing' && (isAuthenticated ? <TrilhaPage /> : <LandingPage />)}
        {currentScreen === 'trilha' && <TrilhaPage />}
        {currentScreen === 'constelacao' && <ConstelacaoPage />}
        {currentScreen === 'observatorio' && <ObservatorioPage />}
        {currentScreen === 'exercicio' && <ExercicioPage />}
        {currentScreen === 'login' && (isAuthenticated ? <TrilhaPage /> : <LoginPage />)}
        {currentScreen === 'cadastro' && (isAuthenticated ? <TrilhaPage /> : <CadastroPage />)}
      </main>
    </div>
  );
};
