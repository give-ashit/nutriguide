import { useState, useEffect, useCallback } from 'react';
import { getUser, createUser, updateUser } from '../services/userService';
import { createDefaultRecipes } from '../services/recipeService';
import { createDefaultWeeklyPlan } from '../services/planService';
import { getCurrentUserId, setCurrentUserId, clearCurrentUserId } from '../lib/supabase';
import type { User, UserInsert, UserUpdate } from '../lib/database.types';
import type { UserProfile } from '../types';

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load existing user on mount
    useEffect(() => {
        const loadUser = async () => {
            const userId = getCurrentUserId();
            if (userId) {
                const userData = await getUser(userId);
                if (userData) {
                    setUser(userData);
                } else {
                    // User ID in localStorage but not in DB - clear it
                    clearCurrentUserId();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    // Create new user from profile setup
    const registerUser = useCallback(async (profile: UserProfile): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const userInsert: UserInsert = {
                name: profile.name,
                weight: profile.weight,
                height: profile.height,
                age: profile.age,
                gender: profile.gender,
                goal: profile.goal,
                activity_level: profile.activityLevel
            };

            const newUser = await createUser(userInsert);

            if (newUser) {
                setCurrentUserId(newUser.id);
                setUser(newUser);

                // Create default data for the user
                await createDefaultRecipes(newUser.id);
                await createDefaultWeeklyPlan(newUser.id, new Date());

                setLoading(false);
                return true;
            } else {
                setError('Failed to create user');
                setLoading(false);
                return false;
            }
        } catch (err) {
            setError('An error occurred');
            setLoading(false);
            return false;
        }
    }, []);

    // Update existing user
    const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<boolean> => {
        if (!user) return false;

        const userUpdate: UserUpdate = {};
        if (updates.name !== undefined) userUpdate.name = updates.name;
        if (updates.weight !== undefined) userUpdate.weight = updates.weight;
        if (updates.height !== undefined) userUpdate.height = updates.height;
        if (updates.age !== undefined) userUpdate.age = updates.age;
        if (updates.gender !== undefined) userUpdate.gender = updates.gender;
        if (updates.goal !== undefined) userUpdate.goal = updates.goal;
        if (updates.activityLevel !== undefined) userUpdate.activity_level = updates.activityLevel;

        const updated = await updateUser(user.id, userUpdate);

        if (updated) {
            setUser(updated);
            return true;
        }
        return false;
    }, [user]);

    // Logout - clear local storage
    const logout = useCallback(() => {
        clearCurrentUserId();
        setUser(null);
    }, []);

    // Check if user is logged in
    const isLoggedIn = !!user;

    // Convert DB user to UserProfile format for compatibility
    const userProfile: UserProfile | null = user ? {
        name: user.name,
        weight: user.weight,
        height: user.height,
        age: user.age,
        gender: user.gender,
        goal: user.goal,
        activityLevel: user.activity_level
    } : null;

    return {
        user,
        userProfile,
        loading,
        error,
        isLoggedIn,
        registerUser,
        updateProfile,
        logout
    };
}
