import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import HabitList from './components/HabitList';
import HabitForm from './components/HabitForm';
import HabitEditModal from './components/HabitEditModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Auth from './components/Auth';
import { useHabits } from './hooks/useHabits';
import { useTheme } from './hooks/useTheme';
import { DailyHabit, HabitCategory } from './types/habit';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { habits, addHabit, deleteHabit, toggleHabitCompletion, editHabit } = useHabits();
  const [session, setSession] = useState(null);
  const [habitToEdit, setHabitToEdit] = useState<DailyHabit | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<DailyHabit | null>(null);
  const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');
  
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  useEffect(() => {
    // Update view based on URL
    const path = window.location.pathname;
    if (path === '/sign-up') {
      setView('sign-up');
    } else {
      setView('sign-in');
    }
  }, []);

  const handleDelete = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (habit) {
      setHabitToDelete(habit);
    }
  };
  
  const confirmDelete = () => {
    if (habitToDelete) {
      deleteHabit(habitToDelete.id);
      setHabitToDelete(null);
    }
  };
  
  const handleEdit = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (habit) {
      setHabitToEdit(habit);
    }
  };
  
  const handleSaveEdit = (
    id: string, 
    updates: { name?: string; description?: string; category?: HabitCategory }
  ) => {
    editHabit(id, updates);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return <Auth view={view} />;
  }
  
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${theme}`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-24">
        <Header 
          theme={theme} 
          toggleTheme={toggleTheme}
          onLogout={handleLogout}
        />
        
        <main>
          <HabitList
            habits={habits}
            onToggleCompletion={toggleHabitCompletion}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
          
          <HabitForm onAddHabit={addHabit} />
        </main>
        
        {habitToEdit && (
          <HabitEditModal
            habit={habitToEdit}
            onSave={handleSaveEdit}
            onClose={() => setHabitToEdit(null)}
          />
        )}
        
        {habitToDelete && (
          <DeleteConfirmModal
            habitName={habitToDelete.name}
            onConfirm={confirmDelete}
            onCancel={() => setHabitToDelete(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;