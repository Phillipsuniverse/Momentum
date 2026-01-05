import { 
  Frown, 
  Meh, 
  Smile, 
  SmilePlus, 
  Laugh, 
  BatteryLow, 
  Rocket 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MOODS = [
  { id: 'tired', label: 'Tired', icon: BatteryLow, color: 'text-purple-500' },
  { id: 'low', label: 'Low', icon: Frown, color: 'text-red-500' },
  { id: 'meh', label: 'Meh', icon: Meh, color: 'text-orange-500' },
  { id: 'neutral', label: 'Neutral', icon: Smile, color: 'text-yellow-500' },
  { id: 'good', label: 'Good', icon: SmilePlus, color: 'text-lime-500' },
  { id: 'great', label: 'Great', icon: Laugh, color: 'text-green-500' },
  { id: 'pumped', label: 'Pumped', icon: Rocket, color: 'text-blue-500' },
];

interface MoodSelectorProps {
  selectedMood: string | null;
  onSelect: (moodId: string) => void;
}

export function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm animate-fade-in-up animation-delay-200">
      <h2 className="text-lg font-semibold mb-4">How are you feeling?</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {MOODS.map((mood) => {
          const isSelected = selectedMood === mood.id;
          const Icon = mood.icon;
          
          return (
            <button
              key={mood.id}
              onClick={() => onSelect(mood.id)}
              className={cn(
                'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 min-w-[72px] hover:scale-105 active:scale-90',
                isSelected
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background border-border hover:border-muted-foreground/30'
              )}
            >
              <div className={cn('transition-transform duration-200', isSelected && 'scale-125')}>
                <Icon className={cn('w-6 h-6', !isSelected && mood.color)} />
              </div>
              <span className="text-xs font-medium">{mood.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
