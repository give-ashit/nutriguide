import React, { useState, useEffect } from 'react';

// --- 常量定义 ---
const CALORIE_GOAL = 2000;
const EXERCISE_CALORIES = 300; // 模拟运动消耗

interface FoodItem {
  id: number;
  name: string;
  desc: string;
  kcal: number;
  img: string;
  status: 'Completed' | null;
}

interface MealSection {
  id: number;
  section: string;
  time: string;
  items: FoodItem[];
}

const INITIAL_MEALS: MealSection[] = [
  {
    id: 1,
    section: 'Breakfast',
    time: '8:00 AM',
    items: [
      {
        id: 101,
        name: 'Avocado Toast',
        desc: '2 slices • 380 kcal',
        kcal: 380,
        img: 'https://images.unsplash.com/photo-1588137372308-15f75323ca8d?auto=format&fit=crop&w=150&q=80',
        status: 'Completed'
      }
    ]
  },
  {
    id: 2,
    section: 'Lunch',
    time: '12:30 PM',
    items: [
      {
        id: 102,
        name: 'Quinoa Bowl',
        desc: '1 bowl • 540 kcal',
        kcal: 540,
        img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=150&q=80',
        status: null
      }
    ]
  },
  {
    id: 3,
    section: 'Dinner',
    time: '7:00 PM',
    items: []
  }
];

