import { useState, useEffect } from 'react';
import { Habit, DailyHabit, HabitCategory } from '../types/habit';
import { generateId, formatDate, enrichHabitWithStats } from '../utils/habitUtils';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load habits from localStorage on mount
  useEffect(() => {
    const loadHabits = () => {
      try {
        const savedHabits = localStorage.getItem('habits');
        if (savedHabits) {
          setHabits(JSON.parse(savedHabits));
        }
      } catch (error) {
        console.error('Error loading habits:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHabits();
  }, []);
  
  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits, isLoading]);
  
  // Add a new habit
  const addHabit = (name: string, description: string, category: HabitCategory) => {
    const newHabit: Habit = {
      id: generateId(),
      name,
      description,
      category,
      createdAt: new Date().toISOString(),
      completedDates: []
    };
    
    setHabits(prevHabits => [...prevHabits, newHabit]);
  };
  
  // Delete a habit
  const deleteHabit = (id: string) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
  };
  
  // Toggle habit completion for today
  const toggleHabitCompletion = (id: string) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (habit.id !== id) return habit;
        
        const today = formatDate(new Date());
        const isCompletedToday = habit.completedDates.some(date => 
          date.startsWith(today)
        );
        
        if (isCompletedToday) {
          // Remove today from completedDates
          return {
            ...habit,
            completedDates: habit.completedDates.filter(date => 
              !date.startsWith(today)
            )
          };
        } else {
          // Add today to completedDates
          return {
            ...habit,
            completedDates: [...habit.completedDates, new Date().toISOString()]
          };
        }
      })
    );
  };
  
  // Edit a habit
  const editHabit = (
    id: string, 
    updates: { name?: string; description?: string; category?: HabitCategory }
  ) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === id 
          ? { ...habit, ...updates }
          : habit
      )
    );
  };
  
  // Get all habits with additional daily status
  const getDailyHabits = (): DailyHabit[] => {
    return habits.map(enrichHabitWithStats);
  };
  
  return {
    habits: getDailyHabits(),
    isLoading,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    editHabit
  };
};