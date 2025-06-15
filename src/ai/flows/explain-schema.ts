'use server';

/**
 * @fileOverview Explains the schema implied by the JSON entered by the user.
 *
 * - explainJsonSchema - A function that explains the JSON schema.
 * - ExplainJsonSchemaInput - The input type for the explainJsonSchema function.
 * - ExplainJsonSchemaOutput - The return type for the explainJsonSchema function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainJsonSchemaInputSchema = z.object({
  jsonInput: z.string().describe('The JSON input provided by the user.'),
});
export type ExplainJsonSchemaInput = z.infer<typeof ExplainJsonSchemaInputSchema>;

const ExplainJsonSchemaOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the JSON schema.'),
});
export type ExplainJsonSchemaOutput = z.infer<typeof ExplainJsonSchemaOutputSchema>;

export async function explainJsonSchema(input: ExplainJsonSchemaInput): Promise<ExplainJsonSchemaOutput> {
  return explainJsonSchemaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainJsonSchemaPrompt',
  input: {schema: ExplainJsonSchemaInputSchema},
  output: {schema: ExplainJsonSchemaOutputSchema},
  prompt: `You are an expert at explaining JSON schemas.  Given the following JSON input, explain the schema that it represents. Be detailed and explain the types of the fields.

JSON Input:
{{{jsonInput}}}`, 
});

const explainJsonSchemaFlow = ai.defineFlow(
  {
    name: 'explainJsonSchemaFlow',
    inputSchema: ExplainJsonSchemaInputSchema,
    outputSchema: ExplainJsonSchemaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
