"use client";

import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Not used directly, but FormLabel might use it.
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Card components are used by parent, not directly here unless form itself is wrapped.
// For this component, we only need form elements.
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { ExerciseName, WorkoutPlan } from '@/lib/types';
import { EXERCISES } from '@/lib/types';
import { generateSmolovBaseWeek1Plan } from '@/lib/smolov';
import { Dumbbell } from 'lucide-react'; // Icon is used in parent CardHeader for this form.

const PLANS_KEY = 'smolovStrength_workoutPlans'; // Updated key

const planSetupSchema = z.object({
  exercise: z.enum(EXERCISES, { required_error: "Please select an exercise." }),
  oneRepMax: z.coerce.number().min(1, "1RM must be greater than 0.").max(1000, "1RM seems too high."),
});

type PlanSetupFormValues = z.infer<typeof planSetupSchema>;

interface PlanSetupFormProps {
  onPlanCreated: (plan: WorkoutPlan) => void; // Changed from onPlanStart
}

export function PlanSetupForm({ onPlanCreated }: PlanSetupFormProps) {
  const router = useRouter();
  const form = useForm<PlanSetupFormValues>({
    resolver: zodResolver(planSetupSchema),
    defaultValues: {
      oneRepMax: 60, 
    },
  });

  const onSubmit: SubmitHandler<PlanSetupFormValues> = (data) => {
    const newPlan = generateSmolovBaseWeek1Plan(data.exercise, data.oneRepMax);
    try {
      const storedPlans = localStorage.getItem(PLANS_KEY);
      const existingPlans: WorkoutPlan[] = storedPlans ? JSON.parse(storedPlans) : [];
      // Note: onPlanCreated will update the state in HomePage, which then triggers localStorage save.
      // Or, this component directly modifies localStorage too. Let's make it direct for robustness.
      const updatedPlans = [...existingPlans, newPlan];
      localStorage.setItem(PLANS_KEY, JSON.stringify(updatedPlans));
      
      onPlanCreated(newPlan); // Notify parent (HomePage) to update its state
      router.push(`/workout/${newPlan.id}`); // Navigate to the new plan's specific workout page
    } catch (error) {
      console.error("Failed to save plan to localStorage", error);
      form.setError("root", { message: "Could not save plan. Please try again."});
    }
  };

  // The Card wrapper is now handled by HomePage for better layout control.
  // This component now only returns the form itself.
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="exercise"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exercise</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an exercise" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EXERCISES.map((ex) => (
                    <SelectItem key={ex} value={ex}>{ex}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="oneRepMax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Rep Max (1RM) in kg</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
            <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
        )}
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Generating..." : "Generate & Start Cycle"}
        </Button>
      </form>
    </Form>
  );
}
