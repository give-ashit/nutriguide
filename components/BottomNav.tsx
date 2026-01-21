import React from 'react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }) => {
  const navItems: { id: ViewState; icon: string; label: string; fill?: boolean }[] = [
    { id: 'dashboard', icon: 'dashboard', label: 'Home' },
    { id: 'weekly', icon: 'calendar_month', label: 'Plan' },
    { id: 'diary', icon: 'menu_book', label: 'Diary' },
    { id: 'profile', icon: 'person', label: 'Profile', fill: true },
  ];

  // Insert SCAN button in middle visually
  const leftItems = navItems.slice(0, 2);
  const rightItems = navItems.slice(2);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full max-w-md mx-auto">
        <div className="relative group">
             {/* Floating FAB */}
            <button 
                className="absolute -top-6 left-1/2 -translate-x-1/2 size-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center border-4 border-background-light dark:border-background-dark hover:scale-105 transition-transform duration-200 z-10 active:scale-95"
                onClick={() => onViewChange('scanner')} 
            >
                <span className="material-symbols-outlined text-[28px]">qr_code_scanner</span>
            </button>

            <div className="bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 px-6 py-3 pb-6 flex justify-between items-center shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)] relative z-0">
                {leftItems.map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={`flex flex-col items-center gap-1 w-12 transition-colors duration-200 ${currentView === item.id ? 'text-primary' : 'text-text-secondary-light dark:text-gray-500 hover:text-primary'}`}
                    >
                        <span className={`material-symbols-outlined text-2xl ${currentView === item.id && item.fill ? 'fill' : ''}`}>
                            {item.icon}
                        </span>
                        <span className="text-[10px] font-bold">{item.label}</span>
                    </button>
                ))}

                {/* Spacer for FAB */}
                <div className="w-12"></div>

                {rightItems.map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={`flex flex-col items-center gap-1 w-12 transition-colors duration-200 ${currentView === item.id ? 'text-primary' : 'text-text-secondary-light dark:text-gray-500 hover:text-primary'}`}
                    >
                         <span className={`material-symbols-outlined text-2xl ${currentView === item.id && item.fill ? 'fill' : ''}`}>
                            {item.icon}
                        </span>
                        <span className="text-[10px] font-bold">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};

export default BottomNav;