// --- Modal Component ---
const AddFoodModal = ({ isOpen, onClose, onAdd, section }: { isOpen: boolean, onClose: () => void, onAdd: (item: any) => void, section: string }) => {
  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');
  const [desc, setDesc] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ name, kcal: parseInt(kcal) || 0, desc });
    setName('');
    setKcal('');
    setDesc('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-[#1f2226] w-full max-w-xs rounded-3xl p-6 shadow-2xl animate-fade-in-up border border-gray-100 dark:border-gray-800"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add to {section}</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <span className="material-symbols-outlined text-gray-500">close</span>
            </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Food Name</label>
            <input 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border-transparent focus:border-[#2eb850] focus:ring-0 text-slate-900 dark:text-white text-base font-medium placeholder:font-normal"
              placeholder="e.g. Banana"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
               <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Calories</label>
               <input 
                  type="number"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border-transparent focus:border-[#2eb850] focus:ring-0 text-slate-900 dark:text-white text-base font-medium placeholder:font-normal"
                  placeholder="0"
                  value={kcal}
                  onChange={e => setKcal(e.target.value)}
                  required
                />
            </div>
            <div className="flex-1">
               <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Quantity</label>
               <input 
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border-transparent focus:border-[#2eb850] focus:ring-0 text-slate-900 dark:text-white text-base font-medium placeholder:font-normal"
                  placeholder="1 serving"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-3.5 rounded-xl font-bold bg-[#2eb850] text-white shadow-lg shadow-[#2eb850]/30 hover:bg-[#259641] transition-all transform active:scale-95">Add Item</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const DailyFoodDiary = () => {
  // --- State Management ---
  const [selectedDate, setSelectedDate] = useState(24); // 默认选中 24 号
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
 
  const [meals, setMeals] = useState<MealSection[]>(INITIAL_MEALS);
  const [snacks, setSnacks] = useState<FoodItem[]>([]);
 
  // Add Food Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetSection, setTargetSection] = useState<string | null>(null);

  // 饮水状态 (0-8杯)
  const [waterCount, setWaterCount] = useState(5);

  // --- Helpers & Computations ---
 
  // 计算已摄入卡路里 (餐食 + 零食)
  const calculateTotalFood = () => {
    const mealCals = meals.reduce((acc, meal) => {
        return acc + meal.items.reduce((sum, item) => sum + item.kcal, 0);
    }, 0);
    const snackCals = snacks.reduce((acc, snack) => acc + snack.kcal, 0);
    return mealCals + snackCals;
  };

  const foodCalories = calculateTotalFood();
  const caloriesRemaining = CALORIE_GOAL - foodCalories + EXERCISE_CALORIES;
  const progressPercent = Math.min(100, (foodCalories / CALORIE_GOAL) * 100);

  // 动态注入字体 (确保复制即用)
  useEffect(() => {
    const linkFonts = document.createElement('link');
    linkFonts.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap";
    linkFonts.rel = "stylesheet";
   
    const linkIcons = document.createElement('link');
    linkIcons.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
    linkIcons.rel = "stylesheet";

    document.head.appendChild(linkFonts);
    document.head.appendChild(linkIcons);

    return () => {
      document.head.removeChild(linkFonts);
      document.head.removeChild(linkIcons);
    };
  }, []);

  // --- Handlers ---

  const toggleItemStatus = (mealId: number, itemId: number) => {
    setMeals(prev => prev.map(m => {
      if (m.id === mealId) {
        return {
          ...m,
          items: m.items.map(item => 
            item.id === itemId 
              ? { ...item, status: item.status === 'Completed' ? null : 'Completed' }
              : item
          )
        };
      }
      return m;
    }));
  };

  const handleOpenAddModal = (section: string) => {
    setTargetSection(section);
    setIsAddModalOpen(true);
  };

  const handleAddItem = (data: { name: string, kcal: number, desc: string }) => {
    const newItem: FoodItem = {
      id: Date.now(),
      name: data.name,
      desc: data.desc || `${data.kcal} kcal`,
      kcal: data.kcal,
      img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80', // generic food placeholder
      status: null
    };

    if (targetSection === 'Snacks') {
      setSnacks([...snacks, newItem]);
    } else {
      setMeals(prev => prev.map(m => {
        if (m.section === targetSection) {
          return { ...m, items: [...m.items, newItem] };
        }
        return m;
      }));
    }
    setIsAddModalOpen(false);
  };

  const handleRemoveSnack = (id: number) => {
    setSnacks(snacks.filter(s => s.id !== id));
  };

  const toggleWater = (index: number) => {
    // 如果点击的是当前的数量，则减少一杯，否则设置为点击的杯数
    if (index + 1 === waterCount) {
      setWaterCount(index);
    } else {
      setWaterCount(index + 1);
    }
  };

  // --- Render Components ---

  return (
    <div className="bg-white dark:bg-[#17191c] text-[#101912] dark:text-gray-100 font-['Manrope'] transition-colors relative min-h-screen pb-10">
     
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#17191c]/80 backdrop-blur-md transition-colors">
        <div className="flex items-center justify-between p-4">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold leading-tight">Today</h2>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Oct {selectedDate}, 2023
            </span>
          </div>
          <button
            onClick={() => setIsCalendarOpen(true)}
            className={`p-2 rounded-full transition-colors active:bg-gray-200 ${isCalendarOpen ? 'bg-gray-100 dark:bg-gray-800 text-[#2eb850]' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <span className="material-symbols-outlined">calendar_today</span>
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto">
       
        {/* Calorie Stats Card */}
        <section className="px-4 py-2">
          <div className="bg-[#2eb850]/10 dark:bg-[#2eb850]/5 rounded-xl p-6 border border-[#2eb850]/20">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-sm font-semibold text-[#2eb850] uppercase tracking-wide">Calories Remaining</p>
                <h1 className="text-5xl font-extrabold tracking-tight mt-1 transition-all">
                  {caloriesRemaining.toLocaleString()}
                </h1>
              </div>
              <div className="text-right">
                <span className="material-symbols-outlined text-[#2eb850] text-3xl">insights</span>
              </div>
            </div>
           
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm font-medium">
                <div className="flex gap-4">
                  <span><span className="text-gray-500 font-normal">Goal</span> {CALORIE_GOAL}</span>
                  <span><span className="text-gray-500 font-normal">Food</span> {foodCalories}</span>
                </div>
                <span><span className="text-gray-500 font-normal">Exercise</span> {EXERCISE_CALORIES}</span>
              </div>
              {/* Progress Bar */}
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2eb850] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Hydration Section (New Feature) */}
        <section className="px-4 py-4">
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#66B3E0]">water_drop</span>
                <h3 className="font-bold text-lg">Hydration</h3>
              </div>
              <span className="text-sm font-bold text-[#66B3E0]">{waterCount}/8 glasses</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              {[...Array(8)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => toggleWater(index)}
                  className={`flex-1 aspect-[3/4] rounded-lg flex items-center justify-center transition-all duration-300 ${
                    index < waterCount
                      ? 'bg-[#66B3E0] text-white shadow-sm'
                      : 'border-2 border-dashed border-[#66B3E0]/40 text-[#66B3E0]/40 hover:bg-[#66B3E0]/10'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-lg"
                    style={index < waterCount ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    local_drink
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Meals Section */}
        <section className="px-4 flex flex-col gap-6">
          {meals.map((meal) => {
             const sectionCalories = meal.items.reduce((acc, i) => acc + i.kcal, 0);
             return (
            <div key={meal.id} className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-1 overflow-hidden transition-colors">
             
              {/* Meal Header */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold leading-tight">{meal.section}</h2>
                  {sectionCalories > 0 && (
                    <span className="text-sm font-medium text-gray-400">• {sectionCalories} kcal</span>
                  )}
                </div>
                <button 
                  onClick={() => handleOpenAddModal(meal.section)}
                  className="w-8 h-8 rounded-full bg-[#2eb850] text-white flex items-center justify-center shadow-sm hover:bg-[#259641] active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-xl">add</span>
                </button>
              </div>

              {/* Meal Card */}
              <div className="flex flex-col bg-white dark:bg-[#1f2226] rounded-lg overflow-hidden transition-colors">
                {meal.items.length > 0 ? (
                  meal.items.map((item) => (
                    <div 
                        key={item.id} 
                        className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 relative group cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors" 
                        onClick={() => toggleItemStatus(meal.id, item.id)}
                    >
                        <div
                        className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0"
                        style={{ backgroundImage: `url('${item.img}')` }}
                        ></div>
                        <div className="flex-1">
                        <p className={`text-sm font-bold leading-tight ${item.status === 'Completed' ? 'line-through text-gray-400' : ''}`}>
                            {item.name}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                        </div>
                    
                        {/* Status Indicator / Action */}
                        <div className="flex flex-col items-end gap-1">
                        <span className={`text-sm font-bold ${item.status === 'Completed' ? 'text-gray-300' : 'text-[#101912] dark:text-white'}`}>
                            {item.kcal}
                        </span>
                        {item.status === 'Completed' && (
                            <span className="material-symbols-outlined text-[#2eb850] text-sm">check_circle</span>
                        )}
                        </div>
                    </div>
                  ))
                ) : (
                  // Empty State for Meal
                  <div className="p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5" onClick={() => handleOpenAddModal(meal.section)}>
                     <span className="material-symbols-outlined text-gray-300 dark:text-gray-700 text-4xl mb-2">dinner_dining</span>
                     <p className="text-sm text-gray-500 font-medium">No food logged yet</p>
                  </div>
                )}
              </div>
            </div>
          )})}

          {/* Snacks Section */}
          <div className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-1 overflow-hidden transition-colors">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold leading-tight">Snacks</h2>
              </div>
              <button
                onClick={() => handleOpenAddModal('Snacks')}
                className="w-8 h-8 rounded-full bg-[#2eb850] text-white flex items-center justify-center shadow-sm hover:bg-[#259641] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-xl">add</span>
              </button>
            </div>

            <div className="bg-white dark:bg-[#1f2226] rounded-lg overflow-hidden transition-colors">
              {snacks.length > 0 ? (
                snacks.map((snack) => (
                   <div key={snack.id} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 group">
                      <div
                        className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0"
                        style={{ backgroundImage: `url('${snack.img}')` }}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-bold leading-tight">{snack.name}</p>
                        <p className="text-xs text-gray-500 font-medium">{snack.desc}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveSnack(snack.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                      >
                         <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                      <span className="text-sm font-bold">{snack.kcal}</span>
                   </div>
                ))
              ) : (
                <div className="p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5" onClick={() => handleOpenAddModal('Snacks')}>
                  <p className="text-sm text-gray-400 font-medium italic">Fuel up when needed</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Floating Calendar Modal */}
      {isCalendarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/50 z-[60] backdrop-blur-[2px]"
            onClick={() => setIsCalendarOpen(false)}
          ></div>
          <div className="fixed top-[70px] right-4 z-[70] w-72 sm:w-80 bg-white dark:bg-[#1f2226] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-800 overflow-hidden animate-fade-in-down origin-top-right">
            {/* Arrow */}
            <div className="absolute -top-1.5 right-6 w-4 h-4 bg-white dark:bg-[#1f2226] border-t border-l border-gray-100 dark:border-gray-800 transform rotate-45 z-10"></div>
           
            <div className="p-5 relative z-20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">October 2023</h3>
                <div className="flex gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
                    <span className="material-symbols-outlined text-xl">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 mb-3 text-center">
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <span key={i} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{d}</span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-y-2 gap-x-1 place-items-center">
                {[...Array(31)].map((_, i) => {
                  const day = i + 1;
                  const isSelected = day === selectedDate;
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        setSelectedDate(day);
                        setIsCalendarOpen(false);
                      }}
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#2eb850] text-white shadow-md shadow-[#2eb850]/30 transform scale-105 font-bold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Food Modal */}
      <AddFoodModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
        section={targetSection || 'Meal'}
      />

    </div>
  );
};

export default DailyFoodDiary;