import { supabase } from '../lib/supabase';
import type { HydrationLog } from '../lib/database.types';

/**
 * Get hydration log for a specific date
 */
export async function getHydrationLog(userId: string, date: string): Promise<HydrationLog | null> {
    const { data, error } = await supabase
        .from('hydration_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching hydration log:', error);
        return null;
    }

    return data;
}

/**
 * Update hydration log (or create if doesn't exist)
 */
export async function updateHydrationLog(
    userId: string,
    date: string,
    glasses: number
): Promise<HydrationLog | null> {
    // Use upsert with conflict handling
    const { data, error } = await supabase
        .from('hydration_logs')
        .upsert(
            {
                user_id: userId,
                date,
                glasses,
                updated_at: new Date().toISOString()
            },
            {
                onConflict: 'user_id,date',
                ignoreDuplicates: false
            }
        )
        .select()
        .single();

    if (error) {
        console.error('Error updating hydration log:', error);
        return null;
    }

    return data;
}

/**
 * Increment water intake by 1
 */
export async function addWater(userId: string, date: string): Promise<HydrationLog | null> {
    const current = await getHydrationLog(userId, date);
    const currentGlasses = current?.glasses || 0;
    const goal = current?.goal || 8;

    // Don't exceed goal
    if (currentGlasses >= goal) {
        return current;
    }

    return updateHydrationLog(userId, date, currentGlasses + 1);
}

/**
 * Decrement water intake by 1
 */
export async function removeWater(userId: string, date: string): Promise<HydrationLog | null> {
    const current = await getHydrationLog(userId, date);
    const currentGlasses = current?.glasses || 0;

    // Don't go below 0
    if (currentGlasses <= 0) {
        return current;
    }

    return updateHydrationLog(userId, date, currentGlasses - 1);
}

/**
 * Set water intake to specific amount
 */
export async function setWaterIntake(
    userId: string,
    date: string,
    glasses: number
): Promise<HydrationLog | null> {
    return updateHydrationLog(userId, date, Math.max(0, glasses));
}

/**
 * Get weekly hydration summary
 */
export async function getWeeklyHydration(
    userId: string,
    startDate: string,
    endDate: string
): Promise<{ date: string; glasses: number; goal: number }[]> {
    const { data, error } = await supabase
        .from('hydration_logs')
        .select('date, glasses, goal')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

    if (error) {
        console.error('Error fetching weekly hydration:', error);
        return [];
    }

    return data || [];
}
