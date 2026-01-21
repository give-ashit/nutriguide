import React from 'react';
import { UserProfile } from '../../types';

interface SetupPersonalProps {
  user: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SetupPersonal: React.FC<SetupPersonalProps> = ({ user, onUpdate, onNext, onBack }) => {
  return (
    <div className="flex flex-col min-h-screen pb-24 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="flex items-center justify-between p-4 pt-6 pb-2 z-20">
        <button onClick={onBack} className="flex size-12 shrink-0 items-center justify-center rounded-full text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center pr-12">Personal Profile</h2>
      </header>

      {/* Progress */}
      <div className="px-6 py-2">
        <div className="flex justify-between items-end mb-2">
          <span className="text-primary text-sm font-bold tracking-wider uppercase">Step 2 of 4</span>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">50% Completed</span>
        </div>
        <div className="h-1.5 w-full bg-[#d8dfdf] dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: '50%' }}></div>
        </div>
      </div>

      <main className="flex-1 px-6 pt-4 animate-fade-in-up">
        <div className="mb-8 mt-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Tell us about <br />
            <span className="text-primary">yourself.</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-base font-medium">This helps us tailor your nutrition plan.</p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Gender */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-1.5 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
            <div className="flex w-full">
              {['male', 'female'].map((g) => (
                <label key={g} className="group relative flex-1 cursor-pointer">
                  <input 
                    type="radio" 
                    name="gender" 
                    className="peer sr-only" 
                    checked={user.gender === g}
                    onChange={() => onUpdate({ gender: g as any })}
                  />
                  <span className={`flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold capitalize transition-all ${user.gender === g ? 'bg-primary text-white shadow-md' : 'text-gray-500 dark:text-gray-400'}`}>
                    {g}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Age */}
          <div className="group relative rounded-2xl bg-surface-light dark:bg-surface-dark p-5 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800 transition-all focus-within:ring-2 focus-within:ring-primary/50">
            <div className="flex justify-between items-start">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Age</label>
              <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 group-focus-within:text-primary transition-colors">calendar_today</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <input 
                type="number" 
                value={user.age} 
                onChange={(e) => onUpdate({ age: parseInt(e.target.value) || 0 })}
                className="w-full bg-transparent text-4xl font-bold text-slate-900 dark:text-white placeholder-gray-200 dark:placeholder-gray-700 focus:outline-none p-0 border-none tabular-nums"
              />
              <span className="text-base font-medium text-gray-400 dark:text-gray-500 mb-1">years</span>
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-800 w-full my-1"></div>

          <div className="grid grid-cols-2 gap-4">
             {/* Height */}
            <div className="group relative rounded-2xl bg-surface-light dark:bg-surface-dark p-5 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800 transition-all focus-within:ring-2 focus-within:ring-primary/50">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Height</label>
                <div className="flex items-baseline gap-1">
                <input 
                    type="number" 
                    value={user.height}
                    onChange={(e) => onUpdate({ height: parseInt(e.target.value) || 0 })}
                    className="w-full bg-transparent text-3xl font-bold text-slate-900 dark:text-white placeholder-gray-200 dark:placeholder-gray-700 focus:outline-none p-0 border-none tabular-nums"
                />
                <span className="text-sm font-bold text-primary mb-1">cm</span>
                </div>
            </div>

            {/* Weight */}
            <div className="group relative rounded-2xl bg-surface-light dark:bg-surface-dark p-5 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800 transition-all focus-within:ring-2 focus-within:ring-primary/50">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Weight</label>
                <div className="flex items-baseline gap-1">
                <input 
                    type="number" 
                    value={user.weight}
                    onChange={(e) => onUpdate({ weight: parseInt(e.target.value) || 0 })}
                    className="w-full bg-transparent text-3xl font-bold text-slate-900 dark:text-white placeholder-gray-200 dark:placeholder-gray-700 focus:outline-none p-0 border-none tabular-nums"
                />
                <span className="text-sm font-bold text-primary mb-1">kg</span>
                </div>
            </div>
          </div>

          <div className="flex gap-2 items-start px-1 opacity-70">
            <span className="material-symbols-outlined text-primary mt-0.5 text-base">info</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                We use these details to calculate your Body Mass Index (BMI) and daily calorie needs accurately.
            </p>
          </div>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark pt-12">
        <button 
            onClick={onNext}
            className="group w-full h-14 bg-primary rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-200"
        >
          <span className="text-white text-lg font-bold">Next Step</span>
          <span className="material-symbols-outlined text-white transition-transform group-hover:translate-x-1">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default SetupPersonal;