export function formatWinDate(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "UTC",
  }).format(date);
  const calendar = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  return `${weekday} - ${calendar}`;
}
