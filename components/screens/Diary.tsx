import React, { useState, useMemo } from 'react';

// --- Mock Data ---
const INITIAL_RECIPES = [
  {
    id: 1,
    title: "Grilled Salmon Bowl",
    calories: 520,
    time: "20 mins",
    description: "Fresh salmon fillet with quinoa, avocado, and mixed greens.",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=800&q=80",
    tags: [
      { label: "High Protein", color: "green" },
      { label: "Omega-3", color: "orange" }
    ],
    isLiked: false
  },
  {
    id: 2,
    title: "Sweet Potato Buddha Bowl",
    calories: 480,
    time: "35 mins",
    description: "Roasted sweet potatoes with chickpeas, kale, and tahini dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    tags: [
      { label: "Vegan", color: "green" }
    ],
    isLiked: false
  },
  {
    id: 3,
    title: "Avocado Toast & Eggs",
    calories: 350,
    time: "15 mins",
    description: "Creamy avocado on sourdough toast topped with poached eggs.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&w=800&q=80",
    tags: [
      { label: "Quick Meal", color: "yellow" }
    ],
    isLiked: true
  },
  {
    id: 4,
    title: "Quinoa Salad with Chickpeas",
    calories: 420,
    time: "25 mins",
    description: "A refreshing salad packed with plant-based protein and fiber.",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=80",
    tags: [
      { label: "Low Carb", color: "blue" }
    ],
    isLiked: false
  }
];

const CATEGORIES = ["All", "Low Carb", "High Protein", "Vegan", "Quick Meal", "Breakfast"];

// --- Helper Component: Tag Badge ---
const TagBadge = ({ label, color }: { label: string, color: string }) => {
  const styles: {[key: string]: string} = {
    green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  };

  return (
    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${styles[color] || styles.green}`}>
      {label}
    </span>
  );
};

// --- Main Component ---
const Diary: React.FC = () => {
  const [recipes, setRecipes] = useState(INITIAL_RECIPES);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Filter Logic
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
     
      const matchesCategory = activeCategory === "All" ||
                              recipe.tags.some(t => t.label === activeCategory) ||
                              (activeCategory === "Low Carb" && recipe.tags.some(t => t.label === "Low Carb")) ||
                              (activeCategory === "High Protein" && recipe.tags.some(t => t.label === "High Protein")) ||
                              (activeCategory === "Vegan" && recipe.tags.some(t => t.label === "Vegan"));

      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchQuery, activeCategory]);

  // Toggle Like Logic
  const toggleLike = (id: number) => {
    setRecipes(prev => prev.map(recipe =>
      recipe.id === id ? { ...recipe, isLiked: !recipe.isLiked } : recipe
    ));
  };

  const handleOpenRecipe = (title: string) => {
      // Placeholder for future internet functionality
      alert(`Opening ${title} details...`);
  };

  return (
    <div className="bg-[#edf7f4] dark:bg-[#1f2e29] font-['Manrope'] text-[#121616] dark:text-white transition-colors duration-300 min-h-full">
     
      <div className="relative w-full mx-auto flex flex-col">
       
        {/* Header Section */}
        <header className="sticky top-0 z-30 bg-[#edf7f4]/95 dark:bg-[#1f2e29]/95 backdrop-blur-md px-6 pt-6 pb-4 border-b border-black/5 dark:border-white/5 transition-colors duration-200">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Healthy Recipes</h1>
            <div className="flex gap-2">
              <button className="size-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-sm hover:scale-105 transition-transform active:scale-95">
                <span className="material-symbols-outlined text-xl">favorite</span>
              </button>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`size-10 rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-all active:scale-95 ${showFilters ? 'bg-primary text-white' : 'bg-white dark:bg-white/10'}`}
              >
                <span className="material-symbols-outlined text-xl">filter_list</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <span className="material-symbols-outlined">search</span>
            </span>
            <input
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-white/5 border-none shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#4d7f80] focus:outline-none text-sm transition-all text-slate-900 dark:text-white"
              placeholder="Search recipes, ingredients..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories (Horizontal Scroll) - Conditional Rendering */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-16 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
            <div className="overflow-x-auto no-scrollbar flex gap-3 pb-2 scroll-smooth">
                {CATEGORIES.map(category => (
                <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border
                    ${activeCategory === category
                        ? 'bg-[#4d7f80] text-white shadow-md shadow-[#4d7f80]/30 border-transparent'
                        : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-black/5 hover:bg-gray-50 dark:hover:bg-white/10'
                    }`}
                >
                    {category}
                </button>
                ))}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 pb-6 pt-4">
          <div className="grid grid-cols-1 gap-6">
           
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map(recipe => (
                <div key={recipe.id} className="group relative bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-black/5 dark:border-white/5">
                  {/* Image Container */}
                  <div
                    className="h-48 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url("${recipe.image}")` }}
                  >
                    {/* Like Button */}
                    <div className="absolute top-3 right-3 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(recipe.id);
                        }}
                        className={`size-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm transition-colors active:scale-90 ${recipe.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                      >
                        <span className={`material-symbols-outlined text-lg ${recipe.isLiked ? 'fill' : ''}`}>favorite</span>
                      </button>
                    </div>
                    {/* Time Badge */}
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <span className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">schedule</span> {recipe.time}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 relative bg-white dark:bg-background-dark/50">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg leading-tight text-slate-900 dark:text-white">{recipe.title}</h3>
                      <span className="flex-shrink-0 text-sm font-bold text-[#4d7f80]">{recipe.calories} kcal</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{recipe.description}</p>
                   
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex -space-x-0 gap-2">
                        {recipe.tags.map((tag, idx) => (
                          <TagBadge key={idx} label={tag.label} color={tag.color} />
                        ))}
                      </div>
                      <button 
                        onClick={() => handleOpenRecipe(recipe.title)}
                        className="text-[#4d7f80] hover:bg-[#4d7f80]/10 p-1 rounded-lg transition-colors active:scale-95"
                      >
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2">soup_kitchen</span>
                <p>No recipes found.</p>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default Diary;