'use server';
/**
 * @fileOverview Generates a comic-style background image.
 *
 * - generateComicBackground - A function that generates the image.
 * - GenerateComicBackgroundOutput - The return type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateComicBackgroundOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated comic-style background image as a data URI. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateComicBackgroundOutput = z.infer<typeof GenerateComicBackgroundOutputSchema>;

export async function generateComicBackground(): Promise<GenerateComicBackgroundOutput> {
  return generateComicBackgroundFlow({});
}

const generateComicBackgroundFlow = ai.defineFlow(
  {
    name: 'generateComicBackgroundFlow',
    outputSchema: GenerateComicBackgroundOutputSchema,
  },
  async (_input: unknown) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: 'Generate an epic, vibrant, abstract comic book style background image, suitable for a web page background. Incorporate dynamic comic style illustrations of people performing various strength training exercises like squats, bench presses, and deadlifts. Focus on dynamic lines, bold colors, and energetic patterns. Avoid including any text.',
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        safetySettings: [ 
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH'},
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
        ],
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed or returned no media URL.');
    }

    return { imageDataUri: media.url };
  }
);

