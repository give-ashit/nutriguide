import { useState, useEffect, useCallback } from 'react';
import {
    getHydrationLog,
    updateHydrationLog,
    setWaterIntake
} from '../services/hydrationService';
import { getCurrentUserId } from '../lib/supabase';

export function useHydration(date?: Date) {
    const [currentDate] = useState(date || new Date());
    const [glasses, setGlasses] = useState(0);
    const [goal] = useState(8);
    const [loading, setLoading] = useState(true);

    const dateStr = currentDate.toISOString().split('T')[0];

    // Load hydration log
    useEffect(() => {
        const loadHydration = async () => {
            const userId = getCurrentUserId();
            if (!userId) {
                setLoading(false);
                return;
            }

            const log = await getHydrationLog(userId, dateStr);
            if (log) {
                setGlasses(log.glasses);
            }
            setLoading(false);
        };

        loadHydration();
    }, [dateStr]);

    // Update water intake
    const setWater = useCallback(async (amount: number) => {
        const userId = getCurrentUserId();
        if (!userId) return;

        const newAmount = Math.max(0, Math.min(goal, amount));

        // Optimistic update
        setGlasses(newAmount);

        await updateHydrationLog(userId, dateStr, newAmount);
    }, [dateStr, goal]);

    // Add water
    const addWater = useCallback(async () => {
        if (glasses < goal) {
            await setWater(glasses + 1);
        }
    }, [glasses, goal, setWater]);

    // Remove water
    const removeWater = useCallback(async () => {
        if (glasses > 0) {
            await setWater(glasses - 1);
        }
    }, [glasses, setWater]);

    // Handle clicking on a specific glass
    const handleGlassClick = useCallback(async (index: number) => {
        // If clicking the current level, toggle down
        if (glasses === index + 1) {
            await setWater(index);
        } else {
            await setWater(index + 1);
        }
    }, [glasses, setWater]);

    return {
        glasses,
        goal,
        loading,
        addWater,
        removeWater,
        setWater,
        handleGlassClick,
        percentage: Math.round((glasses / goal) * 100)
    };
}
