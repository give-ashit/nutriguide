import React from 'react';
import { UserProfile } from '../../types';
import { useRecipes } from '../../hooks/useRecipes';

interface ProfileProps {
    user: UserProfile;
    onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
    const {
        recipes: filteredRecipes,
        loading,
        activeFilter,
        setActiveFilter,
        filterOptions,
        toggleFavorite
    } = useRecipes();

    const handleOpenRecipe = (title: string) => {
        alert(`Opening recipe details for: ${title}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen pb-24 bg-background-light dark:bg-background-dark">
            {/* Profile Header Section */}
            <header className="px-6 pt-8 pb-4 bg-surface-light dark:bg-surface-dark shadow-sm z-10 transition-colors duration-200">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary">
                            <span className="material-symbols-outlined text-3xl">person</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{user.name}</h1>
                            <p className="text-sm text-gray-500 capitalize dark:text-gray-400">{user.gender}, {user.age} years</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </div>

                {/* Stats Row */}
                <div className="flex justify-between items-center bg-background-light dark:bg-background-dark rounded-xl p-4 border border-gray-100 dark:border-gray-800 transition-colors duration-200">
                    <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Weight</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{user.weight} <span className="text-xs font-normal">kg</span></p>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Height</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{user.height} <span className="text-xs font-normal">cm</span></p>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Goal</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white capitalize">{user.goal}</p>
                    </div>
                </div>
            </header>

            {/* Recipe Section */}
            <main className="flex-1 px-6 pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Saved Recipes</h2>
                    <div className="flex gap-2">
                        <button className="size-9 rounded-full bg-white dark:bg-white/5 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800 text-slate-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 active:scale-95 transition">
                            <span className="material-symbols-outlined text-lg">search</span>
                        </button>
                        <button className="size-9 rounded-full bg-white dark:bg-white/5 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800 text-slate-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 active:scale-95 transition">
                            <span className="material-symbols-outlined text-lg">filter_list</span>
                        </button>
                    </div>
                </div>

                {/* Filter Scroll */}
                <div className="overflow-x-auto no-scrollbar flex gap-2 pb-4 -mx-6 px-6">
                    {filterOptions.map((f) => {
                        const isActive = activeFilter === f;
                        return (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${isActive ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/10'}`}
                            >
                                {f}
                            </button>
                        );
                    })}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 gap-5">
                    {filteredRecipes.map((recipe) => (
                        <div key={recipe.id} onClick={() => handleOpenRecipe(recipe.title)} className="group relative bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-800 cursor-pointer">
                            <div className="h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url('${recipe.img}')` }}>
                                <div className="absolute top-3 right-3">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleFavorite(recipe.id); }}
                                        className={`size-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm transition-all hover:scale-110 ${recipe.isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
                                    >
                                        <span className={`material-symbols-outlined text-lg ${recipe.isFavorite ? 'fill' : ''}`}>favorite</span>
                                    </button>
                                </div>
                                <div className="absolute bottom-3 left-3 flex gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">schedule</span> {recipe.time}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-bold text-lg leading-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors">{recipe.title}</h3>
                                    <span className="flex-shrink-0 text-sm font-bold text-primary">{recipe.kcal} kcal</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{recipe.desc}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        {recipe.tags.map(tag => {
                                            let colorClass = "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300";
                                            if (tag === 'High Protein') colorClass = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
                                            if (tag === 'Omega-3') colorClass = "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
                                            if (tag === 'Vegan') colorClass = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
                                            if (tag === 'Quick Meal') colorClass = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
                                            if (tag === 'Low Carb') colorClass = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";

                                            return (
                                                <span key={tag} className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${colorClass}`}>
                                                    {tag}
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <button className="text-primary bg-primary/0 group-hover:bg-primary/10 p-1.5 rounded-lg transition-all">
                                        <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredRecipes.length === 0 && (
                        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                            <p>No recipes found for "{activeFilter}"</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Profile;