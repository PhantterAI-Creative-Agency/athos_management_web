const WEEKDAY_MONTH_DAY: Intl.DateTimeFormatOptions = {
  weekday: "short",
  day: "numeric",
  month: "short",
};

export function formatEventSchedule(dateStr: string) {
  const date = new Date(dateStr);
  const weekdayMonthDay = date.toLocaleDateString("pt-BR", WEEKDAY_MONTH_DAY);
  const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${weekdayMonthDay} · ${time}`;
}
