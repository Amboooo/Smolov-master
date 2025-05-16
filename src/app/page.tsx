
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlanSetupForm } from '@/components/PlanSetupForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { WorkoutPlan } from '@/lib/types';
import { ArrowRight, CheckCircle, Zap, Trash2, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAiBackground } from '@/context/AiBackgroundContext';


const PLANS_KEY = 'smolovStrength_workoutPlans'; // Changed from WORKOUT_PLAN_KEY

export default function HomePage() {
  const router = useRouter();
  const [allPlans, setAllPlans] = useState<WorkoutPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { aiBackground } = useAiBackground();

  useEffect(() => {
    try {
      const storedPlans = localStorage.getItem(PLANS_KEY);
      if (storedPlans) {
        setAllPlans(JSON.parse(storedPlans));
      }
    } catch (error) {
      console.error("Error reading plans from localStorage:", error);
      localStorage.removeItem(PLANS_KEY); 
    }
    setIsLoading(false);
  }, []);

  const handlePlanCreated = (newPlan: WorkoutPlan) => {
    setAllPlans(prevPlans => {
      const updatedPlans = [...prevPlans, newPlan];
      try {
        localStorage.setItem(PLANS_KEY, JSON.stringify(updatedPlans));
      } catch (e) {
        console.error("Failed to save new plan to localStorage", e);
      }
      return updatedPlans;
    });
    // PlanSetupForm will handle navigation to /workout/[newPlan.id]
  };

  const handleClearAllPlans = () => {
    localStorage.removeItem(PLANS_KEY);
    // Potentially also clear WORKOUT_LOGS_KEY if desired, for now just plans
    // localStorage.removeItem('smolovStrength_workoutLogs'); 
    setAllPlans([]);
  };

  const handleDeletePlan = (planId: string) => {
    setAllPlans(prevPlans => {
      const updatedPlans = prevPlans.filter(p => p.id !== planId);
      try {
        localStorage.setItem(PLANS_KEY, JSON.stringify(updatedPlans));
      } catch (e) {
        console.error("Failed to save updated plans to localStorage", e);
      }
      return updatedPlans;
    });
    // If deleting the plan currently being viewed on a workout page, would need to redirect.
    // Not an issue from home page.
  };


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Zap className="h-16 w-16 text-primary animate-pulse" />
        <p className="mt-4 text-lg text-muted-foreground">Loading your strength journey...</p>
      </div>
    );
  }

  const activePlans = allPlans.filter(p => !p.isPlanCompleted);
  const completedPlans = allPlans.filter(p => p.isPlanCompleted);

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Welcome to <span className="text-primary">Smolov Strength</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Unleash your potential with the Smolov program. Generate personalized plans and track your progress.
        </p>
      </div>

      {activePlans.length > 0 && (
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-center">Your Active Workout Plans</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activePlans.map(plan => (
              <Card key={plan.id} className="bg-card shadow-lg flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Zap className="mr-2 h-6 w-6 text-primary" />
                    {plan.exercise}
                  </CardTitle>
                  <CardDescription>
                    1RM: {plan.oneRepMax}kg. <br />
                    {plan.currentWorkoutDayIndex < plan.dailyWorkouts.length 
                      ? `Next: ${plan.dailyWorkouts[plan.currentWorkoutDayIndex].label.split(' - ')[0]}` // Show "Week X, Day Y"
                      : "All workouts for this cycle defined."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {/* Progress bar or more details could go here */}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button className="w-full sm:flex-1 bg-accent hover:bg-accent/90" asChild>
                    <Link href={`/workout/${plan.id}`}>
                      Continue Workout <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" className="w-full sm:w-auto" title="Delete Plan">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Plan?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the Smolov plan for {plan.exercise} (1RM: {plan.oneRepMax}kg)? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeletePlan(plan.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
         <Card className="w-full max-w-lg mx-auto shadow-xl border-2 border-dashed border-primary/50 hover:border-primary transition-colors">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center">
              <PlusCircle className="mr-2 h-7 w-7 text-primary" />
              Create a New Smolov Cycle
            </CardTitle>
            <CardDescription>
              {activePlans.length > 0 ? "Ready for another challenge? Add a new plan." : "Get started by setting up your first Smolov cycle."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlanSetupForm onPlanCreated={handlePlanCreated} />
          </CardContent>
        </Card>
      </section>
      
      {completedPlans.length > 0 && (
        <section className="mt-10">
          <h2 className="text-3xl font-semibold mb-6 text-center">Completed Cycles</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedPlans.map(plan => (
              <Card key={plan.id} className="bg-card/80 shadow-md opacity-75">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
                    {plan.exercise} - Completed
                  </CardTitle>
                  <CardDescription>
                    Original 1RM: {plan.oneRepMax}kg.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Congratulations on finishing this cycle!</p>
                </CardContent>
                 <CardFooter className="pt-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full" title="Delete This Completed Plan">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Record
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Completed Plan Record?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the record for the completed Smolov plan: {plan.exercise} (1RM: {plan.oneRepMax}kg)?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeletePlan(plan.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete Record
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
      
      {allPlans.length > 0 && (
        <div className="text-center mt-12">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="bg-red-700 hover:bg-red-800">
                <Trash2 className="mr-2 h-4 w-4" /> Clear All Plans & Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete all your workout plans (active and completed). 
                  Associated workout logs will remain for now but might become orphaned. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAllPlans} className="bg-destructive hover:bg-destructive/90">Yes, delete all</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <div className="mt-12 w-full max-w-3xl mx-auto p-6 bg-card rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center text-foreground">Why Smolov?</h2>
        <div className="md:flex md:items-center md:space-x-6">
          <div className="md:w-1/2 mb-4 md:mb-0">
            {aiBackground ? (
               <Image 
                src={aiBackground}
                alt="AI-generated comic style workout background"
                width={600}
                height={400}
                className="rounded-lg shadow-sm object-cover w-full h-full"
              />
            ) : (
              <Image 
                src="https://picsum.photos/600/400"
                alt="Person lifting weights"
                width={600}
                height={400}
                className="rounded-lg shadow-sm"
                data-ai-hint="strength training"
              />
            )}
          </div>
          <div className="md:w-1/2 space-y-3 text-muted-foreground">
            <p>The Smolov program is a high-volume, high-intensity Russian squat routine, famously adapted for other lifts like the bench press. It's designed for significant strength gains over a relatively short period.</p>
            <p><strong>Key characteristics:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Intense and demanding</li>
              <li>Structured progression</li>
              <li>Focus on compound movements</li>
              <li>Requires dedication and proper recovery</li>
            </ul>
            <p className="font-semibold text-foreground">This app helps you manage Week 1 of the Base Mesocycle.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
