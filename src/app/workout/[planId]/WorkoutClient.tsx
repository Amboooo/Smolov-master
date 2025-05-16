'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { WorkoutDisplayCard } from '@/components/WorkoutDisplayCard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { WorkoutPlan, WorkoutLogEntry } from '@/lib/types';

const PLANS_KEY = 'smolovStrength_workoutPlans';
const LOGS_KEY = 'smolovStrength_workoutLogs';

export default function WorkoutClient({ planId }: { planId: string }) {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan | null>(null);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(() => {
    if (!planId) {
      setIsLoading(false);
      setError("Plan ID is missing.");
      return;
    }

    try {
      const storedPlans = localStorage.getItem(PLANS_KEY);
      const storedLogs = localStorage.getItem(LOGS_KEY);

      if (storedPlans) {
        const allPlans: WorkoutPlan[] = JSON.parse(storedPlans);
        const foundPlan = allPlans.find(p => p.id === planId);
        if (foundPlan) {
          setCurrentPlan(foundPlan);
        } else {
          setError(`Workout plan with ID "${planId}" not found.`);
        }
      } else {
        setError("No workout plans found in storage.");
      }

      if (storedLogs) {
        setWorkoutLogs(JSON.parse(storedLogs));
      }
    } catch (e) {
      console.error("Error loading data from localStorage:", e);
      setError("Failed to load workout data.");
    }

    setIsLoading(false);
  }, [planId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePlanUpdate = useCallback((updatedPlan: WorkoutPlan) => {
    setCurrentPlan(updatedPlan);

    try {
      const storedPlans = localStorage.getItem(PLANS_KEY);
      const existingPlans: WorkoutPlan[] = storedPlans ? JSON.parse(storedPlans) : [];
      const planIndex = existingPlans.findIndex(p => p.id === updatedPlan.id);

      if (planIndex !== -1) {
        existingPlans[planIndex] = updatedPlan;
        localStorage.setItem(PLANS_KEY, JSON.stringify(existingPlans));
      } else {
        console.warn("Plan not found when updating.");
      }
    } catch (e) {
      console.error("Failed to update plan in storage:", e);
      setError("Could not save updated plan.");
    }
  }, []);

  const handleWorkoutComplete = useCallback((logEntry: WorkoutLogEntry, updatedPlan: WorkoutPlan) => {
    const newLogs = [...workoutLogs, logEntry];
    setWorkoutLogs(newLogs);
    handlePlanUpdate(updatedPlan);

    try {
      localStorage.setItem(LOGS_KEY, JSON.stringify(newLogs));
    } catch (e) {
      console.error("Failed to save logs:", e);
      setError("Could not save workout log.");
    }
  }, [workoutLogs, handlePlanUpdate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading workout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">Error</h2>
        <p className="mb-6 text-muted-foreground">{error}</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Plans
          </Link>
        </Button>
      </div>
    );
  }

  if (!currentPlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-semibold mb-2">Plan Missing</h2>
        <p className="mb-6 text-muted-foreground">Could not find the requested workout plan.</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Plans
          </Link>
        </Button>
      </div>
    );
  }

  if (currentPlan.isPlanCompleted) {
    return (
      <Card className="max-w-xl mx-auto my-12 p-6 text-center">
        <CardHeader>
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold">Plan Completed!</CardTitle>
          <CardDescription>You've completed the {currentPlan.exercise} program. Great job!</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="mt-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Plans
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <WorkoutDisplayCard
        initialPlan={currentPlan}
        onPlanUpdate={handlePlanUpdate}
        onWorkoutComplete={handleWorkoutComplete}
      />
      <div className="text-center mt-6">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Plans
          </Link>
        </Button>
      </div>
    </div>
  );
}
