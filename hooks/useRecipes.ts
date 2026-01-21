import { useState, useEffect, useCallback } from 'react';
import { getRecipes, toggleFavorite as toggleFavoriteApi } from '../services/recipeService';
import { getCurrentUserId } from '../lib/supabase';
import type { Recipe } from '../lib/database.types';

export interface RecipeItem {
    id: string;
    title: string;
    kcal: number;
    desc: string;
    tags: string[];
    time: string;
    img: string;
    isFavorite: boolean;
}

export function useRecipes() {
    const [recipes, setRecipes] = useState<RecipeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');

    // Load recipes
    useEffect(() => {
        const loadRecipes = async () => {
            const userId = getCurrentUserId();
            if (!userId) {
                setLoading(false);
                return;
            }

            const data = await getRecipes(userId);

            const items: RecipeItem[] = data.map((r: Recipe) => ({
                id: r.id,
                title: r.title,
                kcal: r.calories,
                desc: r.description || '',
                tags: r.tags || [],
                time: r.prep_time || '',
                img: r.image_url || '',
                isFavorite: r.is_favorite
            }));

            setRecipes(items);
            setLoading(false);
        };

        loadRecipes();
    }, []);

    // Filter recipes
    const filteredRecipes = activeFilter === 'All'
        ? recipes
        : recipes.filter(r => r.tags.includes(activeFilter) || r.title.includes(activeFilter));

    // Toggle favorite
    const toggleFavorite = useCallback(async (id: string) => {
        const updated = await toggleFavoriteApi(id);

        if (updated) {
            setRecipes(prev => prev.map(r => {
                if (r.id === id) {
                    return { ...r, isFavorite: updated.is_favorite };
                }
                return r;
            }));
        }
    }, []);

    // Available filter options
    const filterOptions = ['All', 'Low Carb', 'High Protein', 'Vegan', 'Quick Meal'];

    return {
        recipes: filteredRecipes,
        allRecipes: recipes,
        loading,
        activeFilter,
        setActiveFilter,
        filterOptions,
        toggleFavorite
    };
}
