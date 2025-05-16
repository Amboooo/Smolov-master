
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

interface AiBackgroundContextType {
  aiBackground: string | null;
}

const AiBackgroundContext = createContext<AiBackgroundContextType | undefined>(undefined);

export function useAiBackground(): AiBackgroundContextType {
  const context = useContext(AiBackgroundContext);
  if (context === undefined) {
    throw new Error('useAiBackground must be used within an AiBackgroundContext.Provider');
  }
  return context;
}

// Props for a potential Provider component if we move state management out of AppClientLayout
// For now, AppClientLayout will directly use AiBackgroundContext.Provider
/*
interface AiBackgroundProviderProps {
  children: ReactNode;
}

export function AiBackgroundProvider({ children }: AiBackgroundProviderProps) {
  // State management for aiBackground would go here if this were a standalone provider
  const value = { aiBackground: null }; // Placeholder
  return (
    <AiBackgroundContext.Provider value={value}>
      {children}
    </AiBackgroundContext.Provider>
  );
}
*/

// Exporting the context directly for AppClientLayout to provide.
export { AiBackgroundContext };
