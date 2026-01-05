import { useState } from 'react';
import { Target, Home, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { HabitTracker } from './HabitTracker';
import { MoodSelector } from './MoodSelector';
import { VibeCoach } from './VibeCoach';

export function Dashboard() {
  const { toast } = useToast();
  
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [vibe, setVibe] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleHabitToggle = (habitId: string) => {
    setSelectedHabits(prev => 
      prev.includes(habitId) 
        ? prev.filter(h => h !== habitId)
        : [...prev, habitId]
    );
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };

  const handleLogAndGetVibe = async () => {
    if (!selectedMood) {
      toast({
        title: 'Pick a mood first',
        description: 'Select how you\'re feeling before logging your day.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Generate vibe from AI
      const { data: vibeData, error: vibeError } = await supabase.functions.invoke('generate-vibe', {
        body: { mood: selectedMood, habits: selectedHabits },
      });

      if (vibeError) throw vibeError;

      const newVibe = vibeData?.vibe || 'Keep building that momentum! You\'re doing amazing. 🎵 Vibe Track: Good Days by SZA';
      setVibe(newVibe);

      toast({
        title: 'Vibe generated! 🎉',
        description: 'Keep up the momentum!',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Something went wrong',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="w-full py-6 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <Target className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Momentum</span>
          </div>
          
          <Link to="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Greeting */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {getGreeting()}, ready to build?
            </h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Vibe Coach */}
          <VibeCoach 
            vibe={vibe} 
            isLoading={isLoading} 
            hasData={!!selectedMood || selectedHabits.length > 0} 
          />

          {/* Mood Selector */}
          <MoodSelector 
            selectedMood={selectedMood} 
            onSelect={handleMoodSelect} 
          />

          {/* Habit Tracker */}
          <HabitTracker 
            selectedHabits={selectedHabits} 
            onToggle={handleHabitToggle} 
          />

          {/* Log Button */}
          <div className="animate-fade-in-up animation-delay-300">
            <Button 
              onClick={handleLogAndGetVibe}
              disabled={isLoading}
              size="lg"
              className="w-full py-6 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating vibe...
                </>
              ) : (
                '✨ Get Your Vibe'
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}