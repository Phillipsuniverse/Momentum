import { ArrowRight, CheckCircle2, Sparkles, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <Target className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Momentum</span>
          </div>
          
          <Link to="/dashboard" className="animate-fade-in">
            <Button size="sm">
              Start
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">AI-powered motivation</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up animation-delay-100">
            Build habits.
            <br />
            <span className="text-muted-foreground">Track your vibe.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-xl mx-auto animate-fade-in-up animation-delay-200">
            A minimalist daily tracker that combines habit logging with mood tracking 
            and AI-powered motivation to keep you moving forward.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2 px-8">
                Start tracking
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: '12 Daily Habits', desc: 'Track what matters most to you' },
              { title: '7 Mood Levels', desc: 'Capture how you really feel' },
              { title: 'AI Vibe Coach', desc: 'Get personalized motivation' },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className={`bg-card border border-border rounded-2xl p-6 text-left animate-fade-in-up animation-delay-${400 + i * 100}`}
              >
                <CheckCircle2 className="w-6 h-6 text-accent mb-3" />
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm text-muted-foreground">
        <p>© 2025 Momentum. Built with focus.</p>
      </footer>
    </div>
  );
}
