import React, { useState, useEffect } from 'react';
import { useDiary } from '../../hooks/useDiary';
import { useHydration } from '../../hooks/useHydration';
import { getCurrentUserId } from '../../lib/supabase';
import { getUser } from '../../services/userService';

type RecommendedItem = {
  id: string;
  label: string;
  title: string;
  calStr: string;
  kcal: number;
  img: string;
};

const Dashboard: React.FC = () => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [calorieGoal, setCalorieGoal] = useState(2200);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [extraConsumed, setExtraConsumed] = useState(0);

  const { dailySummary, addItem } = useDiary();
  const { glasses: waterIntake, goal: waterGoal, addWater, removeWater } = useHydration();

  // Load user's calorie goal
  useEffect(() => {
    const loadUser = async () => {
      const userId = getCurrentUserId();
      if (userId) {
        const user = await getUser(userId);
        if (user?.calorie_goal) {
          setCalorieGoal(user.calorie_goal);
        }
      }
    };
    loadUser();
  }, []);

  const totalConsumed = dailySummary.totalCalories + extraConsumed;
  const remaining = Math.max(0, calorieGoal - totalConsumed);
  const percentage = Math.min(100, (totalConsumed / calorieGoal) * 100);

  // Calculate remaining macros based on goal
  const proteinTarget = Math.round(calorieGoal * 0.25 / 4); // 25% of calories from protein
  const carbsTarget = Math.round(calorieGoal * 0.45 / 4); // 45% of calories from carbs
  const fatsTarget = Math.round(calorieGoal * 0.30 / 9); // 30% of calories from fats

  const proteinRemaining = Math.max(0, proteinTarget - dailySummary.totalProtein);
  const carbsRemaining = Math.max(0, carbsTarget - dailySummary.totalCarbs);
  const fatsRemaining = Math.max(0, fatsTarget - dailySummary.totalFats);

  const recommendedItems: RecommendedItem[] = [
    {
      id: 'rec_1',
      label: 'Breakfast',
      title: 'Oatmeal with Berries',
      calStr: '320 kcal • 12g Protein',
      kcal: 320,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqyqxp0Ouwuwa6jS6ovicBT3HlUYvMjmSRsbtynM_CY41HQ2_ALxIXCy66tmkUfJtlYWEqOqslTONJ8MJ482sSq5js5Z41cbeEc9YR62dUCFPuWf2a-nxdW4XRa2qIhIV0k8findGCTFsYlNm1WOzvcduU8maqGOBGKsaC8w4PzOr2uPSye3Ui02MvgeBCbOVfi-uy-dR0VKLiY7d7PqxDX3_BYMOSNh4-USEtSPrOLW0NHIoSxQYwUOfDi5-SiVBsni0ldfWMXSC1'
    },
    {
      id: 'rec_2',
      label: 'Lunch',
      title: 'Grilled Chicken Salad',
      calStr: '450 kcal • 35g Protein',
      kcal: 450,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX4qNGBY5T6x8DGOg1m7A04p7Iw48T-esU9ANGxhNjAmhWbDLQ9bA5Vdl5gG3p_i6CN5BVKKcUHziruK1RnhkMBJc-YUMp-4N94DB-EbX7lUrIJJc1IZqutlZuf8YLLd46MAICLY7Fs2qCIUXATHD6-0PLjw4PO_D_WBfqAkKYgQFzMZGttWA9oxA0gzPhX7T-a3EB5LpuvyOTQ5RUQ0dsyqnEGcmq7CK65U49tBwnm5rPr54Zw44C2OWnEXvy1ylWeHWzPaungAXy'
    },
    {
      id: 'rec_3',
      label: 'Dinner',
      title: 'Baked Salmon',
      calStr: '550 kcal • 42g Protein',
      kcal: 550,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjMhqH9higBG7fANWBqgKtM47yMeOF5PvmYLwOqpbexr419hcSx38GWJ1RiGVx5EmDLdRXveh8Tq16VlpPebs4hnEkY74bghhnz68tsnfuC6BTPn26DxWrbcv0gO6IncL8sbFP0QoGqtWQdOFDtFDkF0KizwYT4idesoeAPf_pkcK6FR9kxlJBtbGH39SieIHcnIVefR-yNbg0ESQ--5rBX-Rzw1N7lLfLIl5O71qWOTNJqvHv4_Y-4zL1QCB2Zfhlh6rBh2RxVX3w'
    },
    {
      id: 'rec_4',
      label: 'Snack',
      title: 'Yogurt & Honey',
      calStr: '150 kcal • 8g Protein',
      kcal: 150,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbE_DuzwX93iKWQfaPNI1TUwPLMpNE5SYB_aheE1OPKHxIADku1mwcWYsvTio3AIYOwT4-G9DcCg4B80CYZ_e5nQcmYC1j9Y-1KwxzifJ6v2SksFmtx9I74aivf6eK8bKpO3ueCiFtj6fa5QPE_hsUrp_xgaou6HAWjh0eNF0_Fi-YWo_LQWZt0Q5H40-AywBVnDEEe8joFz_ms4gBiDoBCNkFiJdn3SUNdIXAcy81MESEY4ksafMeZEGFHlazitqO38wTDRnERiHH'
    }
  ];

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
    }, 1000);
  };

  const toggleFoodItem = async (item: RecommendedItem) => {
    const isAdded = addedItems.has(item.id);
    const newAdded = new Set(addedItems);

    if (isAdded) {
      newAdded.delete(item.id);
      setExtraConsumed(prev => prev - item.kcal);
    } else {
      newAdded.add(item.id);
      setExtraConsumed(prev => prev + item.kcal);

      // Also add to diary
      const mealType = item.label.toLowerCase() as 'breakfast' | 'lunch' | 'dinner' | 'snack';
      await addItem(mealType, {
        name: item.title,
        calories: item.kcal,
        description: item.calStr,
        image_url: item.img
      });
    }
    setAddedItems(newAdded);
  };

  const adjustWater = async (amount: number) => {
    if (amount > 0) {
      await addWater();
    } else {
      await removeWater();
    }
  };

  return (
    <div className="flex flex-col gap-6 pt-2 pb-6 px-4">
      {/* Top App Bar */}
      <div className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md -mx-4 px-4 pb-2 transition-colors duration-200">
        <div className="flex items-center pt-4 justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Opening Calendar...")}
              className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">calendar_today</span>
            </button>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium uppercase tracking-wider">Dashboard</span>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Today's Plan</h2>
          </div>
          <div className="flex items-center justify-end">
            <button
              onClick={() => alert("Opening Dashboard Settings...")}
              className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-transparent text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">tune</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nutritional Summary Card */}
      <div className="w-full @container animate-fade-in-up">
        <div className="flex flex-col rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm dark:shadow-none p-5 relative overflow-hidden transition-colors duration-200 ring-1 ring-black/5 dark:ring-white/5 cursor-pointer active:scale-[0.99] transition-transform">
          {/* Decorative background blob */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium mb-1">Calories Remaining</p>
              <h1 className="text-slate-900 dark:text-white text-4xl font-extrabold tracking-tight">{remaining.toLocaleString()}</h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">of {calorieGoal.toLocaleString()} goal</p>
            </div>
            {/* Circular Chart */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-gray-100 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                <path
                  className="text-primary transition-all duration-700 ease-out"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${percentage}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3"
                ></path>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{Math.round(percentage)}%</span>
              </div>
            </div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
            {[
              { label: 'Protein', val: `${Math.round(proteinRemaining)}g left`, color: 'bg-primary' },
              { label: 'Carbs', val: `${Math.round(carbsRemaining)}g left`, color: 'bg-secondary' },
              { label: 'Fats', val: `${Math.round(fatsRemaining)}g left`, color: 'bg-gray-300 dark:bg-gray-600' }
            ].map((m) => (
              <div key={m.label} className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${m.color}`}></div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">{m.label}</span>
                </div>
                <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark pl-3.5">{m.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Recommended Daily Plan</h3>
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="text-primary text-sm font-semibold flex items-center gap-1 hover:text-primary/80 transition active:scale-95 disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-[16px] ${isRegenerating ? 'animate-spin' : ''}`}>autorenew</span>
          {isRegenerating ? 'Updating...' : 'Regenerate'}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {recommendedItems.map((item) => {
          const isAdded = addedItems.has(item.id);
          return (
            <div
              key={item.id}
              className={`group relative flex items-center justify-between gap-4 rounded-xl p-3 shadow-sm dark:shadow-none transition-all duration-300 ring-1 cursor-pointer ${isAdded ? 'bg-primary/5 ring-primary/30' : 'bg-surface-light dark:bg-surface-dark ring-black/5 dark:ring-white/5 hover:shadow-md'}`}
              onClick={() => toggleFoodItem(item)}
            >
              <div className="w-24 h-24 shrink-0 bg-center bg-no-repeat bg-cover rounded-lg" style={{ backgroundImage: `url('${item.img}')` }}></div>
              <div className="flex flex-col flex-1 min-w-0 py-1">
                <span className="text-xs font-bold text-primary tracking-wide uppercase mb-1">{item.label}</span>
                <p className="text-slate-900 dark:text-white text-base font-bold leading-tight truncate mb-1">{item.title}</p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">{item.calStr}</p>
              </div>
              <button
                className={`shrink-0 flex items-center justify-center size-10 rounded-full border shadow-sm transition-all duration-200 ${isAdded ? 'bg-primary text-white border-primary' : 'bg-background-light dark:bg-background-dark text-primary border-gray-100 dark:border-gray-700 group-hover:bg-primary group-hover:text-white'}`}
              >
                <span className="material-symbols-outlined text-[20px]">{isAdded ? 'check' : 'add'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Water Intake */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm ring-1 ring-black/5 dark:ring-white/5 flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
            <span className="material-symbols-outlined">water_drop</span>
          </div>
          <div>
            <p className="text-slate-900 dark:text-white font-bold text-sm">Water Intake</p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">{waterIntake} of {waterGoal} glasses</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); adjustWater(-1); }}
            className="size-8 rounded-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 flex items-center justify-center text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-90 transition"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); adjustWater(1); }}
            className="size-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 hover:bg-blue-600 active:scale-90 transition"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;