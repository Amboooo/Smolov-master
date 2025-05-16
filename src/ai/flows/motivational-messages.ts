// 'use server'

'use server';
/**
 * @fileOverview Generates motivational messages based on workout progress.
 *
 * - generateMotivationalMessage - A function that generates a motivational message.
 * - MotivationalMessageInput - The input type for the generateMotivationalMessage function.
 * - MotivationalMessageOutput - The return type for the generateMotivationalMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationalMessageInputSchema = z.object({
  exercise: z.string().describe('The exercise being performed (e.g., Bench Press, Squat, Deadlift).'),
  weight: z.number().describe('The weight being lifted in kilograms.'),
  reps: z.number().describe('The number of repetitions performed.'),
  setsCompleted: z.number().describe('The number of sets completed.'),
  totalSets: z.number().describe('The total number of sets in the workout.'),
});
export type MotivationalMessageInput = z.infer<typeof MotivationalMessageInputSchema>;

const MotivationalMessageOutputSchema = z.object({
  message: z.string().describe('A motivational message to encourage the user.'),
});
export type MotivationalMessageOutput = z.infer<typeof MotivationalMessageOutputSchema>;

export async function generateMotivationalMessage(input: MotivationalMessageInput): Promise<MotivationalMessageOutput> {
  return motivationalMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationalMessagePrompt',
  input: {schema: MotivationalMessageInputSchema},
  output: {schema: MotivationalMessageOutputSchema},
  prompt: `You are a motivational workout coach. Encourage the user to complete their workout.

  Exercise: {{{exercise}}}
  Weight: {{{weight}}} kg
  Reps: {{{reps}}}
  Sets Completed: {{{setsCompleted}}}
  Total Sets: {{{totalSets}}}

  Generate a short, encouraging message to help them push through the remaining sets.`,
});

const motivationalMessageFlow = ai.defineFlow(
  {
    name: 'motivationalMessageFlow',
    inputSchema: MotivationalMessageInputSchema,
    outputSchema: MotivationalMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
