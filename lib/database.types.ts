export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    name: string;
                    weight: number;
                    height: number;
                    age: number;
                    gender: 'male' | 'female';
                    goal: 'lose' | 'maintain' | 'gain';
                    activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
                    calorie_goal: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    weight: number;
                    height: number;
                    age: number;
                    gender: 'male' | 'female';
                    goal: 'lose' | 'maintain' | 'gain';
                    activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
                    calorie_goal?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    weight?: number;
                    height?: number;
                    age?: number;
                    gender?: 'male' | 'female';
                    goal?: 'lose' | 'maintain' | 'gain';
                    activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
                    calorie_goal?: number;
                    updated_at?: string;
                };
            };
            meal_entries: {
                Row: {
                    id: string;
                    user_id: string;
                    date: string;
                    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
                    name: string;
                    description: string | null;
                    calories: number;
                    protein: number | null;
                    carbs: number | null;
                    fats: number | null;
                    image_url: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    date: string;
                    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
                    name: string;
                    description?: string | null;
                    calories: number;
                    protein?: number | null;
                    carbs?: number | null;
                    fats?: number | null;
                    image_url?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    date?: string;
                    meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
                    name?: string;
                    description?: string | null;
                    calories?: number;
                    protein?: number | null;
                    carbs?: number | null;
                    fats?: number | null;
                    image_url?: string | null;
                };
            };
            weekly_plans: {
                Row: {
                    id: string;
                    user_id: string;
                    date: string;
                    meal_type: 'breakfast' | 'lunch' | 'dinner';
                    scheduled_time: string | null;
                    name: string;
                    description: string | null;
                    calories: number;
                    protein: number | null;
                    image_url: string | null;
                    is_completed: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    date: string;
                    meal_type: 'breakfast' | 'lunch' | 'dinner';
                    scheduled_time?: string | null;
                    name: string;
                    description?: string | null;
                    calories: number;
                    protein?: number | null;
                    image_url?: string | null;
                    is_completed?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    date?: string;
                    meal_type?: 'breakfast' | 'lunch' | 'dinner';
                    scheduled_time?: string | null;
                    name?: string;
                    description?: string | null;
                    calories?: number;
                    protein?: number | null;
                    image_url?: string | null;
                    is_completed?: boolean;
                };
            };
            recipes: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    description: string | null;
                    calories: number;
                    prep_time: string | null;
                    tags: string[] | null;
                    image_url: string | null;
                    is_favorite: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    title: string;
                    description?: string | null;
                    calories: number;
                    prep_time?: string | null;
                    tags?: string[] | null;
                    image_url?: string | null;
                    is_favorite?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    title?: string;
                    description?: string | null;
                    calories?: number;
                    prep_time?: string | null;
                    tags?: string[] | null;
                    image_url?: string | null;
                    is_favorite?: boolean;
                };
            };
            hydration_logs: {
                Row: {
                    id: string;
                    user_id: string;
                    date: string;
                    glasses: number;
                    goal: number;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    date: string;
                    glasses?: number;
                    goal?: number;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    date?: string;
                    glasses?: number;
                    goal?: number;
                    updated_at?: string;
                };
            };
        };
    };
}

// Convenience types
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type MealEntry = Database['public']['Tables']['meal_entries']['Row'];
export type MealEntryInsert = Database['public']['Tables']['meal_entries']['Insert'];
export type MealEntryUpdate = Database['public']['Tables']['meal_entries']['Update'];

export type WeeklyPlan = Database['public']['Tables']['weekly_plans']['Row'];
export type WeeklyPlanInsert = Database['public']['Tables']['weekly_plans']['Insert'];
export type WeeklyPlanUpdate = Database['public']['Tables']['weekly_plans']['Update'];

export type Recipe = Database['public']['Tables']['recipes']['Row'];
export type RecipeInsert = Database['public']['Tables']['recipes']['Insert'];
export type RecipeUpdate = Database['public']['Tables']['recipes']['Update'];

export type HydrationLog = Database['public']['Tables']['hydration_logs']['Row'];
export type HydrationLogInsert = Database['public']['Tables']['hydration_logs']['Insert'];
export type HydrationLogUpdate = Database['public']['Tables']['hydration_logs']['Update'];
