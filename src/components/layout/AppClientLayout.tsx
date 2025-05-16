
"use client";

import React, { type ReactNode, useState, useCallback, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { generateComicBackground } from '@/ai/flows/generate-comic-background-flow';
import { useToast } from "@/hooks/use-toast";
import { AiBackgroundContext } from '@/context/AiBackgroundContext';
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile

export function AppClientLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [aiBackground, setAiBackground] = useState<string | null>(null);
  const [isLoadingAiBackground, setIsLoadingAiBackground] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile(); // Get mobile state

  const handleGenerateAiBackground = useCallback(async () => {
    setIsLoadingAiBackground(true);
    try {
      const result = await generateComicBackground();
      setAiBackground(result.imageDataUri);
      toast({
        title: "AI Background Activated!",
        description: "The visual dimension has shifted. Enjoy the new vibe!",
      });
    } catch (error) {
      console.error("Failed to generate AI background:", error);
      toast({
        title: "AI Art Block",
        description: "The AI muse is currently unavailable. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAiBackground(false);
    }
  }, [toast]);

  useEffect(() => {
    const bodyEl = document.body;
    // Store the original inline style attribute to attempt restoration.
    // This is a bit naive as other scripts could also change inline styles.
    // A class-based approach for the default body background is often more robust.
    const originalInlineStyle = bodyEl.getAttribute('style');

    if (aiBackground) {
      bodyEl.style.backgroundImage = `url(${aiBackground})`;
      bodyEl.style.backgroundSize = 'cover';
      bodyEl.style.backgroundPosition = 'center';
      bodyEl.style.backgroundRepeat = 'no-repeat';
      if (isMobile) {
        bodyEl.style.backgroundAttachment = 'scroll'; // Use 'scroll' for mobile
      } else {
        bodyEl.style.backgroundAttachment = 'fixed';   // Use 'fixed' for desktop
      }
      bodyEl.classList.add('ai-background-active');
    } else {
      // Clear the styles set by this component
      bodyEl.style.backgroundImage = '';
      bodyEl.style.backgroundSize = '';
      bodyEl.style.backgroundPosition = '';
      bodyEl.style.backgroundRepeat = '';
      bodyEl.style.backgroundAttachment = '';
      bodyEl.classList.remove('ai-background-active');
      // If there was an original inline style, try to restore it.
      // This part is optional and can be tricky if multiple sources modify inline styles.
      // For now, we'll clear our specific styles. If globals.css defines the default, it will take over.
      // if (originalInlineStyle !== null) {
      //   bodyEl.setAttribute('style', originalInlineStyle);
      // } else {
      //   bodyEl.removeAttribute('style');
      // }
    }

    return () => {
      // Cleanup: Revert body styles to a known default state or original.
      // Simplest is to remove what we added, assuming CSS classes handle the default.
      bodyEl.style.backgroundImage = '';
      bodyEl.style.backgroundSize = '';
      bodyEl.style.backgroundPosition = '';
      bodyEl.style.backgroundRepeat = '';
      bodyEl.style.backgroundAttachment = '';
      bodyEl.classList.remove('ai-background-active');
      // If we had a more sophisticated way to store/restore original styles:
      // if (originalInlineStyle) bodyEl.setAttribute('style', originalInlineStyle);
      // else bodyEl.removeAttribute('style');
    };
  }, [aiBackground, isMobile]); // Add isMobile to the dependency array

  return (
    <React.Fragment>
      <ThemeProvider
        defaultTheme="system"
        storageKey="smolov-strength-theme"
      >
        <AiBackgroundContext.Provider value={{ aiBackground }}>
          <div className="relative flex min-h-screen flex-col">
            <Navbar 
              onGenerateAiBackground={handleGenerateAiBackground} 
              isGeneratingAiBackground={isLoadingAiBackground} 
            />
            <main className={`flex-1 container max-w-screen-xl mx-auto px-4 py-8 transition-all duration-300 ease-in-out ${aiBackground ? 'bg-card/80 dark:bg-card/70 backdrop-blur-sm rounded-lg shadow-xl my-4' : ''}`}>
              {children}
            </main>
            <Footer />
          </div>
        </AiBackgroundContext.Provider>
        <Toaster />
      </ThemeProvider>
    </React.Fragment>
  );
}
