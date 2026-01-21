import React, { useState } from 'react';
import { ViewState, UserProfile, INITIAL_USER } from './types';
import Welcome from './components/screens/Welcome';
import NutriGuideSignUp from './components/screens/signup';
import SetupGoals from './components/screens/SetupGoals';
import SetupPersonal from './components/screens/SetupPersonal';
import Dashboard from './components/screens/Dashboard';
import WeeklyPlan from './components/screens/WeeklyPlan';
import Diary from './components/screens/Diary';
import Profile from './components/screens/Profile';
import ScannerApp from './components/screens/qrcode';
import BottomNav from './components/BottomNav';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('welcome');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  const handleUpdateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const renderScreen = () => {
    switch (currentView) {
      case 'welcome':
        return (
          <Welcome 
            onStart={() => setCurrentView('setup-goals')} 
            onSignUp={() => setCurrentView('signup')}
          />
        );
      case 'signup':
        return (
          <NutriGuideSignUp 
            onLogin={() => setCurrentView('welcome')} 
          />
        );
      case 'setup-goals':
        return (
          <SetupGoals 
            user={user} 
            onUpdate={handleUpdateUser} 
            onNext={() => setCurrentView('setup-personal')} 
            onBack={() => setCurrentView('welcome')} 
          />
        );
      case 'setup-personal':
        return (
          <SetupPersonal 
            user={user} 
            onUpdate={handleUpdateUser} 
            onNext={() => setCurrentView('dashboard')} 
            onBack={() => setCurrentView('setup-goals')} 
          />
        );
      case 'dashboard':
        return <Dashboard />;
      case 'weekly':
        return <WeeklyPlan />;
      case 'diary':
        return <Diary />;
      case 'profile':
        return <Profile user={user} onUpdate={handleUpdateUser} onLogout={() => setCurrentView('welcome')} />;
      case 'scanner':
        return <ScannerApp onClose={() => setCurrentView('dashboard')} />;
      default:
        return <Welcome onStart={() => setCurrentView('setup-goals')} onSignUp={() => setCurrentView('signup')} />;
    }
  };

  const showBottomNav = ['dashboard', 'weekly', 'diary', 'profile'].includes(currentView);

  return (
    <div className="relative flex flex-col h-full min-h-screen w-full max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden transition-colors duration-200">
      <main className={`flex-1 overflow-y-auto overflow-x-hidden ${showBottomNav ? 'pb-24' : ''} no-scrollbar`}>
        {renderScreen()}
      </main>
      
      {showBottomNav && (
        <BottomNav currentView={currentView} onViewChange={setCurrentView} />
      )}
    </div>
  );
}