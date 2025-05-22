import React, { useState } from 'react';
import { CheckCircle, Circle, Trash2, Edit, BarChart2 } from 'lucide-react';
import { DailyHabit } from '../types/habit';

interface HabitItemProps {
  habit: DailyHabit;
  onToggleCompletion: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onShowStats: (habit: DailyHabit) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  onToggleCompletion,
  onDelete,
  onEdit,
  onShowStats
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'productivity': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'learning': return 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200';
      case 'social': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };
  
  return (
    <div 
      className={`relative p-4 mb-3 rounded-lg transition-all duration-200 ${
        habit.isCompletedToday 
          ? 'bg-teal-50 dark:bg-teal-900/30 border-l-4 border-teal-500' 
          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 border-l-4 border-transparent'
      } shadow-sm hover:shadow`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center">
        <button
          onClick={() => onToggleCompletion(habit.id)}
          className={`flex-shrink-0 transition-transform duration-200 ${habit.isCompletedToday ? 'text-teal-500 scale-110' : 'text-gray-400 hover:text-teal-500'}`}
          aria-label={habit.isCompletedToday ? "Mark as incomplete" : "Mark as complete"}
        >
          {habit.isCompletedToday ? (
            <CheckCircle size={24} className="transition-all duration-300 ease-bounce" />
          ) : (
            <Circle size={24} />
          )}
        </button>
        
        <div className="ml-3 flex-grow">
          <h3 className={`font-medium text-gray-900 dark:text-white ${habit.isCompletedToday ? 'line-through opacity-75' : ''}`}>
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {habit.description}
            </p>
          )}
          
          <div className="flex items-center mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(habit.category)}`}>
              {habit.category}
            </span>
            
            <div className="flex items-center ml-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Current streak: <span className="font-semibold text-teal-600 dark:text-teal-400">{habit.currentStreak} day{habit.currentStreak !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`flex space-x-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={() => onShowStats(habit)}
            className="p-1.5 text-gray-500 hover:text-violet-500 rounded-full hover:bg-violet-50 dark:hover:bg-violet-900/30"
            aria-label="View statistics"
          >
            <BarChart2 size={18} />
          </button>
          <button 
            onClick={() => onEdit(habit.id)}
            className="p-1.5 text-gray-500 hover:text-blue-500 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
            aria-label="Edit habit"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => onDelete(habit.id)}
            className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
            aria-label="Delete habit"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitItem;