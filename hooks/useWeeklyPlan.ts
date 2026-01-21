import { useState, useEffect, useCallback } from 'react';
import {
    getDayPlan,
    toggleMealComplete,
    addPlannedMeal,
    deletePlannedMeal
} from '../services/planService';
import { getCurrentUserId } from '../lib/supabase';
import type { WeeklyPlan, WeeklyPlanInsert } from '../lib/database.types';

export interface PlanMeal {
    id: string;
    section: string;
    status: 'Completed' | null;
    time: string;
    item: {
        name: string;
        desc: string;
        kcal: number;
        img: string;
    };
}

export interface Snack {
    id: string;
    name: string;
    desc: string;
    kcal: number;
    img: string;
}

export function useWeeklyPlan(initialDate?: Date) {
    const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
    const [meals, setMeals] = useState<PlanMeal[]>([]);
    const [snacks, setSnacks] = useState<Snack[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCalories, setTotalCalories] = useState(0);
    const calorieGoal = 2000;

    const dateStr = selectedDate.toISOString().split('T')[0];

    // Generate days for the week
    const getDays = useCallback(() => {
        const days = [];
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday

        for (let i = 0; i < 6; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            days.push({
                d: date.toLocaleDateString('en-US', { weekday: 'short' }),
                n: date.getDate().toString(),
                date: date
            });
        }
        return days;
    }, [selectedDate]);

    // Load plan for selected date
    useEffect(() => {
        const loadPlan = async () => {
            const userId = getCurrentUserId();
            if (!userId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            const plan = await getDayPlan(userId, dateStr);

            // Convert to PlanMeal format
            const mainMeals: PlanMeal[] = [];
            const snackItems: Snack[] = [];
            let total = 0;

            plan.forEach((item: WeeklyPlan) => {
                total += item.calories;

                if (item.meal_type === 'breakfast' || item.meal_type === 'lunch' || item.meal_type === 'dinner') {
                    mainMeals.push({
                        id: item.id,
                        section: item.meal_type.charAt(0).toUpperCase() + item.meal_type.slice(1),
                        status: item.is_completed ? 'Completed' : null,
                        time: item.scheduled_time ? formatTime(item.scheduled_time) : '',
                        item: {
                            name: item.name,
                            desc: `${item.calories} kcal${item.protein ? ` • ${item.protein}g Protein` : ''}`,
                            kcal: item.calories,
                            img: item.image_url || ''
                        }
                    });
                }
            });

            // Sort meals by section order
            const sectionOrder = { Breakfast: 0, Lunch: 1, Dinner: 2 };
            mainMeals.sort((a, b) =>
                (sectionOrder[a.section as keyof typeof sectionOrder] || 0) -
                (sectionOrder[b.section as keyof typeof sectionOrder] || 0)
            );

            setMeals(mainMeals);
            setSnacks(snackItems);
            setTotalCalories(total);
            setLoading(false);
        };

        loadPlan();
    }, [dateStr]);

    // Toggle meal completion
    const toggleStatus = useCallback(async (mealId: string) => {
        const updated = await toggleMealComplete(mealId);

        if (updated) {
            setMeals(prev => prev.map(m => {
                if (m.id === mealId) {
                    return { ...m, status: updated.is_completed ? 'Completed' : null };
                }
                return m;
            }));
        }
    }, []);

    // Add a snack
    const addSnack = useCallback(async () => {
        const userId = getCurrentUserId();
        if (!userId) return;

        const snackData: WeeklyPlanInsert = {
            user_id: userId,
            date: dateStr,
            meal_type: 'breakfast', // Using breakfast as placeholder since schema requires it
            name: 'Greek Yogurt & Berries',
            calories: 150,
            protein: 12,
            image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFbNOEIDIjsydIi5OUBgHzCoIhjGv77dGbc7H0zAPsXDg-NcGduxPl1x4PQgxG3dTKaEz7bGWLhQGlx1UAItBRoqPpJU3pWPGgY2UUnPUELsNClBeR4M9crrPImbcNALtNRoZEJOh7ZCvYblg0VCIDrc140qEYRqvupOJmjWlhINUSYw1bNVnZmpTQ9hJ4ZnP2hEZV5dYjqc28DjC6_L0bOCBnlWMoJCg_3YDPKOTQKDdfsenV4ISTLwqKviXUbyPEYTUYUr_u2TdA'
        };

        const newSnack = await addPlannedMeal(snackData);

        if (newSnack) {
            setSnacks(prev => [...prev, {
                id: newSnack.id,
                name: newSnack.name,
                desc: `${newSnack.calories} kcal${newSnack.protein ? ` • ${newSnack.protein}g Protein` : ''}`,
                kcal: newSnack.calories,
                img: newSnack.image_url || ''
            }]);
            setTotalCalories(prev => prev + newSnack.calories);
        }
    }, [dateStr]);

    // Remove a snack
    const removeSnack = useCallback(async (id: string, kcal: number) => {
        const success = await deletePlannedMeal(id);

        if (success) {
            setSnacks(prev => prev.filter(s => s.id !== id));
            setTotalCalories(prev => Math.max(0, prev - kcal));
        }
    }, []);

    // Select a day
    const selectDay = useCallback((date: Date) => {
        setSelectedDate(date);
    }, []);

    return {
        selectedDate,
        dateStr,
        meals,
        snacks,
        loading,
        totalCalories,
        calorieGoal,
        days: getDays(),
        toggleStatus,
        addSnack,
        removeSnack,
        selectDay
    };
}

function formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}
