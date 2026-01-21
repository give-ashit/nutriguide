import { supabase } from '../lib/supabase';
import type { MealEntry, MealEntryInsert, MealEntryUpdate } from '../lib/database.types';

/**
 * Get all meal entries for a specific date
 */
export async function getMealEntriesByDate(userId: string, date: string): Promise<MealEntry[]> {
    const { data, error } = await supabase
        .from('meal_entries')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching meal entries:', error);
        return [];
    }

    return data || [];
}

/**
 * Get meal entries grouped by meal type for a date
 */
export async function getMealsByType(userId: string, date: string): Promise<Record<string, MealEntry[]>> {
    const entries = await getMealEntriesByDate(userId, date);

    const grouped: Record<string, MealEntry[]> = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: []
    };

    entries.forEach(entry => {
        if (grouped[entry.meal_type]) {
            grouped[entry.meal_type].push(entry);
        }
    });

    return grouped;
}

/**
 * Add a new meal entry
 */
export async function addMealEntry(entry: MealEntryInsert): Promise<MealEntry | null> {
    const { data, error } = await supabase
        .from('meal_entries')
        .insert(entry)
        .select()
        .single();

    if (error) {
        console.error('Error adding meal entry:', error);
        return null;
    }

    return data;
}

/**
 * Update a meal entry
 */
export async function updateMealEntry(id: string, updates: MealEntryUpdate): Promise<MealEntry | null> {
    const { data, error } = await supabase
        .from('meal_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating meal entry:', error);
        return null;
    }

    return data;
}

/**
 * Delete a meal entry
 */
export async function deleteMealEntry(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('meal_entries')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting meal entry:', error);
        return false;
    }

    return true;
}

/**
 * Get daily nutrition summary
 */
export async function getDailySummary(userId: string, date: string): Promise<{
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
    mealCount: number;
}> {
    const entries = await getMealEntriesByDate(userId, date);

    return entries.reduce((acc, entry) => ({
        totalCalories: acc.totalCalories + entry.calories,
        totalProtein: acc.totalProtein + (entry.protein || 0),
        totalCarbs: acc.totalCarbs + (entry.carbs || 0),
        totalFats: acc.totalFats + (entry.fats || 0),
        mealCount: acc.mealCount + 1
    }), {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFats: 0,
        mealCount: 0
    });
}
