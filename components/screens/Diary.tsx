import React from 'react';
import { useDiary } from '../../hooks/useDiary';
import { useHydration } from '../../hooks/useHydration';

const Diary: React.FC = () => {
  const {
    currentDate,
    meals,
    loading,
    dailySummary,
    changeDate,
    goToToday,
    addItem,
    removeItem,
    formatDate,
    isToday
  } = useDiary();

  const {
    glasses: waterIntake,
    goal: maxWater,
    handleGlassClick
  } = useHydration(currentDate);

  const calorieGoal = 2000;
  const remaining = Math.max(0, calorieGoal - dailySummary.totalCalories);

  const handleAddItem = async (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Add a quick item
    await addItem(sectionId, {
      name: 'Quick Added Item',
      calories: 150,
      description: '1 serving • 150 kcal',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbE_DuzwX93iKWQfaPNI1TUwPLMpNE5SYB_aheE1OPKHxIADku1mwcWYsvTio3AIYOwT4-G9DcCg4B80CYZ_e5nQcmYC1j9Y-1KwxzifJ6v2SksFmtx9I74aivf6eK8bKpO3ueCiFtj6fa5QPE_hsUrp_xgaou6HAWjh0eNF0_Fi-YWo_LQWZt0Q5H40-AywBVnDEEe8joFz_ms4gBiDoBCNkFiJdn3SUNdIXAcy81MESEY4ksafMeZEGFHlazitqO38wTDRnERiHH'
    });
  };

  const handleRemoveItem = async (sectionId: string, itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await removeItem(sectionId, itemId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4">
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md -mx-0 px-4 mb-4">
        <div className="flex items-center justify-between p-2">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="flex flex-col items-center cursor-pointer" onClick={goToToday}>
            <h2 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">
              {isToday ? "Today" : currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
            </h2>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">{formatDate(currentDate)}</span>
          </div>
          <button
            onClick={() => changeDate(1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </header>

      <main className="px-4 space-y-6">
        {/* Calories Card */}
        <section onClick={() => alert("Viewing detailed analysis")} className="cursor-pointer active:scale-[0.99] transition-transform">
          <div className="bg-primary/10 dark:bg-primary/5 rounded-xl p-6 border border-primary/20">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-wide">Calories Remaining</p>
                <h1 className="text-5xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">{remaining.toLocaleString()}</h1>
              </div>
              <div className="text-right">
                <span className="material-symbols-outlined text-primary text-3xl">insights</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm font-medium text-slate-900 dark:text-white">
                <div className="flex gap-4">
                  <span><span className="text-gray-500 font-normal">Goal</span> {calorieGoal.toLocaleString()}</span>
                  <span><span className="text-gray-500 font-normal">Food</span> {dailySummary.totalCalories.toLocaleString()}</span>
                </div>
                <span><span className="text-gray-500 font-normal">Protein</span> {dailySummary.totalProtein.toFixed(0)}g</span>
              </div>
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (dailySummary.totalCalories / calorieGoal) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Hydration */}
        <section>
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-water">water_drop</span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Hydration</h3>
              </div>
              <span className="text-sm font-bold text-water">{waterIntake}/{maxWater} glasses</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              {[...Array(maxWater)].map((_, i) => {
                const isFilled = i < waterIntake;
                return (
                  <button
                    key={i}
                    onClick={() => handleGlassClick(i)}
                    className={`flex-1 aspect-[3/4] rounded-lg flex items-center justify-center transition-all duration-200 active:scale-90 ${isFilled ? 'bg-water text-white shadow-sm hover:bg-water/90' : 'border-2 border-dashed border-water/40 text-water/40 hover:bg-white/50'}`}
                  >
                    <span className={`material-symbols-outlined text-[20px] ${isFilled ? 'fill' : ''}`}>local_drink</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Meal Sections */}
        <section className="flex flex-col gap-6">
          {meals.map((section) => (
            <div key={section.id} className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-1 overflow-hidden">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">{section.title}</h2>
                  <span className="text-sm font-medium text-gray-400">• {section.kcal} kcal</span>
                </div>
                <button
                  onClick={(e) => handleAddItem(section.id, e)}
                  className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-sm hover:bg-primary/90 active:scale-90 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">add</span>
                </button>
              </div>

              {section.items.length > 0 ? (
                <div className="flex flex-col bg-white dark:bg-background-dark rounded-lg overflow-hidden">
                  {section.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition group cursor-pointer" onClick={() => alert(`Edit ${item.name}`)}>
                      <div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${item.img}')` }}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold leading-tight text-slate-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 font-medium truncate">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{item.kcal}</span>
                        <button
                          onClick={(e) => handleRemoveItem(section.id, item.id, e)}
                          className="size-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-background-dark rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  {section.id === 'dinner' && (
                    <span className="material-symbols-outlined text-gray-300 dark:text-gray-700 text-4xl mb-2">dinner_dining</span>
                  )}
                  <p className="text-sm text-gray-500 font-medium">
                    {section.id === 'dinner' ? 'No food logged yet' : 'Fuel up when needed'}
                  </p>
                </div>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Diary;