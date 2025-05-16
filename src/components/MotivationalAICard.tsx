"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { MotivationalMessageInput } from '@/ai/flows/motivational-messages';
import { generateMotivationalMessage } from '@/ai/flows/motivational-messages';
import { Sparkles, Loader2 } from 'lucide-react';

interface MotivationalAICardProps {
  workoutContext: Omit<MotivationalMessageInput, 'setsCompleted' | 'totalSets'> & { currentSetIdx: number, totalSetsForDay: number};
  onMessageGenerated?: (message: string) => void;
}

export function MotivationalAICard({ workoutContext, onMessageGenerated }: MotivationalAICardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetMotivation = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const input: MotivationalMessageInput = {
        exercise: workoutContext.exercise,
        weight: workoutContext.weight,
        reps: workoutContext.reps,
        setsCompleted: workoutContext.currentSetIdx, // Sets completed *before* this current set
        totalSets: workoutContext.totalSetsForDay,
      };
      const result = await generateMotivationalMessage(input);
      setMessage(result.message);
      if (onMessageGenerated) {
        onMessageGenerated(result.message);
      }
      toast({
        title: "Motivation Boost!",
        description: result.message,
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to get motivational message:", error);
      toast({
        title: "Error",
        description: "Could not fetch motivation. Keep pushing!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleGetMotivation} disabled={isLoading} variant="outline" className="w-full mt-2">
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4 text-accent" />
      )}
      Get Motivational Message
    </Button>
  );
}
