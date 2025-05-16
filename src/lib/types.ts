export type ExerciseName = "Bench Press" | "Squat" | "Deadlift";

export const EXERCISES: ExerciseName[] = ["Bench Press", "Squat", "Deadlift"];

export interface SetProgress {
  targetReps: number;
  targetWeight: number;
  completedReps: number | null;
  isCompleted: boolean;
}

export interface DailyWorkout {
  id: string; // e.g., "smolov-base-w1-d1-squat"
  label: string; // e.g., "Week 1, Day 1 - Squat"
  exercise: ExerciseName;
  sets: number; // Total number of working sets
  reps: number; // Target reps per set
  percentage1RM: number;
  calculatedWeight: number;
  currentSetIndex: number; // Index of the set currently being performed or next up (0 to sets-1)
  setsProgress: SetProgress[];
  isCompleted: boolean;
}

export interface WorkoutPlan {
  id: string; // Unique identifier for the plan
  exercise: ExerciseName;
  oneRepMax: number;
  dailyWorkouts: DailyWorkout[]; // Array of 4 workouts for the first Smolov week
  currentWorkoutDayIndex: number; // Index of the current DailyWorkout in dailyWorkouts array
  isPlanCompleted: boolean;
}

export interface CompletedSetLog {
  targetReps: number;
  targetWeight: number;
  actualReps: number;
  actualWeight: number;
}

export interface WorkoutLogEntry {
  id: string; // unique id, e.g., ISO date string of completion
  dateCompleted: string; // ISO string for completion date
  dailyWorkoutId: string; // references DailyWorkout.id
  exercise: ExerciseName;
  oneRepMaxAtStart: number;
  label: string; // From DailyWorkout.label
  completedSets: CompletedSetLog[];
  notes?: string;
  motivationalMessage?: string;
}
