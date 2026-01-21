import React from 'react';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
            className="h-full w-full bg-cover bg-center bg-no-repeat transition-transform duration-[20s] hover:scale-105" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD8eRkPlT9vyVBV4XIAiIwjn8dgf_ALrIMQsVPAvq5eeL-MqqgjjJEN83uk_FMm9eotVQV9wr2HmrJXCqSIfhRzaFh4Smp1XFHZNZ3CdHrbawVvlJnbjrT-Yzc4xuGdNpqSpO4wkUjFJwGTt9Rx7beNGWdZYqqeRrRbxxyQBhdh-0szmfmo0K2TfaZiOfUBlZmIfVXJ1eK2cHPhCHmwmDyDGNG7EUGNnk-lz96xkd_Jdwk6hsngJMevEyP8Ex5DwAiCBtEpbq1x046f')" }}
        ></div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/60 to-background-light dark:from-black/30 dark:via-black/60 dark:to-background-dark"></div>
        {/* Tint */}
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex h-full flex-col justify-between px-6 pb-12 pt-16">
        {/* Top Section */}
        <div className="flex flex-col items-center justify-start pt-12 animate-fade-in-down">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/90 shadow-xl ring-1 ring-primary/10 backdrop-blur-sm dark:bg-background-dark/90 dark:ring-white/10">
            <span className="material-symbols-outlined text-5xl text-primary">eco</span>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              NutriGuide
            </h1>
            <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-secondary"></div>
            <p className="mt-4 max-w-xs text-center text-lg font-medium text-gray-600 dark:text-gray-300">
              Personalized nutrition <br className="hidden sm:block" />for a better you
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex w-full flex-col gap-4 animate-fade-in-up delay-200">
          <button 
            onClick={onStart}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-primary px-6 py-4 text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl active:scale-[0.98]"
          >
            <span className="relative flex items-center gap-2">
              Get Started
              <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
            </span>
          </button>
          
          <button className="flex w-full items-center justify-center rounded-xl border-2 border-primary/20 bg-white/50 px-6 py-4 text-lg font-bold text-primary backdrop-blur-sm transition-colors hover:border-primary hover:bg-white/80 dark:border-white/10 dark:bg-black/20 dark:text-white dark:hover:bg-black/40 active:scale-[0.98]">
            Log In
          </button>
          
          <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            By continuing, you agree to our <a href="#" className="underline decoration-secondary underline-offset-2 hover:text-primary">Terms</a> & <a href="#" className="underline decoration-secondary underline-offset-2 hover:text-primary">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;