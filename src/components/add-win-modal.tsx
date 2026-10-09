"use client";
import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useActionState,
  type ReactNode,
} from "react";
import { saveWin } from "@/app/actions";
const ModalContext = createContext<() => void>(() => {});
export function AddWinButton({ label = "Add a win" }: { label?: string }) {
  const open = useContext(ModalContext);
  return (
    <button type="button" onClick={open}>
      {label} <span aria-hidden="true">＋</span>
    </button>
  );
}
function localDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function WinModalProvider({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [state, action, pending] = useActionState(saveWin, {});
  const storageKey = `winlog:win-draft:${userId}`;
  useEffect(() => {
    setDate(localDate());
    try {
      setText(localStorage.getItem(storageKey) || "");
    } catch {}
  }, [storageKey]);
  function update(value: string) {
    setText(value);
    try {
      if (value) localStorage.setItem(storageKey, value);
      else localStorage.removeItem(storageKey);
    } catch {}
  }
  useEffect(() => {
    if (state.message) {
      setText("");
      setDate(localDate());
      try {
        localStorage.removeItem(storageKey);
      } catch {}
      dialog.current?.close();
    }
  }, [state, storageKey]);
  function open() {
    dialog.current?.showModal();
    requestAnimationFrame(() => input.current?.focus());
  }
  return (
    <ModalContext.Provider value={open}>
      {children}
      <p className="impact-toast" role="status">
        {state.message}
      </p>
      <dialog
        ref={dialog}
        className="add-win-dialog"
        onCancel={(event) => {
          if (pending) event.preventDefault();
        }}
      >
        <div className="modal-top">
          <div>
            <span className="eyebrow">A QUICK NOTE IS ENOUGH</span>
            <h2>What did you get done?</h2>
          </div>
          <button
            type="button"
            className="text-button"
            aria-label="Close add win"
            disabled={pending}
            onClick={() => dialog.current?.close()}
          >
            ✕
          </button>
        </div>
        <form
          ref={formRef}
          action={action}
          className="stack"
          onKeyDown={(event) => {
            if (
              (event.metaKey || event.ctrlKey) &&
              event.key === "Enter" &&
              !pending
            ) {
              event.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        >
          <label className="sr-only" htmlFor="quick-win-text">
            Your accomplishment
          </label>
          <textarea
            ref={input}
            id="quick-win-text"
            name="text"
            value={text}
            onChange={(event) => update(event.target.value)}
            rows={5}
            maxLength={5000}
            required
            placeholder="Fixed a problem. Helped someone. Finished something. Just write what happened."
          />
          <div className="row">
            <label>
              Date
              <input
                type="date"
                name="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </label>
            <button disabled={pending}>
              {pending ? "Saving…" : "Save win"}
            </button>
          </div>
          <p className="muted">
            ⌘ / Ctrl + Enter to save. Closing keeps your draft on this device.
          </p>
          {state.error && (
            <p className="error" role="alert">
              {state.error}
            </p>
          )}
          {text && (
            <button
              type="button"
              className="text-button"
              disabled={pending}
              onClick={() => {
                if (window.confirm("Discard this unfinished note?")) {
                  update("");
                }
              }}
            >
              Discard draft
            </button>
          )}
        </form>
      </dialog>
    </ModalContext.Provider>
  );
}
