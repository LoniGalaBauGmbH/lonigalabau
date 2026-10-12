const TIME_ZONE = "Europe/Berlin";
const berlinParts = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function calendarParts(instant: Date) {
  const parts = Object.fromEntries(
    berlinParts.formatToParts(instant).map(({ type, value }) => [type, value]),
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

function dateKey(calendar: Date) {
  return calendar.toISOString().slice(0, 10);
}

// Calendar arithmetic is separate from elapsed hours: a Berlin day may have 23 or 25 hours.
function midnightInBerlin(calendar: Date) {
  const desired = calendar.getTime();
  let instant = desired;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const parts = calendarParts(new Date(instant));
    const represented = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
    );
    instant = desired - (represented - instant);
  }
  return new Date(instant).toISOString();
}

/** Today and the preceding 29 Berlin calendar days; the end is exclusive. */
export function incomingContactWindow(now: Date = new Date()) {
  return contactCalendarWindow(now, 30);
}

export function incomingTodayWindow(now: Date = new Date()) {
  return contactCalendarWindow(now, 1);
}

function contactCalendarWindow(now: Date, days: 1 | 30) {
  if (!Number.isFinite(now.getTime())) throw new Error("Ungültiger Messzeitpunkt.");
  const { year, month, day } = calendarParts(now);
  const today = new Date(Date.UTC(year, month - 1, day));
  const firstDay = new Date(today);
  firstDay.setUTCDate(firstDay.getUTCDate() - (days - 1));
  const nextDay = new Date(today);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);

  return {
    start: midnightInBerlin(firstDay),
    end: midnightInBerlin(nextDay),
    startDate: dateKey(firstDay),
    endDate: dateKey(today),
    days,
    timeZone: TIME_ZONE,
  } as const;
}
