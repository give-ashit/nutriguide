import { supabase } from '../lib/supabase';
import type { Recipe, RecipeInsert, RecipeUpdate } from '../lib/database.types';

/**
 * Get all saved recipes for a user
 */
export async function getRecipes(userId: string): Promise<Recipe[]> {
    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching recipes:', error);
        return [];
    }

    return data || [];
}

/**
 * Get favorite recipes only
 */
export async function getFavoriteRecipes(userId: string): Promise<Recipe[]> {
    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', userId)
        .eq('is_favorite', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching favorite recipes:', error);
        return [];
    }

    return data || [];
}

/**
 * Get recipes by tag
 */
export async function getRecipesByTag(userId: string, tag: string): Promise<Recipe[]> {
    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', userId)
        .contains('tags', [tag])
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching recipes by tag:', error);
        return [];
    }

    return data || [];
}

/**
 * Add a new recipe
 */
export async function addRecipe(recipe: RecipeInsert): Promise<Recipe | null> {
    const { data, error } = await supabase
        .from('recipes')
        .insert(recipe)
        .select()
        .single();

    if (error) {
        console.error('Error adding recipe:', error);
        return null;
    }

    return data;
}

/**
 * Update a recipe
 */
export async function updateRecipe(id: string, updates: RecipeUpdate): Promise<Recipe | null> {
    const { data, error } = await supabase
        .from('recipes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating recipe:', error);
        return null;
    }

    return data;
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(id: string): Promise<Recipe | null> {
    // First get current status
    const { data: current, error: fetchError } = await supabase
        .from('recipes')
        .select('is_favorite')
        .eq('id', id)
        .single();

    if (fetchError || !current) {
        console.error('Error fetching recipe:', fetchError);
        return null;
    }

    // Toggle the status
    const { data, error } = await supabase
        .from('recipes')
        .update({ is_favorite: !current.is_favorite })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error toggling favorite:', error);
        return null;
    }

    return data;
}

/**
 * Delete a recipe
 */
export async function deleteRecipe(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting recipe:', error);
        return false;
    }

    return true;
}

/**
 * Create default recipes for a new user
 */
export async function createDefaultRecipes(userId: string): Promise<boolean> {
    const defaultRecipes: RecipeInsert[] = [
        {
            user_id: userId,
            title: 'Grilled Salmon Bowl',
            description: 'Fresh salmon fillet with quinoa, avocado, and mixed greens.',
            calories: 520,
            prep_time: '20 mins',
            tags: ['High Protein', 'Omega-3'],
            image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq5cjRIJJ9j4Gera-kIdRtaUEAMrknr1_EI0jVG36ELejgMtO4at6wMSI_woR2R7oZYN_BaZ1CASENpz7vS1iKbsLFJrFtXuCe1fE4ndkPG_4ZZp2JSuzlRGbtXCJ8pLFKQ1uR5vZBAwohMNJm0lHR-ww4_btA17mLoLcGRjc1bRXUqyxT3gjZnvURNd9vM491TskSxLXi-PqWDIwJEoUGRj5Q9_0-kOX4vyTv4HLVX3jhSeWMtvQY8VF7vvBxqxMGaWcaAUgtdTIQ',
            is_favorite: true
        },
        {
            user_id: userId,
            title: 'Sweet Potato Buddha Bowl',
            description: 'Roasted sweet potatoes with chickpeas, kale, and tahini dressing.',
            calories: 480,
            prep_time: '35 mins',
            tags: ['Vegan'],
            image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXt83TXGkH90RSuf9tOrIQ4_eYWKYfPwMogqKwpt4P04EDq08o9uJ5nloLbaGG6_pvPC8cQ7u-wyj1TBpRI0cycfFoPCv-laY0dMcezLESKgriSjEYxtM1q3nqtzMIDO1sv4eRw0L_AQGjV9hJ-CZ5n7VU8uAy8Rf0oR4wSoWy-kskC92pLuedMxRhi5HFEZj-Bgd5bcqGGc8IAu58WqCojq041NzFl681CmCFH-9wA_pZynXn_mvv9Tm7pcg__rle3jN11oKbswdI',
            is_favorite: true
        },
        {
            user_id: userId,
            title: 'Avocado Toast & Eggs',
            description: 'Creamy avocado on sourdough toast topped with poached eggs.',
            calories: 350,
            prep_time: '15 mins',
            tags: ['Quick Meal'],
            image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCX-8oFcFISUkP_XXJRJH4dDZosdnZ5xgAnrUwDCKf_LkTNRByBcLVFISw0h3j2SbhGIngwzF1mJwlbrQHUgtmr-iLnKn6H7u2xI4jzY1G1y-dcPwjEihFJ3kPN4CrqWqBdGmwjx3ZivUwTioA6ffrGQbf6ERxoQCM_LZJZFoGyx0DY4Daupt-QjJniRkBFIdd9HDoG1tD7hnC9pWGgoc0P5NBxSSXPlvsgghlFNjXSm_oFHrufP9BpTKlDsCSFhO0sMfdm_sGDIq4t',
            is_favorite: true
        },
        {
            user_id: userId,
            title: 'Quinoa Salad',
            description: 'A refreshing salad packed with plant-based protein and fiber.',
            calories: 420,
            prep_time: '25 mins',
            tags: ['Low Carb'],
            image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3nLISY3UYIQXULDbildzgZt-FsGIjeFcQ4ZzweZAemVvEcBQwSL4b22_P7VFBV8BRNF2PDoThjFKJjlJeL6uoCmCGrYECfzP2TGwx-466vU0EqOyFIUjA8Rgm9SC2iVcRZKR-jA_HTa_0sjWC6smVTwmIPhKPfY8Zu5tFH98W1Pn52aQ3D8IqMgjrfNHiEkbezzDPbmm0ZpyZTJ-Xkf2DiKGTaaXjYqtrF7f9I0wyDjHci9GsBKs7YBme6VYchiJYcu9mxLVPa7Mt',
            is_favorite: true
        }
    ];

    const { error } = await supabase
        .from('recipes')
        .insert(defaultRecipes);

    if (error) {
        console.error('Error creating default recipes:', error);
        return false;
    }

    return true;
}
