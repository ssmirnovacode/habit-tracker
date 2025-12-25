
import { create } from 'zustand';
import { db } from '../db';
import type { Habit, Completion } from '../db';
import { Temporal } from '@js-temporal/polyfill';

type StoreState = {
    habits: Habit[];
    completions: Completion[];
    currentWeekStart: Temporal.PlainDate;
    isLoading: boolean;

    fetchData: () => Promise<void>;
    addHabit: (name: string) => Promise<void>;
    deleteHabit: (id: number) => Promise<void>;
    toggleCompletion: (habitId: number, date: string) => Promise<void>;
    setCurrentWeek: (date: Temporal.PlainDate) => void;
}

export const useStore = create<StoreState>((set, get) => ({
    habits: [],
    completions: [],
    currentWeekStart: Temporal.Now.plainDateISO().subtract({ days: Temporal.Now.plainDateISO().dayOfWeek - 1 }),
    isLoading: true,

    fetchData: async () => {
        set({ isLoading: true });
        try {
            const [habits, completions] = await Promise.all([
                db.getAllHabits(),
                db.getAllCompletions(),
            ]);
            set({ habits, completions, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch data:', error);
            set({ isLoading: false });
        }
    },

    addHabit: async (name: string) => {
        await db.addHabit(name);
        await get().fetchData();
    },

    deleteHabit: async (id: number) => {
        await db.deleteHabit(id);
        await get().fetchData();
    },

    toggleCompletion: async (habitId: number, date: string) => {
        await db.toggleCompletion(habitId, date);
        await get().fetchData();
    },

    setCurrentWeek: (date: Temporal.PlainDate) => {
        const monday = date.subtract({ days: date.dayOfWeek - 1 });
        set({ currentWeekStart: monday });
    },
}));
