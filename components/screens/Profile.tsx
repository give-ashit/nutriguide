import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../../types';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
  onUpdate: (data: Partial<UserProfile>) => void;
}

// --- Subcomponent: Stat Card ---
const StatCard = ({ label, value, unit, isDaily }: { label: string, value: string | number, unit: string, isDaily?: boolean }) => (
  <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 transition-colors">
    <p className="text-xs font-bold text-[#677e7e] dark:text-gray-400 uppercase tracking-widest mb-1">
      {label}
    </p>
    <p className={`font-extrabold text-[#4d7f80] ${isDaily ? 'text-[20px]' : 'text-2xl'}`}>
      {value}
      <span className="text-sm font-medium ml-0.5">{unit}</span>
    </p>
  </div>
);

// --- Subcomponent: Menu Item ---
const MenuItem = ({ icon, label, subLabel, hasArrow = true, hasBadge, isToggle, toggleValue, onToggle, onClick, colorClass = "text-[#4d7f80]" }: any) => {
  return (
    <div
      onClick={isToggle ? onToggle : onClick}
      className={`w-full flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0 cursor-pointer`}
    >
      <div className={`size-10 rounded-lg bg-[#4d7f80]/10 flex items-center justify-center ${colorClass} mr-4`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="flex-1 text-left font-semibold text-[#121616] dark:text-white">{label}</span>
     
      {subLabel && <span className="text-xs text-[#677e7e] mr-2">{subLabel}</span>}
      {hasBadge && <div className="bg-red-500 size-2 rounded-full mr-2"></div>}
     
      {isToggle ? (
        <div className="relative inline-flex items-center cursor-pointer pointer-events-none">
          <div className={`w-11 h-6 rounded-full peer transition-colors ${toggleValue ? 'bg-[#4d7f80]' : 'bg-gray-200 dark:bg-gray-700'}`}>
            <div className={`absolute top-[2px] left-[2px] bg-white border-gray-300 border rounded-full h-5 w-5 transition-all dark:border-gray-600 ${toggleValue ? 'translate-x-full border-white' : ''}`}></div>
          </div>
        </div>
      ) : (
        hasArrow && <span className="material-symbols-outlined text-gray-400 text-[20px]">chevron_right</span>
      )}
    </div>
  );
};

// --- Main Component ---
const Profile: React.FC<ProfileProps> = ({ user, onLogout, onUpdate }) => {
  const [isDark, setIsDark] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync edit name state when prop changes
  useEffect(() => {
    setEditName(user.name);
  }, [user.name]);

  // Handle Dark Mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleSaveName = () => {
    if (editName.trim()) {
      onUpdate({ name: editName });
    } else {
      setEditName(user.name); // Revert if empty
    }
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveName();
    if (e.key === 'Escape') {
      setEditName(user.name);
      setIsEditingName(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onUpdate({ avatar: imageUrl });
    }
  };

  const handleNavClick = (msg: string) => {
    console.log(`Navigated to: ${msg}`);
  };

  const defaultAvatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80";

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="bg-[#f9fafa] dark:bg-[#171a1c] min-h-screen text-[#121616] dark:text-white font-['Manrope'] transition-colors duration-300">
       
        {/* Top Navigation */}
        <nav className="sticky top-0 z-50 bg-[#f9fafa]/80 dark:bg-[#171a1c]/80 backdrop-blur-[20px] border-b border-gray-200 dark:border-gray-800 transition-colors">
          <div className="flex items-center p-4 justify-between max-w-md mx-auto">
            <button onClick={() => handleNavClick('Back')} className="w-10 flex items-center justify-start hover:opacity-70">
              <span className="material-symbols-outlined cursor-pointer">arrow_back_ios</span>
            </button>
            <h2 className="text-lg font-bold tracking-tight">Profile</h2>
            <button 
              onClick={() => isEditingName ? handleSaveName() : setIsEditingName(true)} 
              className="w-10 flex justify-end hover:opacity-70"
            >
              <span className={`material-symbols-outlined cursor-pointer ${isEditingName ? 'text-primary' : 'text-[#4d7f80]'}`}>
                {isEditingName ? 'check' : 'edit_note'}
              </span>
            </button>
          </div>
        </nav>

        <main className="max-w-md mx-auto">
          {/* Profile Header */}
          <section className="flex flex-col items-center px-6 pt-8 pb-4">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div
                className="size-32 rounded-full border-4 border-white dark:border-gray-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] bg-center bg-no-repeat bg-cover transition-colors group-hover:opacity-90"
                style={{ backgroundImage: `url("${user.avatar || defaultAvatar}")` }}
                role="img"
                aria-label="Profile picture"
              ></div>
              <div className="absolute bottom-1 right-1 bg-[#4d7f80] text-white size-8 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 transition-colors">
                <span className="material-symbols-outlined text-[18px]">camera_alt</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>
           
            <div className="mt-4 text-center w-full">
              {isEditingName ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="text-2xl font-extrabold tracking-tight text-center bg-transparent border-b-2 border-primary focus:outline-none w-full max-w-[200px]"
                />
              ) : (
                <h1 className="text-2xl font-extrabold tracking-tight">{user.name}</h1>
              )}
              <p className="text-[#677e7e] dark:text-gray-400 font-medium">Premium Member</p>
            </div>

            <div className="mt-4 bg-[#4d7f80] px-4 py-1.5 rounded-full flex items-center gap-2 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <span className="material-symbols-outlined text-white text-[18px]">workspace_premium</span>
              <span className="text-white text-sm font-bold tracking-wide">5kg lost • 12-day streak</span>
            </div>
          </section>

          {/* Stats */}
          <section className="px-6 py-4">
            <div className="flex gap-4">
              <StatCard label="Current" value={user.weight} unit="kg" />
              <StatCard label="Goal" value={70} unit="kg" />
              <StatCard label="Daily" value="1.8k" unit="kcal" isDaily />
            </div>
          </section>

          {/* Menu Items */}
          <section className="px-6 py-4 space-y-6">
           
            {/* Personal Info */}
            <div>
              <h3 className="text-[#677e7e] dark:text-gray-400 text-xs font-bold uppercase tracking-[0.15em] mb-3 ml-1">Personal Info</h3>
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 transition-colors">
                <MenuItem icon="person" label="Account Details" onClick={() => handleNavClick('Account')} />
                <MenuItem icon="straighten" label="Body Metrics" onClick={() => handleNavClick('Metrics')} />
              </div>
            </div>

            {/* Health & Nutrition */}
            <div>
              <h3 className="text-[#677e7e] dark:text-gray-400 text-xs font-bold uppercase tracking-[0.15em] mb-3 ml-1">Health & Nutrition</h3>
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 transition-colors">
                <MenuItem icon="target" label="Weight Goals" onClick={() => handleNavClick('Goals')} />
                <MenuItem icon="restaurant_menu" label="Dietary Preferences" subLabel="Keto" onClick={() => handleNavClick('Diet')} />
                <MenuItem icon="trophy" label="Achievements" hasBadge onClick={() => handleNavClick('Achievements')} />
              </div>
            </div>

            {/* System */}
            <div>
              <h3 className="text-[#677e7e] dark:text-gray-400 text-xs font-bold uppercase tracking-[0.15em] mb-3 ml-1">System</h3>
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 transition-colors">
                <MenuItem icon="notifications" label="Notifications" onClick={() => handleNavClick('Notifications')} />
                <MenuItem
                  icon="dark_mode"
                  label="Dark Mode"
                  isToggle
                  toggleValue={isDark}
                  onToggle={() => setIsDark(!isDark)}
                />
                <MenuItem icon="settings" label="App Settings" onClick={() => handleNavClick('Settings')} />
              </div>
            </div>

            {/* Logout */}
            <div className="pt-4 pb-8">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 text-red-500 rounded-2xl font-bold shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-red-50/50 dark:border-red-900/20 active:scale-95 transition-all hover:bg-red-50 dark:hover:bg-red-900/10"
              >
                <span className="material-symbols-outlined">logout</span>
                Log Out
              </button>
              <p className="text-center text-xs text-[#677e7e] mt-6 dark:text-gray-500">Version 2.4.1 (Build 882)</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;