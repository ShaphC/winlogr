import { z } from "zod";
import { winSchema } from "./validation";
const evidence = z.array(z.string()).min(1).max(30);
export const impactSchema = z.object({
  headline: z.string().min(1).max(150),
  summary: z.string().min(1).max(1800),
  summary_source_ids: evidence,
  outcomes: z
    .array(
      z.object({
        title: z.string().min(1).max(150),
        description: z.string().min(1).max(700),
        source_ids: evidence,
      }),
    )
    .min(1)
    .max(8),
});
export type Impact = z.infer<typeof impactSchema>;
export type Profile = {
  id: string;
  content: Impact;
  source_win_ids: string[];
  period_start: string;
  period_end: string;
  display_name: string;
  role_label: string;
  created_at: string;
  updated_at: string;
};
export const periodSchema = z
  .object({
    start: winSchema.shape.date,
    end: winSchema.shape.date,
  })
  .refine(
    (value) => value.start <= value.end,
    "Start date must be before end date.",
  );
export function validateEvidence(content: Impact, allowed: string[]) {
  const ids = new Set(allowed);
  const references = [
    ...content.summary_source_ids,
    ...content.outcomes.flatMap((value) => value.source_ids),
  ];
  if (references.some((id) => !ids.has(id))) {
    throw new Error("The profile included an unrecognized source.");
  }
  return content;
}
