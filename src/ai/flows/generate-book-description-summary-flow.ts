'use server';
/**
 * @fileOverview A Genkit flow to automatically generate engaging and professional book descriptions and summaries.
 *
 * - generateBookDescriptionSummary - A function that handles the book description and summary generation process.
 * - GenerateBookDescriptionSummaryInput - The input type for the generateBookDescriptionSummary function.
 * - GenerateBookDescriptionSummaryOutput - The return type for the generateBookDescriptionSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBookDescriptionSummaryInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  author: z.string().describe('The author of the book.'),
  genre: z.string().describe('The genre of the book.'),
});
export type GenerateBookDescriptionSummaryInput = z.infer<
  typeof GenerateBookDescriptionSummaryInputSchema
>;

const GenerateBookDescriptionSummaryOutputSchema = z.object({
  description: z
    .string()
    .describe('A professional and engaging description of the book.'),
  summary: z.string().describe('A concise summary of the book.'),
});
export type GenerateBookDescriptionSummaryOutput = z.infer<
  typeof GenerateBookDescriptionSummaryOutputSchema
>;

export async function generateBookDescriptionSummary(
  input: GenerateBookDescriptionSummaryInput
): Promise<GenerateBookDescriptionSummaryOutput> {
  return generateBookDescriptionSummaryFlow(input);
}

const generateBookDescriptionSummaryPrompt = ai.definePrompt({
  name: 'generateBookDescriptionSummaryPrompt',
  input: {schema: GenerateBookDescriptionSummaryInputSchema},
  output: {schema: GenerateBookDescriptionSummaryOutputSchema},
  prompt: `You are an expert literary critic and marketing specialist.

Your task is to generate a professional, engaging book description and a concise summary based on the provided title, author, and genre.

The description should be compelling, highlight key aspects of the book, and entice potential readers. It should be suitable for a book's back cover or online retail page.
The summary should be brief, factual, and capture the essence of the story without giving away major spoilers.

Book Details:
Title: {{{title}}}
Author: {{{author}}}
Genre: {{{genre}}}

---

Please provide the description and summary in JSON format.`,
});

const generateBookDescriptionSummaryFlow = ai.defineFlow(
  {
    name: 'generateBookDescriptionSummaryFlow',
    inputSchema: GenerateBookDescriptionSummaryInputSchema,
    outputSchema: GenerateBookDescriptionSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateBookDescriptionSummaryPrompt(input);
    return output!;
  }
);
