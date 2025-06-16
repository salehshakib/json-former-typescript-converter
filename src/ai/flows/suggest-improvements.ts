// This file uses server-side code.
'use server';

/**
 * @fileOverview AI-powered TypeScript code improvement suggestions.
 *
 * - suggestTypescriptImprovements - A function that suggests improvements to the provided TypeScript code.
 * - SuggestTypescriptImprovementsInput - The input type for the suggestTypescriptImprovements function.
 * - SuggestTypescriptImprovementsOutput - The return type for the suggestTypescriptImprovements function.
 * - SuggestionItem - The type for an individual suggestion item.
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

const SuggestionItemSchema = z.object({
  description: z.string().describe("Explanation of the suggestion in Markdown. This text will be displayed to the user."),
  suggestedCode: z.string().optional().describe("The complete, new TypeScript code block that should replace the entire current TypeScript output if this suggestion is applied. Omit if the suggestion is purely informational or cannot be automatically applied as a full replacement."),
  isApplicable: z.boolean().describe("True if 'suggestedCode' is provided and represents a complete, applicable code change. False otherwise."),
});
export type SuggestionItem = z.infer<typeof SuggestionItemSchema>;

const SuggestTypescriptImprovementsOutputSchema = z.object({
  suggestions: z.array(SuggestionItemSchema).describe("A list of improvement suggestions. Each suggestion includes a description and, if applicable, the complete TypeScript code to apply."),
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

Please provide your suggestions as a JSON array of objects. Each object in the array MUST conform to the following structure:
{
  "description": "string (Markdown formatted explanation of the suggestion)",
  "suggestedCode": "string (optional: if the suggestion provides a direct code replacement, this field MUST contain THE ENTIRE, NEW, VALID TYPESCRIPT CODE that should replace the user's current TypeScript output. If the suggestion is purely informational, or if a full code replacement is not appropriate, omit this field or set it to null.)",
  "isApplicable": "boolean (Set to true if 'suggestedCode' is provided and represents a complete, applicable code change. Otherwise, set to false.)"
}

IMPORTANT:
- If a suggestion involves code changes (e.g., consolidating types, renaming types, changing type specificity for multiple fields), the 'suggestedCode' field MUST contain the *entire updated TypeScript code definition block*. Do not provide partial snippets or diffs. The content of 'suggestedCode' will directly replace the existing TypeScript output.
- If a suggestion is purely informational (e.g., "Consider adding JSDoc comments for clarity"), 'suggestedCode' should be omitted (or null) and 'isApplicable' should be false.
- Ensure the JSON is well-formed and the output is ONLY the JSON array.

Focus on these areas for suggestions:
1.  **Consolidating Redundant Types/Interfaces:**
    *   Identify if multiple types or interfaces are structurally identical.
    *   If so, recommend creating a single, common type/interface and updating referencing types.
    *   The 'description' should explain this, and 'suggestedCode' should contain the *complete new TypeScript code* with the consolidated type and updated root type. 'isApplicable' should be true.

2.  **Improving Type Specificity:**
    *   For string fields that represent a fixed set of values (e.g., "VERIFIED", "ACTIVE"), suggest string literal unions.
    *   For string fields that represent dates, suggest using \`string \/* Date ISO 8601 *\/ \` or \`Date\` (with caution for JSON).
    *   If these changes can be applied to the entire code block, provide the full 'suggestedCode' and set 'isApplicable' to true. Otherwise, make it informational.

3.  **Naming Conventions:**
    *   Ensure type/interface names use PascalCase. If 'suggestedCode' is provided, it should reflect corrected names.

4.  **Clarity and Readability:**
    *   Any other suggestions. If these are informational, 'isApplicable' should be false.

Example of how to suggest consolidation for the following TypeScript:
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
  id: string;
  name: string;
  userCurrency: TUserCurrency;
  baseCurrency: TBaseCurrency;
  isActive: boolean;
}
\`\`\`
Your JSON output for this specific suggestion should be part of the array, like this:
{
  "description": "The types \`TUserCurrency\` and \`TBaseCurrency\` are structurally identical. Consider creating a common type, for example \`CurrencyInfo\`, and using it for both. This improves reusability and maintainability.",
  "suggestedCode": "type CurrencyInfo = {\\n  currencyId: number;\\n  fullName: string;\\n  shortName: string;\\n  symbol: string;\\n}\\n\\ntype TRootObject = {\\n  id: string;\\n  name: string;\\n  userCurrency: CurrencyInfo;\\n  baseCurrency: CurrencyInfo;\\n  isActive: boolean;\\n}",
  "isApplicable": true
}

Provide ALL suggestions in a single JSON array. If no improvements are found, return an empty array [].
`,
});

const suggestTypescriptImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestTypescriptImprovementsFlow',
    inputSchema: SuggestTypescriptImprovementsInputSchema,
    outputSchema: SuggestTypescriptImprovementsOutputSchema,
  },
  async input => {
    const {output, usage} = await suggestTypescriptImprovementsPrompt(input);
    if (!output) {
        return {suggestions: [{ description: "No suggestions available at the moment or an error occurred in parsing the AI response.", suggestedCode: undefined, isApplicable: false }] };
    }
    // The output from the prompt should already be parsed by Genkit into the SuggestTypescriptImprovementsOutputSchema.
    // If output is not an object with a suggestions array, or if parsing failed, Genkit would have thrown an error or output would be null.
    // So, we can generally trust the structure here if output is not null.
    // However, a simple check for the array is still good.
    if (!output.suggestions || !Array.isArray(output.suggestions)) {
       return {suggestions: [{ description: "AI returned an unexpected format for suggestions. Expected an array.", suggestedCode: undefined, isApplicable: false}] };
    }
    if (output.suggestions.length === 0) {
        return {suggestions: [{ description: "No specific improvements suggested by the AI based on the criteria.", suggestedCode: undefined, isApplicable: false}] };
    }
    return output;
  }
);
