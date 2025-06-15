import { Code2 } from 'lucide-react';
import { ThemeToggleButton } from '@/components/theme-toggle-button';

export default function AppHeader() {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-border shadow-sm bg-card">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Code2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">
            JSONFormer
          </h1>
        </div>
        <ThemeToggleButton />
      </div>
    </header>
  );
}
