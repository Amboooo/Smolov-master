import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Dumbbell, ImageIcon, Loader2 } from 'lucide-react'; // ImageIcon was Image, changed to avoid conflict. Added Loader2.
import { ThemeToggleButton } from '@/components/ThemeToggleButton';

interface NavbarProps {
  onGenerateAiBackground: () => Promise<void>;
  isGeneratingAiBackground: boolean;
}

export function Navbar({ onGenerateAiBackground, isGeneratingAiBackground }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-screen-xl mx-auto px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
        </Link>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/"> 
              <Dumbbell className="mr-2 h-4 w-4" />
              My Plans
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={onGenerateAiBackground} 
            disabled={isGeneratingAiBackground}
            title="Generate AI Comic Background"
            className="px-2 sm:px-3" // Adjust padding for smaller screens if needed
          >
            {isGeneratingAiBackground ? (
              <Loader2 className="h-5 w-5 animate-spin sm:mr-2" />
            ) : (
              <ImageIcon className="h-5 w-5 sm:mr-2" />
            )}
            <span className="hidden sm:inline">AI BG</span> {/* Hide text on very small screens */}
          </Button>

          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
}
