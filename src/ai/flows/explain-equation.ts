// src/ai/flows/explain-equation.ts
'use server';
/**
 * @fileOverview A flow to explain a mathematical equation step by step.
 *
 * - explainEquation - A function that takes a mathematical equation as input and returns a step-by-step explanation of its solution.
 * - ExplainEquationInput - The input type for the explainEquation function.
 * - ExplainEquationOutput - The return type for the explainEquation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainEquationInputSchema = z.object({
  equation: z.string().describe('The mathematical equation to be explained.'),
});
export type ExplainEquationInput = z.infer<typeof ExplainEquationInputSchema>;

const ExplainEquationOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A step-by-step explanation of the solution to the equation.'),
});
export type ExplainEquationOutput = z.infer<typeof ExplainEquationOutputSchema>;

export async function explainEquation(input: ExplainEquationInput): Promise<ExplainEquationOutput> {
  return explainEquationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainEquationPrompt',
  input: {schema: ExplainEquationInputSchema},
  output: {schema: ExplainEquationOutputSchema},
  prompt: `You are an expert math teacher who explains mathematical equations step by step.

  Equation: {{{equation}}}
  Explanation:`, // Keep it simple; Genkit output schemas are used to guide the output format
});

const explainEquationFlow = ai.defineFlow(
  {
    name: 'explainEquationFlow',
    inputSchema: ExplainEquationInputSchema,
    outputSchema: ExplainEquationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
