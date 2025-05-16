import type { ExerciseName, DailyWorkout, WorkoutPlan, SetProgress } from './types';

// Rounds to the nearest 2.5 (e.g., for kg plates)
const roundToNearest2point5 = (num: number): number => {
  const rounded = Math.round(num / 2.5) * 2.5;
  return rounded < 2.5 ? 2.5 : rounded; // Ensure weight is at least 2.5 if 1RM is very low
};

// Base Mesocycle, Week 1 configuration
const baseMesoWeek1Config = [
  { day: 1, sets: 4, reps: 9, percentage: 70, label: "Week 1, Day 1" },
  { day: 2, sets: 5, reps: 7, percentage: 75, label: "Week 1, Day 2" },
  { day: 3, sets: 7, reps: 5, percentage: 80, label: "Week 1, Day 3" },
  { day: 4, sets: 10, reps: 3, percentage: 85, label: "Week 1, Day 4" },
];

export function generateSmolovBaseWeek1Plan(exercise: ExerciseName, oneRepMax: number): WorkoutPlan {
  const planId = `plan-${exercise.toLowerCase().replace(/\s+/g, '-')}-${new Date().getTime()}`;

  const dailyWorkouts: DailyWorkout[] = baseMesoWeek1Config.map(config => {
    const calculatedWeight = roundToNearest2point5((config.percentage / 100) * oneRepMax);
    
    const setsProgress: SetProgress[] = Array(config.sets).fill(null).map(() => ({
      targetReps: config.reps,
      targetWeight: calculatedWeight,
      completedReps: null,
      isCompleted: false,
    }));

    return {
      id: `smolov-base-w1-d${config.day}-${exercise.toLowerCase().replace(/\s+/g, '-')}-${new Date().getTime()}`, // Ensure daily workout IDs are also unique across plans
      label: `${config.label} - ${exercise}`,
      exercise,
      sets: config.sets,
      reps: config.reps,
      percentage1RM: config.percentage,
      calculatedWeight,
      currentSetIndex: 0,
      setsProgress,
      isCompleted: false,
    };
  });

  return {
    id: planId,
    exercise,
    oneRepMax,
    dailyWorkouts,
    currentWorkoutDayIndex: 0,
    isPlanCompleted: false,
  };
}
