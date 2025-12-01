// This file uses server-side code.
'use server';

/**
 * @fileOverview This file contains the Genkit flow for suggesting a price for an item based on its image and description.
 *
 * - suggestPrice - An async function that takes an image and description of an item and suggests a price.
 * - SuggestPriceInput - The input type for the suggestPrice function.
 * - SuggestPriceOutput - The return type for the suggestPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPriceInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('A detailed description of the item.'),
});
export type SuggestPriceInput = z.infer<typeof SuggestPriceInputSchema>;

const SuggestPriceOutputSchema = z.object({
  suggestedPrice: z
    .number()
    .describe('The suggested price for the item in US dollars.'),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the suggested price, including factors considered.'
    ),
});
export type SuggestPriceOutput = z.infer<typeof SuggestPriceOutputSchema>;

export async function suggestPrice(input: SuggestPriceInput): Promise<SuggestPriceOutput> {
  return suggestPriceFlow(input);
}

const suggestPricePrompt = ai.definePrompt({
  name: 'suggestPricePrompt',
  input: {schema: SuggestPriceInputSchema},
  output: {schema: SuggestPriceOutputSchema},
  prompt: `You are an expert in pricing items for online marketplaces.

  Based on the following description and photo of the item, suggest a reasonable price in US dollars. Provide a brief explanation of your reasoning, considering factors like condition, rarity, and market demand.

  Description: {{{description}}}
  Photo: {{media url=photoDataUri}}

  Ensure the suggestedPrice field contains only a number (without the dollar sign).
  `,
});

const suggestPriceFlow = ai.defineFlow(
  {
    name: 'suggestPriceFlow',
    inputSchema: SuggestPriceInputSchema,
    outputSchema: SuggestPriceOutputSchema,
  },
  async input => {
    const {output} = await suggestPricePrompt(input);
    return output!;
  }
);

