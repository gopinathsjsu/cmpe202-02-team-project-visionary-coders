// This file is machine-generated - do not edit!
'use server';
/**
 * @fileOverview Provides an AI-powered tool that suggests a product category based on an uploaded image.
 *
 * - suggestCategoryFromImage - An async function that takes an image data URI as input and returns a suggested category.
 * - SuggestCategoryFromImageInput - The input type for suggestCategoryFromImage, which is a data URI string.
 * - SuggestCategoryFromImageOutput - The output type for suggestCategoryFromImage, which is a string representing the suggested category.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCategoryFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestCategoryFromImageInput = z.infer<
  typeof SuggestCategoryFromImageInputSchema
>;

const SuggestCategoryFromImageOutputSchema = z.object({
  suggestedCategory: z
    .string()
    .describe('The AI-suggested category for the item in the image.'),
});
export type SuggestCategoryFromImageOutput = z.infer<
  typeof SuggestCategoryFromImageOutputSchema
>;

export async function suggestCategoryFromImage(
  input: SuggestCategoryFromImageInput
): Promise<SuggestCategoryFromImageOutput> {
  return suggestCategoryFromImageFlow(input);
}

const suggestCategoryFromImagePrompt = ai.definePrompt({
  name: 'suggestCategoryFromImagePrompt',
  input: {schema: SuggestCategoryFromImageInputSchema},
  output: {schema: SuggestCategoryFromImageOutputSchema},
  prompt: `You are an expert in product categorization for online marketplaces.
Based on the image provided, suggest the most appropriate category for the item.
Respond ONLY with the category name. 

Image: {{media url=photoDataUri}}`,
});

const suggestCategoryFromImageFlow = ai.defineFlow(
  {
    name: 'suggestCategoryFromImageFlow',
    inputSchema: SuggestCategoryFromImageInputSchema,
    outputSchema: SuggestCategoryFromImageOutputSchema,
  },
  async input => {
    const {output} = await suggestCategoryFromImagePrompt(input);
    return output!;
  }
);
