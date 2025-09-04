'use server';

/**
 * @fileOverview A flow that summarizes weekly or monthly data and provides insights.
 *
 * - summarizePeriodData - A function that summarizes the data for a given period.
 * - SummarizePeriodDataInput - The input type for the summarizePeriodData function.
 * - SummarizePeriodDataOutput - The return type for the summarizePeriodData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePeriodDataInputSchema = z.object({
  period: z.string().describe("The period to summarize, either 'week' or 'month'."),
  periodData: z.string().describe('A JSON string representing the data for the period. The keys are dates (yyyy-MM-dd) and values contain work, tasks, expenses, and prayers.'),
});
export type SummarizePeriodDataInput = z.infer<typeof SummarizePeriodDataInputSchema>;

const SummarizePeriodDataOutputSchema = z.object({
  summary: z.string().describe('A personalized summary in Roman Urdu with insights and suggestions based on the provided data.'),
});
export type SummarizePeriodDataOutput = z.infer<typeof SummarizePeriodDataOutputSchema>;

export async function summarizePeriodData(input: SummarizePeriodDataInput): Promise<SummarizePeriodDataOutput> {
  return summarizePeriodDataFlow(input);
}

const summarizePeriodDataPrompt = ai.definePrompt({
  name: 'summarizePeriodDataPrompt',
  input: {schema: SummarizePeriodDataInputSchema},
  output: {schema: SummarizePeriodDataOutputSchema},
  prompt: `Aap ek expert productivity aur lifestyle coach hain. Aap user ke pichle {{period}} ke data ka tajzia (analysis) kar ke Roman Urdu mein ek mukhtasir (concise) aur madadgar (helpful) summary faraham karte hain.

User ka is {{period}} ka data yeh hai:
{{periodData}}

Is data ke buniyad par, 3 ahem insights nikalen:
1.  **Work/Productivity:** Kaam ke ghanton (hours), tasks, aur consistency par comment karein.
2.  **Expenses:** Sab se zyada kharcha kis din hua aur total kharchon par ek nazar dalein.
3.  **Prayers:** Namazon ki pabandi, khas taur par konsi namaz zyada parhi ya miss hui, us par feedback dein.

Jawab hamesha Roman Urdu mein, motivational, aur points ki soorat mein hona chahiye. User ko behtari ke liye tajaveez (suggestions) bhi dein.`,
});

const summarizePeriodDataFlow = ai.defineFlow(
  {
    name: 'summarizePeriodDataFlow',
    inputSchema: SummarizePeriodDataInputSchema,
    outputSchema: SummarizePeriodDataOutputSchema,
  },
  async input => {
    const {output} = await summarizePeriodDataPrompt(input);
    return output!;
  }
);
