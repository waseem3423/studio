'use server';

/**
 * @fileOverview A flow that summarizes daily data using the Deeeseek API and returns a personalized feedback message.
 *
 * - summarizeDailyData - A function that summarizes the daily data.
 * - SummarizeDailyDataInput - The input type for the summarizeDailyData function.
 * - SummarizeDailyDataOutput - The return type for the summarizeDailyData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDailyDataInputSchema = z.object({
  workHours: z.number().describe('Total working hours for the day.'),
  taskList: z.string().describe('A list of tasks completed during the day.'),
  expenses: z.number().describe('Total expenses for the day.'),
  prayers: z.string().describe('A summary of prayers completed during the day.'),
});
export type SummarizeDailyDataInput = z.infer<typeof SummarizeDailyDataInputSchema>;

const SummarizeDailyDataOutputSchema = z.object({
  feedbackMessage: z.string().describe('A personalized feedback message based on the daily data in Roman Urdu.'),
});
export type SummarizeDailyDataOutput = z.infer<typeof SummarizeDailyDataOutputSchema>;

export async function summarizeDailyData(input: SummarizeDailyDataInput): Promise<SummarizeDailyDataOutput> {
  return summarizeDailyDataFlow(input);
}

const summarizeDailyDataPrompt = ai.definePrompt({
  name: 'summarizeDailyDataPrompt',
  input: {schema: SummarizeDailyDataInputSchema},
  output: {schema: SummarizeDailyDataOutputSchema},
  prompt: `Aap ek digital assistant hain jo user ke daily data ke upar Roman Urdu mein personal feedback dete hain.

  User ke din ka summary yeh hai:
  - Kaam ke ghante: {{workHours}} ghante
  - Mukammal tasks: {{taskList}}
  - Akhrajaat: {{expenses}}
  - Namazein: {{prayers}}

  Is data ke buniyad par, user ko ek mukhtasar aur motivational feedback message dein, kamyabi ke shobon ko ujagar karein aur behtari ke liye tajaveez dein. Jawab hamesha Roman Urdu mein hona chahiye.`,
});

const summarizeDailyDataFlow = ai.defineFlow(
  {
    name: 'summarizeDailyDataFlow',
    inputSchema: SummarizeDailyDataInputSchema,
    outputSchema: SummarizeDailyDataOutputSchema,
  },
  async input => {
    const {output} = await summarizeDailyDataPrompt(input);
    return output!;
  }
);
