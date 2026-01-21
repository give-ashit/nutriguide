import React, { useState, useEffect } from 'react';
import { ViewState, UserProfile, INITIAL_USER } from './types';
import { useUser } from './hooks/useUser';
import Welcome from './components/screens/Welcome';
import SetupGoals from './components/screens/SetupGoals';
import SetupPersonal from './components/screens/SetupPersonal';
import Dashboard from './components/screens/Dashboard';
import WeeklyPlan from './components/screens/WeeklyPlan';
import Diary from './components/screens/Diary';
import Profile from './components/screens/Profile';
import BottomNav from './components/BottomNav';

export default function App() {
  const { user, userProfile, loading, isLoggedIn, registerUser, logout } = useUser();
  const [currentView, setCurrentView] = useState<ViewState>('welcome');
  const [localUser, setLocalUser] = useState<UserProfile>(INITIAL_USER);

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (!loading && isLoggedIn) {
      setCurrentView('dashboard');
    }
  }, [loading, isLoggedIn]);

  // Sync local user with database user
  useEffect(() => {
    if (userProfile) {
      setLocalUser(userProfile);
    }
  }, [userProfile]);

  const handleUpdateUser = (updates: Partial<UserProfile>) => {
    setLocalUser(prev => ({ ...prev, ...updates }));
  };

  const handleCompleteSetup = async () => {
    const success = await registerUser(localUser);
    if (success) {
      setCurrentView('dashboard');
    } else {
      alert('Failed to create account. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    setLocalUser(INITIAL_USER);
    setCurrentView('welcome');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full max-w-md mx-auto bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentView) {
      case 'welcome':
        return <Welcome onStart={() => setCurrentView('setup-goals')} />;
      case 'setup-goals':
        return (
          <SetupGoals
            user={localUser}
            onUpdate={handleUpdateUser}
            onNext={() => setCurrentView('setup-personal')}
            onBack={() => setCurrentView('welcome')}
          />
        );
      case 'setup-personal':
        return (
          <SetupPersonal
            user={localUser}
            onUpdate={handleUpdateUser}
            onNext={handleCompleteSetup}
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
        return <Profile user={userProfile || localUser} onLogout={handleLogout} />;
      default:
        return <Welcome onStart={() => setCurrentView('setup-goals')} />;
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