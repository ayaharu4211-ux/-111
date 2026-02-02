
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AppVault from './components/AppVault';
import AuthGuard from './components/AuthGuard';
import { MASTER_KEY, storage } from './lib/constants';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedKey = storage.get('affivault_access_key');
    if (savedKey === MASTER_KEY) {
      setIsAuthenticated(true);
    }
    setIsLoaded(true);
  }, []);

  const handleLaunch = () => {
    setView('app');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    storage.set('affivault_access_key', MASTER_KEY);
  };

  const handleLogout = () => {
    storage.remove('affivault_access_key');
    setIsAuthenticated(false);
    setView('landing');
  };

  if (!isLoaded) return null;

  if (view === 'landing') {
    return <LandingPage onLaunch={handleLaunch} />;
  }

  if (!isAuthenticated) {
    return <AuthGuard onBack={() => setView('landing')} onLogin={handleLoginSuccess} />;
  }

  return <AppVault onLogout={handleLogout} />;
};

export default App;
