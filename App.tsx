
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AppVault from './components/AppVault';
import AuthGuard from './components/AuthGuard';

const MASTER_KEY = 'AFFI-MASTER-777';

// 安全なストレージ操作ユーティリティ
export const storage = {
  get: (key: string) => {
    try {
      return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    } catch (e) {
      console.warn("Storage access denied", e);
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  },
  remove: (key: string) => {
    try {
      if (typeof window !== 'undefined') window.localStorage.removeItem(key);
    } catch (e) {
      console.warn("Storage removal failed", e);
    }
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedKey = storage.get('affivault_access_key');
    if (savedKey === MASTER_KEY) {
      setIsAuthenticated(true);
    }
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

  if (view === 'landing') {
    return <LandingPage onLaunch={handleLaunch} />;
  }

  if (!isAuthenticated) {
    return <AuthGuard onBack={() => setView('landing')} onLogin={handleLoginSuccess} />;
  }

  return <AppVault onLogout={handleLogout} />;
};

export default App;
