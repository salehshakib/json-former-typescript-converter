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
  jsonInput: z.string().optional().describe('The original JSON input, for context.'),
});
export type SuggestTypescriptImprovementsInput = z.infer<
  typeof SuggestTypescriptImprovementsInputSchema
>;

const SuggestTypescriptImprovementsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A list of suggestions for improving the provided TypeScript code, based on best practices. Formatted in Markdown.'
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
  prompt: `You are an AI expert specializing in TypeScript code analysis and optimization.
Your task is to analyze the provided TypeScript code, which was generated from a JSON object, and suggest improvements.

Original JSON Input (for context):
\`\`\`json
{{{jsonInput}}}
\`\`\`

Generated TypeScript Code to Analyze:
\`\`\`typescript
{{typescriptCode}}
\`\`\`

Please provide actionable suggestions focusing on:
1.  **Consolidating Redundant Types/Interfaces:**
    *   Identify if multiple types or interfaces are structurally identical (same properties, same property types).
    *   If so, recommend creating a single, common type/interface and updating the referencing types to use it.
    *   Clearly show the original redundant types and the proposed common type, and how the main type would change.
    *   Explain the benefit (e.g., maintainability, reusability).

2.  **Improving Type Specificity:**
    *   For string fields that seem to represent a fixed set of values (e.g., "VERIFIED", "ACTIVE", "PENDING" for a status field), suggest using string literal unions (e.g., \`type KycStatus = "VERIFIED" | "PENDING" | "REJECTED";\`).
    *   For string fields that represent dates (e.g., "2011-01-29"), suggest using \`string \/* Date ISO 8601 *\/ \` or potentially \`Date\` if direct date object usage is implied (though be cautious with \`Date\` for JSON serializability).
    *   For fields like \`gender\`, if it's "male" or "female", suggest a literal union like \`type Gender = "male" | "female" | "other";\`.

3.  **Naming Conventions:**
    *   Ensure type/interface names use PascalCase (e.g., \`UserCurrency\`). If a prefixing convention like \`I\` for interfaces or \`T\` for types is used consistently, that's acceptable, but highlight if it's inconsistent or if simpler PascalCase names would be clearer. The goal is consistency and clarity.

4.  **Clarity and Readability:**
    *   Any other suggestions to make the TypeScript code more idiomatic, readable, and maintainable.

Format your output clearly using Markdown. Use Markdown code blocks for TypeScript examples.
If the provided TypeScript code is already well-structured and follows these best practices, acknowledge that and state that no major improvements are needed based on these criteria.

Example of how to suggest consolidation:
If you see:
\`\`\`typescript
type TUserCurrency = {
  currencyId: number;
  fullName: string;
  shortName: string;
  symbol: string;
}
type TBaseCurrency = {
  currencyId: number;
  fullName: string;
  shortName: string;
  symbol: string;
}
type TRootObject = {
  // ...
  userCurrency: TUserCurrency;
  baseCurrency: TBaseCurrency;
  // ...
}
\`\`\`
Suggest:
"The types \`TUserCurrency\` and \`TBaseCurrency\` are structurally identical. Consider creating a common type, for example \`CurrencyInfo\`, and using it for both:
\`\`\`typescript
type CurrencyInfo = {
  currencyId: number;
  fullName: string;
  shortName: string;
  symbol: string;
}
type TRootObject = {
  // ...
  userCurrency: CurrencyInfo;
  baseCurrency: CurrencyInfo;
  // ...
}
\`\`\`
This improves reusability and maintainability."

Provide suggestions as a coherent Markdown text block.
`,
});

const suggestTypescriptImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestTypescriptImprovementsFlow',
    inputSchema: SuggestTypescriptImprovementsInputSchema,
    outputSchema: SuggestTypescriptImprovementsOutputSchema,
  },
  async input => {
    const {output} = await suggestTypescriptImprovementsPrompt(input);
    if (!output) {
        return {suggestions: "No suggestions available at the moment."}
    }
    return output;
  }
);
