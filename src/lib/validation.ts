import { z } from "zod";
export const winSchema = z.object({
  text: z.string().trim().min(1, "Write something first.").max(5000, "Keep each win under 5,000 characters."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date.").refine(value => {
    const date = new Date(value + "T12:00:00Z");
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === value;
  }, "Choose a valid date.")
});
export type ActionState = { error?: string; message?: string };
