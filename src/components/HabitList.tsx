import React, { useState } from 'react';
import { CheckCircle2, Filter, ListFilter } from 'lucide-react';
import HabitItem from './HabitItem';
import { DailyHabit, HabitCategory } from '../types/habit';
import HabitStatsModal from './HabitStatsModal';

interface HabitListProps {
  habits: DailyHabit[];
  onToggleCompletion: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({
  habits,
  onToggleCompletion,
  onDelete,
  onEdit
}) => {
  const [filterType, setFilterType] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [categoryFilter, setCategoryFilter] = useState<HabitCategory | 'all'>('all');
  const [selectedHabit, setSelectedHabit] = useState<DailyHabit | null>(null);
  
  const filteredHabits = habits.filter(habit => {
    // Filter by completion status
    if (filterType === 'completed' && !habit.isCompletedToday) return false;
    if (filterType === 'incomplete' && habit.isCompletedToday) return false;
    
    // Filter by category
    if (categoryFilter !== 'all' && habit.category !== categoryFilter) return false;
    
    return true;
  });
  
  const completedCount = habits.filter(h => h.isCompletedToday).length;
  const completionRate = habits.length > 0 
    ? Math.round((completedCount / habits.length) * 100) 
    : 0;
  
  return (
    <div className="mt-4">
      {habits.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="text-gray-700 dark:text-gray-300 text-sm">
                <span className="font-medium">{completedCount}/{habits.length}</span> completed today
              </div>
              <div className="ml-3 h-2 w-32 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-500 transition-all duration-500 ease-out" 
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {completionRate}%
              </div>
            </div>
            
            <div className="flex space-x-2">
              <div className="relative inline-block">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'completed' | 'incomplete')}
                  className="pl-9 pr-4 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="all">All habits</option>
                  <option value="completed">Completed</option>
                  <option value="incomplete">Incomplete</option>
                </select>
                <CheckCircle2 size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <div className="relative inline-block">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as HabitCategory | 'all')}
                  className="pl-9 pr-4 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="all">All categories</option>
                  <option value="health">Health</option>
                  <option value="productivity">Productivity</option>
                  <option value="learning">Learning</option>
                  <option value="social">Social</option>
                  <option value="other">Other</option>
                </select>
                <ListFilter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            {filteredHabits.length > 0 ? (
              filteredHabits.map(habit => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  onToggleCompletion={onToggleCompletion}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onShowStats={setSelectedHabit}
                />
              ))
            ) : (
              <div className="text-center py-8 px-4">
                <Filter size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No habits match your filters</p>
                <button 
                  onClick={() => { setFilterType('all'); setCategoryFilter('all'); }}
                  className="mt-2 text-sm text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
          
          {selectedHabit && (
            <HabitStatsModal
              habit={selectedHabit}
              onClose={() => setSelectedHabit(null)}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="mx-auto w-16 h-16 bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center rounded-full mb-4">
            <CheckCircle2 size={32} className="text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No habits yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Start by adding your first habit using the form below. Track daily activities and build positive routines.
          </p>
        </div>
      )}
    </div>
  );
};

export default HabitList;