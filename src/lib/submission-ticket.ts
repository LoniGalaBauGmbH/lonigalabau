/** A stable, non-sequential reference shared by customers, staff and the admin search. */
export function submissionTicket(id: string, application = false) {
  const hex = id.replace(/-/g, "").toUpperCase();
  return `LG-${application ? "B" : "A"}-${hex.slice(0, 8)}-${hex.slice(-8)}`;
}
