import { supabase } from '../lib/supabase';
import type { User, UserInsert, UserUpdate } from '../lib/database.types';

/**
 * Create a new user profile
 */
export async function createUser(userData: UserInsert): Promise<User | null> {
    // Calculate calorie goal based on user data
    const calorieGoal = calculateCalorieGoal(userData);

    const { data, error } = await supabase
        .from('users')
        .insert({ ...userData, calorie_goal: calorieGoal })
        .select()
        .single();

    if (error) {
        console.error('Error creating user:', error);
        return null;
    }

    return data;
}

/**
 * Register a new user with email and password
 */
export async function registerUser(
    email: string,
    password: string,
    name: string
): Promise<{ user: User | null; error: string | null }> {
    // Check if email already exists
    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

    if (existingUser) {
        return { user: null, error: 'Email already registered' };
    }

    // Create user with default values (will be updated in setup flow)
    const { data, error } = await supabase
        .from('users')
        .insert({
            name,
            email,
            password_hash: password, // Note: In production, hash this!
            weight: 70,
            height: 170,
            age: 25,
            gender: 'male' as const,
            goal: 'maintain' as const,
            activity_level: 'lightly_active' as const,
            calorie_goal: 2000
        })
        .select()
        .single();

    if (error) {
        console.error('Error registering user:', error);
        return { user: null, error: error.message };
    }

    return { user: data, error: null };
}

/**
 * Login user with email and password
 */
export async function loginUser(
    email: string,
    password: string
): Promise<{ user: User | null; error: string | null }> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password) // Note: In production, compare hashed passwords!
        .single();

    if (error || !data) {
        return { user: null, error: 'Invalid email or password' };
    }

    return { user: data, error: null };
}

/**
 * Get user by ID
 */
export async function getUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user:', error);
        return null;
    }

    return data;
}

/**
 * Update user profile
 */
export async function updateUser(userId: string, updates: UserUpdate): Promise<User | null> {
    // Recalculate calorie goal if relevant fields changed
    let calorieGoal: number | undefined;
    if (updates.weight || updates.height || updates.age || updates.gender || updates.activity_level || updates.goal) {
        const currentUser = await getUser(userId);
        if (currentUser) {
            const merged = { ...currentUser, ...updates };
            calorieGoal = calculateCalorieGoal(merged);
        }
    }

    const { data, error } = await supabase
        .from('users')
        .update({
            ...updates,
            ...(calorieGoal && { calorie_goal: calorieGoal }),
            updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('Error updating user:', error);
        return null;
    }

    return data;
}

/**
 * Delete user account
 */
export async function deleteUser(userId: string): Promise<boolean> {
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

    if (error) {
        console.error('Error deleting user:', error);
        return false;
    }

    return true;
}

/**
 * Calculate daily calorie goal using Mifflin-St Jeor equation
 */
function calculateCalorieGoal(user: {
    weight: number;
    height: number;
    age: number;
    gender: string;
    activity_level: string;
    goal: string;
}): number {
    // Mifflin-St Jeor Equation
    let bmr: number;
    if (user.gender === 'male') {
        bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
    } else {
        bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
    }

    // Activity multiplier
    const activityMultipliers: Record<string, number> = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725
    };

    const tdee = bmr * (activityMultipliers[user.activity_level] || 1.375);

    // Goal adjustment
    let goalCalories = tdee;
    if (user.goal === 'lose') {
        goalCalories = tdee - 500; // 500 calorie deficit for weight loss
    } else if (user.goal === 'gain') {
        goalCalories = tdee + 300; // 300 calorie surplus for muscle gain
    }

    return Math.round(goalCalories);
}
