import React from 'react';
import { UserProfile } from '../../types';

interface SetupGoalsProps {
  user: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SetupGoals: React.FC<SetupGoalsProps> = ({ user, onUpdate, onNext, onBack }) => {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
        <div className="flex items-center p-4 pb-2 justify-between">
          <button onClick={onBack} className="text-slate-800 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center pr-10">Profile Setup</h2>
        </div>
        {/* Progress */}
        <div className="flex w-full flex-row items-center justify-center gap-2 py-3 px-6">
          <div className="h-1.5 flex-1 rounded-full bg-primary"></div>
          <div className="h-1.5 flex-1 rounded-full bg-primary/30"></div>
          <div className="h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </header>

      <main className="flex-1 px-5 pt-4 animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight mb-2">Your Lifestyle & Goals</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-medium">Help us tailor your plan to your daily life.</p>
        </div>

        {/* Activity Level */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-xl">directions_run</span>
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Activity Level</h3>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { id: 'sedentary', icon: 'chair', label: 'Sedentary', desc: 'Little or no exercise, desk job' },
              { id: 'lightly_active', icon: 'steps', label: 'Lightly Active', desc: 'Exercise 1-3 days/week' },
              { id: 'moderately_active', icon: 'hiking', label: 'Moderately Active', desc: 'Exercise 3-5 days/week' },
              { id: 'very_active', icon: 'bolt', label: 'Very Active', desc: 'Exercise 6-7 days/week' },
            ].map((option) => (
              <label key={option.id} className="group relative cursor-pointer block">
                <input 
                  type="radio" 
                  name="activity" 
                  className="peer sr-only" 
                  checked={user.activityLevel === option.id}
                  onChange={() => onUpdate({ activityLevel: option.id as any })}
                />
                <div className="flex items-center p-4 rounded-2xl border-2 border-transparent bg-surface-light dark:bg-surface-dark shadow-soft transition-all duration-300 hover:scale-[1.01] peer-checked:border-primary peer-checked:bg-primary-light dark:peer-checked:bg-primary/10">
                  <div className={`size-12 shrink-0 rounded-xl flex items-center justify-center transition-colors duration-300 ${user.activityLevel === option.id ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    <span className="material-symbols-outlined">{option.icon}</span>
                  </div>
                  <div className="ml-4 flex-1">
                    <span className="block text-base font-bold text-slate-900 dark:text-white">{option.label}</span>
                    <span className="block text-sm text-slate-500 dark:text-slate-400 mt-0.5">{option.desc}</span>
                  </div>
                  {user.activityLevel === option.id && (
                    <div className="size-6 rounded-full bg-primary text-white flex items-center justify-center animate-fade-in-up">
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Goal */}
        <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-xl">flag</span>
                <h3 className="text-slate-900 dark:text-white text-lg font-bold">What is your goal?</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
                {[
                    { id: 'lose', icon: 'monitor_weight', label: 'Lose\nWeight' },
                    { id: 'maintain', icon: 'balance', label: 'Maintain\nWeight' },
                    { id: 'gain', icon: 'fitness_center', label: 'Gain\nMuscle' },
                ].map((g) => (
                    <label key={g.id} className="cursor-pointer group">
                        <input 
                            type="radio" 
                            name="goal" 
                            className="peer sr-only" 
                            checked={user.goal === g.id}
                            onChange={() => onUpdate({ goal: g.id as any })}
                        />
                        <div className="h-32 rounded-2xl bg-surface-light dark:bg-surface-dark border-2 border-transparent shadow-soft flex flex-col items-center justify-center p-3 text-center transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary-light dark:peer-checked:bg-primary/20">
                            <div className={`mb-2 size-10 rounded-full flex items-center justify-center transition-colors ${user.goal === g.id ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                <span className="material-symbols-outlined text-xl">{g.icon}</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight whitespace-pre-line">{g.label}</span>
                        </div>
                    </label>
                ))}
            </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30 p-5 pt-2 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark w-full max-w-md mx-auto">
        <button onClick={onNext} className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-lg font-bold h-14 transition-all duration-200 shadow-glow active:scale-[0.98]">
          Continue
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default SetupGoals;