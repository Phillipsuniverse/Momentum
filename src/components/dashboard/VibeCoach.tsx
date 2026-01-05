import { Sparkles, Loader2 } from 'lucide-react';

interface VibeCoachProps {
  vibe: string | null;
  isLoading: boolean;
  hasData: boolean;
}

export function VibeCoach({ vibe, isLoading, hasData }: VibeCoachProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-accent/10 via-card to-accent/5 border border-accent/20 rounded-2xl p-6 shadow-sm animate-fade-in-up">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <h2 className="text-lg font-semibold">Vibe Coach</h2>
        </div>
        
        <div className="min-h-[60px] flex items-center">
          {isLoading ? (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="animate-pulse">Generating your vibe...</span>
            </div>
          ) : vibe ? (
            <p className="text-foreground leading-relaxed animate-fade-in">
              {vibe}
            </p>
          ) : (
            <p className="text-muted-foreground">
              {hasData 
                ? '✨ Click "Log Today & Get Vibe" to generate your personalized motivation!'
                : '✨ Pick a mood and some habits, then log your day to get your vibe...'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
