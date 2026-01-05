import { useState, useEffect } from 'react';
import { Target, LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { HabitTracker } from './HabitTracker';
import { MoodSelector } from './MoodSelector';
import { VibeCoach } from './VibeCoach';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [vibe, setVibe] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Load today's data on mount
  useEffect(() => {
    const loadTodayData = async () => {
      if (!user) return;
      
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', today)
        .maybeSingle();

      if (error) {
        console.error('Error loading today\'s data:', error);
      } else if (data) {
        setSelectedMood(data.mood);
        setSelectedHabits(data.habits || []);
        setVibe(data.ai_vibe);
      }
      setInitialLoadDone(true);
    };

    loadTodayData();
  }, [user]);

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
    if (!user) return;
    if (!selectedMood) {
      toast({
        title: 'Pick a mood first',
        description: 'Select how you\'re feeling before logging your day.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    setIsLoading(true);
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
      // Save to database
      const { error: saveError } = await supabase
        .from('daily_logs')
        .upsert({
          user_id: user.id,
          log_date: today,
          mood: selectedMood,
          habits: selectedHabits,
        }, {
          onConflict: 'user_id,log_date',
        });

      if (saveError) throw saveError;

      // Generate vibe from AI
      const { data: vibeData, error: vibeError } = await supabase.functions.invoke('generate-vibe', {
        body: { mood: selectedMood, habits: selectedHabits },
      });

      if (vibeError) throw vibeError;

      const newVibe = vibeData?.vibe || 'Keep building that momentum! You\'re doing amazing. 🎵 Vibe Track: Good Days by SZA';
      setVibe(newVibe);

      // Save vibe to database
      await supabase
        .from('daily_logs')
        .update({ ai_vibe: newVibe })
        .eq('user_id', user.id)
        .eq('log_date', today);

      toast({
        title: 'Day logged! 🎉',
        description: 'Your vibe has been generated.',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Something went wrong',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!initialLoadDone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
          
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
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
              disabled={isSaving}
              size="lg"
              className="w-full py-6 text-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving & generating...
                </>
              ) : (
                '✨ Log Today & Get Vibe'
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
