import React from 'react';
import { useWeeklyPlan } from '../../hooks/useWeeklyPlan';

const WeeklyPlan: React.FC = () => {
  const {
    selectedDate,
    meals,
    snacks,
    loading,
    totalCalories,
    calorieGoal,
    days,
    toggleStatus,
    addSnack,
    removeSnack,
    selectDay
  } = useWeeklyPlan();

  const progressPercent = Math.min(100, (totalCalories / calorieGoal) * 100);

  const handleSwap = (mealName: string) => {
    alert(`Opening meal alternatives for: ${mealName}`);
  };

  const selectedDayIndex = days.findIndex(d => {
    const dayDate = d.date;
    return dayDate.getDate() === selectedDate.getDate() &&
      dayDate.getMonth() === selectedDate.getMonth();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-6 pt-8 pb-4 border-b border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-primary/70 dark:text-primary/50">
              {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <h1 className="text-2xl font-bold tracking-tight">
              {selectedDayIndex === 2 ? "Today's Plan" : `${days[selectedDayIndex]?.d || ''} Plan`}
            </h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => alert("Opening Calendar...")} className="size-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700 active:scale-95 transition">
              <span className="material-symbols-outlined text-xl">calendar_month</span>
            </button>
            <button onClick={() => alert("Opening Plan Settings...")} className="size-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700 active:scale-95 transition">
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto no-scrollbar flex gap-4 pb-2 -mx-6 px-6">
          {days.map((day, index) => {
            const isActive = index === selectedDayIndex;
            return (
              <div
                key={index}
                onClick={() => selectDay(day.date)}
                className={`flex flex-col items-center min-w-[54px] py-3 rounded-2xl shadow-sm border transition-all cursor-pointer ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/10 border-primary scale-105' : 'bg-white dark:bg-white/5 border-black/5 dark:border-white/5 text-slate-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10'}`}
              >
                <span className={`text-xs ${isActive ? 'opacity-80' : 'text-gray-400'}`}>{day.d}</span>
                <span className="text-lg font-bold">{day.n}</span>
              </div>
            );
          })}
        </div>
      </header>

      <div className="px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6">
        <div className="flex-shrink-0 flex flex-col gap-1 p-4 min-w-[140px] bg-primary/10 dark:bg-primary/20 rounded-xl border border-primary/20">
          <p className="text-[10px] uppercase tracking-widest font-bold text-primary dark:text-primary/70">Calories</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{totalCalories.toLocaleString()} <span className="text-sm font-normal text-gray-500">/ {calorieGoal / 1000}k</span></p>
          <div className="w-full h-1.5 bg-white/50 dark:bg-black/20 rounded-full mt-1 overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col gap-1 p-4 min-w-[100px] bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Protein</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">85g</p>
          <p className="text-[10px] text-gray-500">Target: 120g</p>
        </div>
        <div className="flex-shrink-0 flex flex-col gap-1 p-4 min-w-[100px] bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Carbs</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">160g</p>
          <p className="text-[10px] text-gray-500">Target: 180g</p>
        </div>
      </div>

      <main className="flex-1 px-6 pb-24 space-y-6 mt-4">
        {meals.map((block) => (
          <section key={block.id}>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{block.section}</h3>
              {block.status ? (
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">{block.status}</span>
              ) : (
                <span className="text-xs font-medium text-gray-400">{block.time}</span>
              )}
            </div>
            <div className="group relative flex items-center gap-4 bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 hover:shadow-md transition-shadow">
              <div className="w-20 h-20 rounded-xl bg-center bg-cover flex-shrink-0" style={{ backgroundImage: `url('${block.item.img}')` }}></div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold truncate text-slate-900 dark:text-white">{block.item.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{block.item.desc}</p>
                <div className="mt-3 flex items-center gap-2">
                  {block.status === 'Completed' ? (
                    <button
                      onClick={() => toggleStatus(block.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold transition-all hover:bg-primary/90 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Eaten
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleStatus(block.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm">circle</span>
                        Mark as Eaten
                      </button>
                      <button
                        onClick={() => handleSwap(block.item.name)}
                        className="p-1.5 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary transition active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm">swap_horiz</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}

        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-bold text-lg text-gray-400">Snacks</h3>
            <button
              onClick={addSnack}
              className="text-primary text-xs font-bold flex items-center gap-1 hover:opacity-80 transition active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">add</span> Add
            </button>
          </div>

          {snacks.length > 0 ? (
            <div className="flex flex-col gap-3">
              {snacks.map((snack) => (
                <div key={snack.id} className="group relative flex items-center gap-4 bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 animate-fade-in-up">
                  <div className="w-16 h-16 rounded-xl bg-center bg-cover flex-shrink-0" style={{ backgroundImage: `url('${snack.img}')` }}></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold truncate text-slate-900 dark:text-white">{snack.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{snack.desc}</p>
                  </div>
                  <button
                    onClick={() => removeSnack(snack.id, snack.kcal)}
                    className="size-8 rounded-full bg-gray-100 dark:bg-white/10 text-gray-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-primary/5 border-2 border-dashed border-primary/20 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="size-12 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-sm mb-3">
                <span className="material-symbols-outlined text-primary">nutrition</span>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No snacks planned yet</p>
              <p className="text-xs text-gray-400 mt-1">You still have {Math.max(0, calorieGoal - totalCalories)} kcal remaining</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default WeeklyPlan;