import React, { useEffect } from 'react';
import { X, Trophy, Calendar, BarChart } from 'lucide-react';
import { DailyHabit } from '../types/habit';
import { calculateCompletionRate } from '../utils/habitUtils';
import { format, parseISO } from 'date-fns';

interface HabitStatsModalProps {
  habit: DailyHabit;
  onClose: () => void;
}

const HabitStatsModal: React.FC<HabitStatsModalProps> = ({ habit, onClose }) => {
  const completionRate = calculateCompletionRate(habit);
  
  useEffect(() => {
    // Handle escape key to close modal
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  // Get last 7 completed dates (most recent first)
  const recentCompletions = [...habit.completedDates]
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, 7)
    .map(date => format(parseISO(date), 'MMM d, yyyy'));
  
  // Format created date
  const createdDate = format(parseISO(habit.createdAt), 'MMMM d, yyyy');
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div 
          className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Habit Statistics</h3>
            <button 
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>
          
          <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-1">{habit.name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{habit.description}</p>
          
          <div className="space-y-4">
            {/* Streak Stats */}
            <div className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/30 dark:to-blue-900/20 rounded-lg">
              <div className="flex items-start">
                <Trophy size={24} className="text-amber-500 mr-3 mt-1" />
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">Streaks</h5>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Current</p>
                      <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{habit.currentStreak} day{habit.currentStreak !== 1 ? 's' : ''}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Longest</p>
                      <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{habit.longestStreak} day{habit.longestStreak !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Completion Rate */}
            <div className="p-4 bg-white dark:bg-gray-750 rounded-lg shadow-sm">
              <div className="flex items-start">
                <BarChart size={24} className="text-blue-500 mr-3 mt-1" />
                <div className="w-full">
                  <h5 className="font-medium text-gray-900 dark:text-white">Completion Rate</h5>
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Overall</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{completionRate}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${completionRate}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Completions */}
            <div className="p-4 bg-white dark:bg-gray-750 rounded-lg shadow-sm">
              <div className="flex items-start">
                <Calendar size={24} className="text-green-500 mr-3 mt-1" />
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">Recent Completions</h5>
                  {recentCompletions.length > 0 ? (
                    <ul className="mt-2 space-y-1">
                      {recentCompletions.map((date, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                          {date}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      No completions yet
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Habit Info */}
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>Habit created on: {createdDate}</p>
              <p>Total completions: {habit.completedDates.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitStatsModal;