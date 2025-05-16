"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import type { DailyWorkout, SetProgress, WorkoutPlan, WorkoutLogEntry, CompletedSetLog } from '@/lib/types';
import { MotivationalAICard } from './MotivationalAICard';
import { Check, ChevronsRight, Loader2, PartyPopper, Repeat, Zap } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const WORKOUT_PLAN_KEY = 'smolovStrength_activePlan';
const WORKOUT_LOGS_KEY = 'smolovStrength_workoutLogs';

interface WorkoutDisplayCardProps {
  initialPlan: WorkoutPlan;
  onPlanUpdate: (updatedPlan: WorkoutPlan) => void;
  onWorkoutComplete: (logEntry: WorkoutLogEntry, updatedPlan: WorkoutPlan) => void;
}

export function WorkoutDisplayCard({ initialPlan, onPlanUpdate, onWorkoutComplete }: WorkoutDisplayCardProps) {
  const [currentWorkout, setCurrentWorkout] = useState<DailyWorkout>(initialPlan.dailyWorkouts[initialPlan.currentWorkoutDayIndex]);
  const [currentSetUserReps, setCurrentSetUserReps] = useState<string>("");
  const [isLoggingSet, setIsLoggingSet] = useState(false);
  const [isCompletingWorkout, setIsCompletingWorkout] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Ensure currentWorkout reflects the latest from initialPlan if it changes (e.g. parent component reloads)
    const activeDailyWorkout = initialPlan.dailyWorkouts[initialPlan.currentWorkoutDayIndex];
    if (activeDailyWorkout && activeDailyWorkout.id !== currentWorkout?.id) {
      setCurrentWorkout(activeDailyWorkout);
      setCurrentSetUserReps(""); // Reset reps input for new workout day
    } else if (activeDailyWorkout) {
      // If same workout day, but progress might have updated from localStorage persistence, re-sync
       setCurrentWorkout(activeDailyWorkout);
    }
  }, [initialPlan, currentWorkout?.id]);


  const handleLogSet = () => {
    if (!currentWorkout || currentWorkout.currentSetIndex >= currentWorkout.sets) return;
    
    const repsCompleted = parseInt(currentSetUserReps, 10);
    if (isNaN(repsCompleted) || repsCompleted < 0) {
      toast({ title: "Invalid Reps", description: "Please enter a valid number of reps.", variant: "destructive" });
      return;
    }

    setIsLoggingSet(true);

    const updatedSetsProgress = [...currentWorkout.setsProgress];
    updatedSetsProgress[currentWorkout.currentSetIndex] = {
      ...updatedSetsProgress[currentWorkout.currentSetIndex],
      completedReps: repsCompleted,
      isCompleted: true,
    };

    const updatedDailyWorkout: DailyWorkout = {
      ...currentWorkout,
      setsProgress: updatedSetsProgress,
      currentSetIndex: currentWorkout.currentSetIndex + 1,
    };

    const updatedPlan: WorkoutPlan = {
      ...initialPlan,
      dailyWorkouts: initialPlan.dailyWorkouts.map(dw =>
        dw.id === updatedDailyWorkout.id ? updatedDailyWorkout : dw
      ),
    };
    
    setCurrentWorkout(updatedDailyWorkout); // Update local state immediately for UI responsiveness
    onPlanUpdate(updatedPlan); // Persist through parent
    setCurrentSetUserReps(""); // Reset for next set
    setIsLoggingSet(false);
    toast({ title: "Set Logged!", description: `Set ${currentWorkout.currentSetIndex + 1} recorded. Keep it up!`, className: "bg-green-500 text-white" });
  };

  const handleCompleteWorkout = () => {
    if (!currentWorkout) return;
    setIsCompletingWorkout(true);

    const completedSetsLog: CompletedSetLog[] = currentWorkout.setsProgress
      .filter(sp => sp.isCompleted && sp.completedReps !== null)
      .map(sp => ({
        targetReps: sp.targetReps,
        targetWeight: sp.targetWeight,
        actualReps: sp.completedReps!,
        actualWeight: sp.targetWeight, // Assuming weight isn't changed by user for now
      }));

    if (completedSetsLog.length !== currentWorkout.sets) {
      toast({ title: "Incomplete Workout", description: "Please log all sets before completing the workout.", variant: "destructive" });
      setIsCompletingWorkout(false);
      return;
    }
    
    const logEntry: WorkoutLogEntry = {
      id: new Date().toISOString(),
      dateCompleted: new Date().toISOString(),
      dailyWorkoutId: currentWorkout.id,
      exercise: currentWorkout.exercise,
      oneRepMaxAtStart: initialPlan.oneRepMax,
      label: currentWorkout.label,
      completedSets: completedSetsLog,
    };

    const finalUpdatedDailyWorkout: DailyWorkout = { ...currentWorkout, isCompleted: true };
    
    const nextWorkoutDayIndex = initialPlan.currentWorkoutDayIndex + 1;
    const isPlanNowCompleted = nextWorkoutDayIndex >= initialPlan.dailyWorkouts.length;

    const updatedPlan: WorkoutPlan = {
      ...initialPlan,
      dailyWorkouts: initialPlan.dailyWorkouts.map(dw =>
        dw.id === finalUpdatedDailyWorkout.id ? finalUpdatedDailyWorkout : dw
      ),
      currentWorkoutDayIndex: isPlanNowCompleted ? initialPlan.currentWorkoutDayIndex : nextWorkoutDayIndex, // Stay on last if plan complete
      isPlanCompleted: isPlanNowCompleted,
    };
    
    onWorkoutComplete(logEntry, updatedPlan); // Persist log and plan update

    toast({
      title: "Workout Completed!",
      description: `${currentWorkout.label} successfully logged. Great job!`,
      className: "bg-primary text-primary-foreground",
      duration: 5000,
    });
    
    setIsCompletingWorkout(false);
    // Parent component will handle navigation or state change for next workout/plan completion
  };
  
  const resetCurrentWorkoutProgress = () => {
    if (!currentWorkout) return;
    const resetSetsProgress: SetProgress[] = currentWorkout.setsProgress.map(sp => ({
      ...sp,
      completedReps: null,
      isCompleted: false,
    }));
    const resetDailyWorkout: DailyWorkout = {
      ...currentWorkout,
      setsProgress: resetSetsProgress,
      currentSetIndex: 0,
    };
     const updatedPlan: WorkoutPlan = {
      ...initialPlan,
      dailyWorkouts: initialPlan.dailyWorkouts.map(dw =>
        dw.id === resetDailyWorkout.id ? resetDailyWorkout : dw
      ),
    };
    setCurrentWorkout(resetDailyWorkout);
    onPlanUpdate(updatedPlan);
    toast({ title: "Workout Reset", description: "Progress for the current day has been reset."});
  };


  if (!currentWorkout) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>No Workout Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Could not load workout data. Please try starting a new plan.</p>
        </CardContent>
      </Card>
    );
  }

  const isCurrentDayCompleted = currentWorkout.isCompleted;
  const allSetsLoggedForDay = currentWorkout.currentSetIndex >= currentWorkout.sets;
  const progressPercentage = (currentWorkout.currentSetIndex / currentWorkout.sets) * 100;
  
  const activeSet = !isCurrentDayCompleted && !allSetsLoggedForDay ? currentWorkout.setsProgress[currentWorkout.currentSetIndex] : null;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl md:text-3xl text-primary flex items-center">
            <Zap className="mr-2 h-7 w-7" /> {currentWorkout.label}
          </CardTitle>
           {!isCurrentDayCompleted && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" title="Reset current day's progress">
                  <Repeat className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Workout Progress?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear all logged sets for today's workout ({currentWorkout.label}). This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={resetCurrentWorkoutProgress} className="bg-destructive hover:bg-destructive/90">Reset</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <CardDescription className="text-lg">
          Target: {currentWorkout.sets} sets of {currentWorkout.reps} reps @ {currentWorkout.calculatedWeight}kg
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={progressPercentage} className="w-full [&>div]:bg-accent" />
        
        {isCurrentDayCompleted ? (
          <div className="text-center py-8 space-y-3">
            <PartyPopper className="h-16 w-16 text-green-500 mx-auto animate-bounce" />
            <p className="text-2xl font-semibold text-green-600">This workout is completed!</p>
            <p className="text-muted-foreground">Ready for the next challenge?</p>
          </div>
        ) : allSetsLoggedForDay ? (
          <div className="text-center py-6">
            <p className="text-xl font-medium text-foreground mb-4">All sets logged for today!</p>
            <Button 
              onClick={handleCompleteWorkout} 
              disabled={isCompletingWorkout}
              className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white text-lg py-3 px-6"
            >
              {isCompletingWorkout ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
              Complete Workout Day
            </Button>
          </div>
        ) : activeSet ? (
          <div className="space-y-4 p-4 border rounded-lg shadow-sm bg-background">
            <h3 className="text-xl font-semibold text-center text-foreground">
              Current Set: <span className="text-accent">{currentWorkout.currentSetIndex + 1}</span> / {currentWorkout.sets}
            </h3>
            <div className="text-center text-lg text-muted-foreground">
              Target: {activeSet.targetReps} reps @ {activeSet.targetWeight}kg
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <div className="flex-grow">
                <Label htmlFor="repsCompleted" className="sr-only">Reps Completed</Label>
                <Input
                  id="repsCompleted"
                  type="number"
                  placeholder={`Enter reps (target: ${activeSet.targetReps})`}
                  value={currentSetUserReps}
                  onChange={(e) => setCurrentSetUserReps(e.target.value)}
                  className="text-center text-lg h-12"
                  min="0"
                />
              </div>
              <Button 
                onClick={handleLogSet} 
                disabled={isLoggingSet}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-md py-3 px-5 h-12"
              >
                {isLoggingSet ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChevronsRight className="mr-2 h-4 w-4" />}
                Log Set
              </Button>
            </div>
            <MotivationalAICard 
              workoutContext={{ 
                exercise: currentWorkout.exercise, 
                weight: activeSet.targetWeight, 
                reps: activeSet.targetReps,
                currentSetIdx: currentWorkout.currentSetIndex,
                totalSetsForDay: currentWorkout.sets
              }} 
            />
          </div>
        ) : null}

        <div className="space-y-2 mt-4">
          <h4 className="text-md font-semibold text-muted-foreground">Set Overview:</h4>
          {currentWorkout.setsProgress.map((set, index) => (
            <div key={index} className={`p-3 rounded-md flex justify-between items-center text-sm
              ${set.isCompleted ? 'bg-green-100 dark:bg-green-900 border-l-4 border-green-500' : 'bg-muted/50 dark:bg-muted/30'}
              ${index === currentWorkout.currentSetIndex && !allSetsLoggedForDay && !isCurrentDayCompleted ? 'ring-2 ring-accent shadow-md' : ''}
            `}>
              <span>Set {index + 1}: {set.targetReps} reps @ {set.targetWeight}kg</span>
              {set.isCompleted ? (
                <span className="font-semibold text-green-700 dark:text-green-400">Done: {set.completedReps} reps</span>
              ) : (
                <span className="text-muted-foreground">Pending</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
