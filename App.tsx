
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AppVault from './components/AppVault';
import AuthGuard from './components/AuthGuard';

const MASTER_KEY = 'AFFI-MASTER-777';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('affivault_access_key');
    if (savedKey === MASTER_KEY) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLaunch = () => {
    setView('app');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('affivault_access_key', MASTER_KEY);
  };

  if (view === 'landing') {
    return <LandingPage onLaunch={handleLaunch} />;
  }

  if (!isAuthenticated) {
    return <AuthGuard onBack={() => setView('landing')} onLogin={handleLoginSuccess} />;
  }

  return <AppVault onLogout={() => setView('landing')} />;
};

export default App;
