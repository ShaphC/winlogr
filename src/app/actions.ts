"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase";
import { winSchema, type ActionState } from "@/lib/validation";
async function account() {
  const db = await createClient();
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (error || !user) redirect("/login");
  return { db, user };
}
export async function login(
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  const db = await createClient();
  const { error } = await db.auth.signInWithPassword({
    email: String(form.get("email") || "").trim(),
    password: String(form.get("password") || ""),
  });
  if (error)
    return {
      error:
        "Unable to sign in. Check your email, password, and email confirmation.",
    };
  redirect("/app");
}
export async function signup(
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({ email: z.email(), password: z.string().min(8) })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return {
      error: "Use a valid email and a password of at least eight characters.",
    };
  const db = await createClient();
  const { data, error } = await db.auth.signUp(parsed.data);
  if (error)
    return {
      error:
        "Unable to create an account. Try again or sign in if you already registered.",
    };
  if (data.session) redirect("/app");
  return { message: "Check your email to confirm your account, then sign in." };
}
export async function signout() {
  const db = await createClient();
  const { error } = await db.auth.signOut();
  if (error) throw new Error("Unable to sign out. Please try again.");
  redirect("/login");
}
export async function saveWin(
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  const { db, user } = await account();
  const parsed = winSchema.safeParse({
    text: form.get("text"),
    date: form.get("date"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const id = String(form.get("id") || "");
  if (id && !z.uuid().safeParse(id).success) return { error: "Invalid win." };
  const payload = {
    original_text: parsed.data.text,
    event_date: parsed.data.date,
  };
  const query = id
    ? db
        .from("win_wins")
        .update({
          ...payload,
          polished_text: null,
          title: null,
          category: null,
          skills: [],
          impact: null,
        })
        .eq("id", id)
        .eq("user_id", user.id)
    : db.from("win_wins").insert({ ...payload, user_id: user.id });
  const { data, error } = await query.select("id");
  if (error || !data?.length)
    return {
      error:
        "Could not save your win. Your text is still here; please try again.",
    };
  revalidatePath("/app");
  revalidatePath("/app/records");
  return { message: id ? "Win updated." : "Win saved." };
}
export async function deleteWin(
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  const { db, user } = await account();
  const id = z.uuid().safeParse(form.get("id"));
  if (!id.success) return { error: "Invalid win." };
  const { data, error } = await db
    .from("win_wins")
    .delete()
    .eq("id", id.data)
    .eq("user_id", user.id)
    .select("id");
  if (error || !data?.length)
    return { error: "Could not delete the win. Try again." };
  revalidatePath("/app");
  revalidatePath("/app/records");
  return { message: "Win deleted." };
}
export async function saveReflection(
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  const { db, user } = await account();
  const date = winSchema.shape.date.safeParse(form.get("date"));
  const raw = z.string().trim().min(1).max(20000).safeParse(form.get("text"));
  if (!date.success || !raw.success)
    return {
      error: "Choose a valid date and add up to 20,000 characters of notes.",
    };
  const lines = raw.data
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length > 20 || lines.some((line) => line.length > 5000))
    return {
      error: "Use up to 20 lines, with at most 5,000 characters per line.",
    };
  const { error } = await db.from("win_wins").insert(
    lines.map((text) => ({
      user_id: user.id,
      original_text: text,
      event_date: date.data,
      source: "reflection",
    })),
  );
  if (error)
    return {
      error: "Could not save your reflection. Your notes are still here.",
    };
  revalidatePath("/app");
  revalidatePath("/app/records");
  return { message: `Saved ${lines.length} wins. View them in My Wins.` };
}
export async function saveSettings(
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  const { db, user } = await account();
  const day = z.coerce.number().int().min(0).max(6).safeParse(form.get("day"));
  const time = z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .safeParse(form.get("time"));
  const timezone = String(form.get("timezone") || "");
  try {
    new Intl.DateTimeFormat("en", { timeZone: timezone }).format();
  } catch {
    return { error: "Enter a valid timezone, such as America/Toronto." };
  }
  if (!day.success || !time.success)
    return { error: "Choose a valid day and time." };
  const { error } = await db.from("win_user_settings").upsert({
    user_id: user.id,
    reminder_day: day.data,
    reminder_time: time.data,
    timezone,
  });
  if (error) return { error: "Could not save your preferences." };
  revalidatePath("/settings");
  return {
    message:
      "Preference saved. Automated reminder delivery is not enabled yet.",
  };
}
