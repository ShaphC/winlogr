"use client";
import { useActionState, useEffect, useState } from "react";
import { saveStarter, skipStarter } from "@/app/impact-actions";
export function StarterProfile({
  name,
  role,
  initialOpen,
}: {
  name: string;
  role: string;
  initialOpen: boolean;
}) {
  const [skipState, skipAction, skipping] = useActionState(skipStarter, {});
  const [open, setOpen] = useState(initialOpen);
  const [state, action, pending] = useActionState(saveStarter, {});
  const [date, setDate] = useState("");
  useEffect(() => {
    const today = new Date();
    setDate(
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
    );
  }, []);
  useEffect(() => {
    if (state.message || skipState.message) setOpen(false);
  }, [state, skipState]);
  const prompts = [
    "Something you finished or fixed",
    "Someone you helped",
    "Something you improved or learned",
  ];
  return (
    <section className="starter-card card">
      <div className="timeline-heading">
        <div>
          <span className="eyebrow">START WITH YOUR EXPERIENCE</span>
          <h2>Your profile starts with real work.</h2>
        </div>
        <button
          type="button"
          className="text-button"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Set up my profile"}
        </button>
      </div>
      {open && (
        <form action={action} className="stack">
          <p className="muted">
            Optional: add a name, your role, and up to three moments worth
            remembering. You don’t need polished wording. Leave the entries
            blank to skip for now.
          </p>
          <div className="starter-identity">
            <label>
              Name
              <input
                name="name"
                defaultValue={name}
                maxLength={100}
                autoComplete="name"
              />
            </label>
            <label>
              Role or area of work
              <input
                name="role"
                defaultValue={role}
                maxLength={120}
                placeholder="Developer, IT support, customer success…"
              />
            </label>
          </div>
          {prompts.map((prompt, index) => (
            <div key={prompt} className="starter-entry">
              <label>
                {prompt}
                <textarea name={`win_${index}`} rows={2} maxLength={5000} />
              </label>
              <label>
                Date
                <input
                  name={`date_${index}`}
                  type="date"
                  defaultValue={date}
                  key={date}
                />
              </label>
            </div>
          ))}
          <div className="row">
            <button disabled={pending || skipping}>
              {pending ? "Saving…" : "Save and continue"}
            </button>
            <button
              type="submit"
              formAction={skipAction}
              formNoValidate
              className="text-button"
              disabled={pending || skipping}
            >
              Skip for now
            </button>
          </div>
          <p className="error" role="alert">
            {state.error || skipState.error}
          </p>
        </form>
      )}
      <p className="success" role="status">
        {state.message || skipState.message}
      </p>
    </section>
  );
}
