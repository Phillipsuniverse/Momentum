import { 
  Brain, 
  Dumbbell, 
  Leaf, 
  CandyOff, 
  Droplets, 
  BookOpen, 
  Bike, 
  PenLine 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const HABITS = [
  { id: 'deep-work', label: 'Deep Work', icon: Brain },
  { id: 'exercise', label: 'Exercise', icon: Dumbbell },
  { id: 'meditation', label: 'Meditation', icon: Leaf },
  { id: 'no-sugar', label: 'No Sugar', icon: CandyOff },
  { id: 'water', label: '3L Water', icon: Droplets },
  { id: 'reading', label: 'Read 10 Pages', icon: BookOpen },
  { id: 'gym', label: 'Gym / Workout', icon: Bike },
  { id: 'journal', label: 'Journaling', icon: PenLine },
];

interface HabitTrackerProps {
  selectedHabits: string[];
  onToggle: (habitId: string) => void;
}

export function HabitTracker({ selectedHabits, onToggle }: HabitTrackerProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm animate-fade-in-up animation-delay-100">
      <h2 className="text-lg font-semibold mb-4">Today's Habits</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {HABITS.map((habit) => {
          const isSelected = selectedHabits.includes(habit.id);
          const Icon = habit.icon;
          
          return (
            <button
              key={habit.id}
              onClick={() => onToggle(habit.id)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-95',
                isSelected
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background border-border hover:border-muted-foreground/30'
              )}
            >
              <div className={cn('transition-transform duration-200', isSelected && 'scale-110')}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-center leading-tight">
                {habit.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
