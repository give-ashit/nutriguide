import { supabase } from '../lib/supabase';
import type { WeeklyPlan, WeeklyPlanInsert, WeeklyPlanUpdate } from '../lib/database.types';

/**
 * Get weekly plan for a date range
 */
export async function getWeeklyPlan(userId: string, startDate: string, endDate: string): Promise<WeeklyPlan[]> {
    const { data, error } = await supabase
        .from('weekly_plans')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
        .order('scheduled_time', { ascending: true });

    if (error) {
        console.error('Error fetching weekly plan:', error);
        return [];
    }

    return data || [];
}

/**
 * Get plan for a single day
 */
export async function getDayPlan(userId: string, date: string): Promise<WeeklyPlan[]> {
    const { data, error } = await supabase
        .from('weekly_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .order('scheduled_time', { ascending: true });

    if (error) {
        console.error('Error fetching day plan:', error);
        return [];
    }

    return data || [];
}

/**
 * Add a new planned meal
 */
export async function addPlannedMeal(meal: WeeklyPlanInsert): Promise<WeeklyPlan | null> {
    const { data, error } = await supabase
        .from('weekly_plans')
        .insert(meal)
        .select()
        .single();

    if (error) {
        console.error('Error adding planned meal:', error);
        return null;
    }

    return data;
}

/**
 * Update a planned meal
 */
export async function updatePlannedMeal(id: string, updates: WeeklyPlanUpdate): Promise<WeeklyPlan | null> {
    const { data, error } = await supabase
        .from('weekly_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating planned meal:', error);
        return null;
    }

    return data;
}

/**
 * Toggle meal completion status
 */
export async function toggleMealComplete(id: string): Promise<WeeklyPlan | null> {
    // First get current status
    const { data: current, error: fetchError } = await supabase
        .from('weekly_plans')
        .select('is_completed')
        .eq('id', id)
        .single();

    if (fetchError || !current) {
        console.error('Error fetching meal status:', fetchError);
        return null;
    }

    // Toggle the status
    const { data, error } = await supabase
        .from('weekly_plans')
        .update({ is_completed: !current.is_completed })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error toggling meal completion:', error);
        return null;
    }

    return data;
}

/**
 * Delete a planned meal
 */
export async function deletePlannedMeal(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('weekly_plans')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting planned meal:', error);
        return false;
    }

    return true;
}

/**
 * Create default weekly plan for a user (seed data)
 */
export async function createDefaultWeeklyPlan(userId: string, startDate: Date): Promise<boolean> {
    const defaultMeals = [
        { meal_type: 'breakfast' as const, scheduled_time: '08:00', name: 'Avocado Toast & Eggs', calories: 350, protein: 15, image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCX-8oFcFISUkP_XXJRJH4dDZosdnZ5xgAnrUwDCKf_LkTNRByBcLVFISw0h3j2SbhGIngwzF1mJwlbrQHUgtmr-iLnKn6H7u2xI4jzY1G1y-dcPwjEihFJ3kPN4CrqWqBdGmwjx3ZivUwTioA6ffrGQbf6ERxoQCM_LZJZFoGyx0DY4Daupt-QjJniRkBFIdd9HDoG1tD7hnC9pWGgoc0P5NBxSSXPlvsgghlFNjXSm_oFHrufP9BpTKlDsCSFhO0sMfdm_sGDIq4t' },
        { meal_type: 'lunch' as const, scheduled_time: '12:30', name: 'Grilled Salmon Bowl', calories: 520, protein: 32, image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq5cjRIJJ9j4Gera-kIdRtaUEAMrknr1_EI0jVG36ELejgMtO4at6wMSI_woR2R7oZYN_BaZ1CASENpz7vS1iKbsLFJrFtXuCe1fE4ndkPG_4ZZp2JSuzlRGbtXCJ8pLFKQ1uR5vZBAwohMNJm0lHR-ww4_btA17mLoLcGRjc1bRXUqyxT3gjZnvURNd9vM491TskSxLXi-PqWDIwJEoUGRj5Q9_0-kOX4vyTv4HLVX3jhSeWMtvQY8VF7vvBxqxMGaWcaAUgtdTIQ' },
        { meal_type: 'dinner' as const, scheduled_time: '19:00', name: 'Sweet Potato Buddha Bowl', calories: 480, protein: 12, image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXt83TXGkH90RSuf9tOrIQ4_eYWKYfPwMogqKwpt4P04EDq08o9uJ5nloLbaGG6_pvPC8cQ7u-wyj1TBpRI0cycfFoPCv-laY0dMcezLESKgriSjEYxtM1q3nqtzMIDO1sv4eRw0L_AQGjV9hJ-CZ5n7VU8uAy8Rf0oR4wSoWy-kskC92pLuedMxRhi5HFEZj-Bgd5bcqGGc8IAu58WqCojq041NzFl681CmCFH-9wA_pZynXn_mvv9Tm7pcg__rle3jN11oKbswdI' }
    ];

    const plans: WeeklyPlanInsert[] = [];

    // Create plan for 7 days
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        defaultMeals.forEach(meal => {
            plans.push({
                user_id: userId,
                date: dateStr,
                ...meal
            });
        });
    }

    const { error } = await supabase
        .from('weekly_plans')
        .insert(plans);

    if (error) {
        console.error('Error creating default weekly plan:', error);
        return false;
    }

    return true;
}
