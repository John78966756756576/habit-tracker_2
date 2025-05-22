export type HabitCategory = 'health' | 'productivity' | 'learning' | 'social' | 'other';

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: HabitCategory;
  createdAt: string; // ISO date string
  completedDates: string[]; // Array of ISO date strings
}

export interface DailyHabit extends Habit {
  isCompletedToday: boolean;
  currentStreak: number;
  longestStreak: number;
}