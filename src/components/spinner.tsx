export function Spinner() {
  return <span className="app-spinner" aria-hidden="true" />;
}

export function LoadingIndicator({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="app-loading" role="status">
      <Spinner />
      <span>{label}</span>
    </div>
  );
}
