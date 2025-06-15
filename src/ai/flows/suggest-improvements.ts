// This file uses server-side code.
'use server';

/**
 * @fileOverview AI-powered TypeScript code improvement suggestions.
 *
 * - suggestTypescriptImprovements - A function that suggests improvements to the provided TypeScript code.
 * - SuggestTypescriptImprovementsInput - The input type for the suggestTypescriptImprovements function.
 * - SuggestTypescriptImprovementsOutput - The return type for the suggestTypescriptImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTypescriptImprovementsInputSchema = z.object({
  typescriptCode: z
    .string()
    .describe('The TypeScript code to analyze and suggest improvements for.'),
});
export type SuggestTypescriptImprovementsInput = z.infer<
  typeof SuggestTypescriptImprovementsInputSchema
>;

const SuggestTypescriptImprovementsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A list of suggestions for improving the provided TypeScript code, based on best practices.'
    ),
});
export type SuggestTypescriptImprovementsOutput = z.infer<
  typeof SuggestTypescriptImprovementsOutputSchema
>;

export async function suggestTypescriptImprovements(
  input: SuggestTypescriptImprovementsInput
): Promise<SuggestTypescriptImprovementsOutput> {
  return suggestTypescriptImprovementsFlow(input);
}

const suggestTypescriptImprovementsPrompt = ai.definePrompt({
  name: 'suggestTypescriptImprovementsPrompt',
  input: {schema: SuggestTypescriptImprovementsInputSchema},
  output: {schema: SuggestTypescriptImprovementsOutputSchema},
  prompt: `You are an AI expert in TypeScript code quality and best practices.

  Analyze the following TypeScript code and provide a list of suggestions for improvement. Focus on code clarity, maintainability, and performance.

  Typescript Code:
  {{typescriptCode}}`,
});

const suggestTypescriptImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestTypescriptImprovementsFlow',
    inputSchema: SuggestTypescriptImprovementsInputSchema,
    outputSchema: SuggestTypescriptImprovementsOutputSchema,
  },
  async input => {
    const {output} = await suggestTypescriptImprovementsPrompt(input);
    return output!;
  }
);
