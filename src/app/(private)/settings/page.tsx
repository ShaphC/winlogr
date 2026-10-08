import { createClient } from "@/lib/supabase";
import { SettingsForm } from "@/components/forms";
export default async function Page(){const db=await createClient();const {data:{user}}=await db.auth.getUser();const {data,error}=await db.from("win_user_settings").select("reminder_day,reminder_time,timezone").eq("user_id",user!.id).maybeSingle();if(error) throw new Error("Unable to load settings.");return <><h1>Your rhythm.</h1><p className="muted">Choose a weekly moment to reflect.</p><section className="card"><SettingsForm settings={data}/></section></>;}
