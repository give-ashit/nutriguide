import { useState, useEffect, useCallback } from 'react';
import {
    getMealsByType,
    addMealEntry,
    deleteMealEntry,
    getDailySummary
} from '../services/diaryService';
import { getCurrentUserId } from '../lib/supabase';
import type { MealEntry, MealEntryInsert } from '../lib/database.types';

export interface DiarySection {
    id: string;
    title: string;
    kcal: number;
    items: {
        id: string;
        name: string;
        desc: string;
        kcal: number;
        img: string;
    }[];
}

export function useDiary(initialDate?: Date) {
    const [currentDate, setCurrentDate] = useState(initialDate || new Date());
    const [meals, setMeals] = useState<DiarySection[]>([
        { id: 'breakfast', title: 'Breakfast', kcal: 0, items: [] },
        { id: 'lunch', title: 'Lunch', kcal: 0, items: [] },
        { id: 'dinner', title: 'Dinner', kcal: 0, items: [] },
        { id: 'snack', title: 'Snacks', kcal: 0, items: [] }
    ]);
    const [loading, setLoading] = useState(true);
    const [dailySummary, setDailySummary] = useState({
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFats: 0
    });

    const dateStr = currentDate.toISOString().split('T')[0];

    // Load meals when date changes
    useEffect(() => {
        const loadMeals = async () => {
            const userId = getCurrentUserId();
            if (!userId) {
                setLoading(false);
                return;
            }

            setLoading(true);

            const [mealsByType, summary] = await Promise.all([
                getMealsByType(userId, dateStr),
                getDailySummary(userId, dateStr)
            ]);

            // Convert to DiarySection format
            const sections: DiarySection[] = [
                { id: 'breakfast', title: 'Breakfast', kcal: 0, items: [] },
                { id: 'lunch', title: 'Lunch', kcal: 0, items: [] },
                { id: 'dinner', title: 'Dinner', kcal: 0, items: [] },
                { id: 'snack', title: 'Snacks', kcal: 0, items: [] }
            ];

            sections.forEach(section => {
                const entries = mealsByType[section.id] || [];
                section.items = entries.map(e => ({
                    id: e.id,
                    name: e.name,
                    desc: e.description || `${e.calories} kcal`,
                    kcal: e.calories,
                    img: e.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbE_DuzwX93iKWQfaPNI1TUwPLMpNE5SYB_aheE1OPKHxIADku1mwcWYsvTio3AIYOwT4-G9DcCg4B80CYZ_e5nQcmYC1j9Y-1KwxzifJ6v2SksFmtx9I74aivf6eK8bKpO3ueCiFtj6fa5QPE_hsUrp_xgaou6HAWjh0eNF0_Fi-YWo_LQWZt0Q5H40-AywBVnDEEe8joFz_ms4gBiDoBCNkFiJdn3SUNdIXAcy81MESEY4ksafMeZEGFHlazitqO38wTDRnERiHH'
                }));
                section.kcal = entries.reduce((sum, e) => sum + e.calories, 0);
            });

            setMeals(sections);
            setDailySummary(summary);
            setLoading(false);
        };

        loadMeals();
    }, [dateStr]);

    // Change date
    const changeDate = useCallback((days: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + days);
        setCurrentDate(newDate);
    }, [currentDate]);

    const goToToday = useCallback(() => {
        setCurrentDate(new Date());
    }, []);

    // Add a meal item
    const addItem = useCallback(async (
        sectionId: string,
        item: { name: string; calories: number; description?: string; image_url?: string }
    ) => {
        const userId = getCurrentUserId();
        if (!userId) return false;

        const entry: MealEntryInsert = {
            user_id: userId,
            date: dateStr,
            meal_type: sectionId as 'breakfast' | 'lunch' | 'dinner' | 'snack',
            name: item.name,
            calories: item.calories,
            description: item.description,
            image_url: item.image_url
        };

        const newEntry = await addMealEntry(entry);

        if (newEntry) {
            // Optimistic update
            setMeals(prev => prev.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        items: [...section.items, {
                            id: newEntry.id,
                            name: newEntry.name,
                            desc: newEntry.description || `${newEntry.calories} kcal`,
                            kcal: newEntry.calories,
                            img: newEntry.image_url || ''
                        }],
                        kcal: section.kcal + newEntry.calories
                    };
                }
                return section;
            }));

            setDailySummary(prev => ({
                ...prev,
                totalCalories: prev.totalCalories + newEntry.calories
            }));

            return true;
        }
        return false;
    }, [dateStr]);

    // Remove a meal item
    const removeItem = useCallback(async (sectionId: string, itemId: string) => {
        const section = meals.find(s => s.id === sectionId);
        const item = section?.items.find(i => i.id === itemId);

        const success = await deleteMealEntry(itemId);

        if (success && item) {
            setMeals(prev => prev.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        items: section.items.filter(i => i.id !== itemId),
                        kcal: Math.max(0, section.kcal - item.kcal)
                    };
                }
                return section;
            }));

            setDailySummary(prev => ({
                ...prev,
                totalCalories: Math.max(0, prev.totalCalories - item.kcal)
            }));
        }

        return success;
    }, [meals]);

    // Format date for display
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    return {
        currentDate,
        dateStr,
        meals,
        loading,
        dailySummary,
        changeDate,
        goToToday,
        addItem,
        removeItem,
        formatDate,
        isToday: isToday(currentDate)
    };
}
