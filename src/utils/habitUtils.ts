import { addDays, format, isToday, parseISO, isSameDay, differenceInDays } from 'date-fns';
import { Habit, DailyHabit } from '../types/habit';

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Format date to YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Check if habit is completed for a specific date
export const isHabitCompletedOnDate = (habit: Habit, date: Date): boolean => {
  return habit.completedDates.some(completedDate => 
    isSameDay(parseISO(completedDate), date)
  );
};

// Check if habit is completed today
export const isHabitCompletedToday = (habit: Habit): boolean => {
  return habit.completedDates.some(completedDate => 
    isToday(parseISO(completedDate))
  );
};

// Calculate current streak for a habit
export const calculateCurrentStreak = (habit: Habit): number => {
  if (habit.completedDates.length === 0) return 0;
  
  // Sort dates in descending order
  const sortedDates = [...habit.completedDates]
    .map(date => parseISO(date))
    .sort((a, b) => b.getTime() - a.getTime());
  
  // If the latest completion is not today or yesterday, streak is broken
  const latestDate = sortedDates[0];
  if (!isToday(latestDate) && differenceInDays(new Date(), latestDate) > 1) {
    return 0;
  }
  
  let streak = 1;
  let currentDate = latestDate;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const expectedPrevDate = addDays(currentDate, -1);
    if (isSameDay(sortedDates[i], expectedPrevDate)) {
      streak++;
      currentDate = sortedDates[i];
    } else {
      break;
    }
  }
  
  return streak;
};

// Calculate longest streak for a habit
export const calculateLongestStreak = (habit: Habit): number => {
  if (habit.completedDates.length === 0) return 0;
  
  // Sort dates in ascending order
  const sortedDates = [...habit.completedDates]
    .map(date => parseISO(date))
    .sort((a, b) => a.getTime() - b.getTime());
  
  let longestStreak = 1;
  let currentStreak = 1;
  let prevDate = sortedDates[0];
  
  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i];
    const expectedDate = addDays(prevDate, 1);
    
    if (isSameDay(currentDate, expectedDate)) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 1;
    }
    
    prevDate = currentDate;
  }
  
  return longestStreak;
};

// Convert Habit to DailyHabit (with today's status and streaks)
export const enrichHabitWithStats = (habit: Habit): DailyHabit => {
  return {
    ...habit,
    isCompletedToday: isHabitCompletedToday(habit),
    currentStreak: calculateCurrentStreak(habit),
    longestStreak: calculateLongestStreak(habit)
  };
};

// Calculate completion rate (percentage of days completed since creation)
export const calculateCompletionRate = (habit: Habit): number => {
  const creationDate = parseISO(habit.createdAt);
  const today = new Date();
  const daysSinceCreation = Math.max(1, differenceInDays(today, creationDate) + 1);
  const completedDays = new Set(habit.completedDates.map(date => 
    format(parseISO(date), 'yyyy-MM-dd')
  )).size;
  
  return Math.round((completedDays / daysSinceCreation) * 100);
};