"use client";
import { useActionState, useEffect, useRef } from "react";
import { login, signup, saveWin, deleteWin, saveReflection, saveSettings } from "@/app/actions";
import type { ActionState } from "@/lib/validation";
function Status({state}:{state:ActionState}) { return <p role="status" className={state.error ? "error" : "success"}>{state.error || state.message}</p>; }
function today() { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
export function AuthForm({register=false}:{register?:boolean}) {
  const [state,action,pending] = useActionState(register ? signup : login, {});
  return <form action={action} className="stack"><label>Email<input name="email" type="email" autoComplete="email" required/></label><label>Password<input name="password" type="password" minLength={register ? 8 : 1} autoComplete={register ? "new-password" : "current-password"} required/></label><button disabled={pending}>{pending ? "Please wait…" : register ? "Create account" : "Log in"}</button><Status state={state}/></form>;
}
export function WinForm({win}:{win?:{id:string;original_text:string;event_date:string}}) {
  const [state,action,pending] = useActionState(saveWin, {}); const ref=useRef<HTMLFormElement>(null);
  useEffect(() => { if(state.message && !win) ref.current?.reset(); },[state,win]);
  return <form ref={ref} action={action} className="stack"><input type="hidden" name="id" value={win?.id || ""}/><label>{win ? "Edit your note" : "What did you accomplish?"}<textarea name="text" defaultValue={win?.original_text} placeholder="Fixed a tricky bug. Helped a teammate. Made a process easier. Just write what happened." maxLength={5000} required rows={4}/></label><div className="row"><label>Date<input name="date" type="date" defaultValue={win?.event_date || today()} required/></label><button disabled={pending}>{pending ? "Saving…" : win ? "Save changes" : "Save win"}</button></div><Status state={state}/></form>;
}
export function DeleteForm({id}:{id:string}) {
 const [state,action,pending] = useActionState(deleteWin,{});
 return <form action={action} onSubmit={e=>{if(!window.confirm("Delete this win permanently?")) e.preventDefault();}}><input type="hidden" name="id" value={id}/><button className="text-button danger" disabled={pending}>{pending ? "Deleting…" : "Delete"}</button><Status state={state}/></form>;
}
export function ReflectionForm() {
 const [state,action,pending] = useActionState(saveReflection,{}); const ref=useRef<HTMLFormElement>(null);
 useEffect(()=>{if(state.message) ref.current?.reset();},[state]);
 return <form ref={ref} action={action} className="stack"><label>Write anything you remember<textarea name="text" rows={8} maxLength={20000} required placeholder={"Fixed the reporting issue\nHelped a teammate deploy their first update\nReceived positive feedback from a customer"}/></label><p className="muted">One win per line. Each line is saved as written; AI extraction comes next.</p><label>Date for these wins<input name="date" type="date" defaultValue={today()} required/></label><button disabled={pending}>{pending ? "Saving…" : "Save this reflection"}</button><Status state={state}/></form>;
}
export function SettingsForm({settings}:{settings:{reminder_day?:number;reminder_time?:string;timezone?:string}|null}) {
 const [state,action,pending] = useActionState(saveSettings,{});
 return <form action={action} className="stack"><label>Reflection day<select name="day" defaultValue={settings?.reminder_day ?? 5}>{["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((day,i)=><option key={day} value={i}>{day}</option>)}</select></label><label>Time<input type="time" name="time" required defaultValue={settings?.reminder_time?.slice(0,5) || "16:00"}/></label><label>Timezone<input name="timezone" defaultValue={settings?.timezone || "America/Toronto"} required/></label><p className="muted">These preferences are saved for the reminder feature. No emails are being scheduled or sent yet.</p><button disabled={pending}>Save preferences</button><Status state={state}/></form>;
}
