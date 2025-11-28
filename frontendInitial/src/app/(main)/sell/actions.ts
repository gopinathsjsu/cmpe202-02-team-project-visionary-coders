'use server';

import { suggestCategoryFromImage } from '@/ai/flows/suggest-category-from-image';
import { suggestPrice } from '@/ai/flows/suggest-price';

export async function getCategorySuggestion(photoDataUri: string) {
  if (!photoDataUri) {
    return { error: 'No image data provided.' };
  }
  try {
    const result = await suggestCategoryFromImage({ photoDataUri });
    return { category: result.suggestedCategory };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to suggest a category. Please try again.' };
  }
}

export async function getPriceSuggestion(
  photoDataUri: string,
  description: string
) {
  if (!photoDataUri || !description) {
    return { error: 'Image and description are required.' };
  }
  try {
    const result = await suggestPrice({ photoDataUri, description });
    return {
      price: result.suggestedPrice,
      reasoning: result.reasoning,
    };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to suggest a price. Please try again.' };
  }
}
