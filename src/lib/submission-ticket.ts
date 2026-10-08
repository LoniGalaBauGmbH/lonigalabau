const TICKET_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export type SubmissionTicketFields = {
  ticket_number?: number | null;
  ticket_format_version?: number | null;
};

/** Keep legacy references stable for already sent mail and idempotent retries. */
function legacyTicket(id: string, application = false) {
  const hex = id.replace(/-/g, "").toUpperCase();
  let value = BigInt(`0x${hex.slice(0, 8)}${hex.slice(-8)}`);
  let compact = "";
  for (let i = 0; i < 13; i++) {
    compact = TICKET_ALPHABET[Number(value & 31n)] + compact;
    value >>= 5n;
  }
  return `${application ? "B" : "A"}-${compact}`;
}

/** The database allocates unique, permanent numbers; UUIDs remain internal IDs. */
export function submissionTicket(
  id: string,
  application: boolean | "partner" = false,
  record?: SubmissionTicketFields,
) {
  if (
    record?.ticket_format_version === 2 &&
    typeof record.ticket_number === "number" &&
    Number.isSafeInteger(record.ticket_number) &&
    record.ticket_number >= 1000
  ) {
    return `${application === "partner" ? "P" : application ? "B" : "A"}-${record.ticket_number}`;
  }
  return application === "partner"
    ? legacyTicket(id).replace(/^A-/, "P-")
    : legacyTicket(id, application);
}

/** Previously delivered references and full record IDs remain searchable. */
export function matchesSubmissionTicket(
  id: string,
  query: string,
  application: boolean | "partner" = false,
  record?: SubmissionTicketFields,
) {
  const hex = id.replace(/-/g, "").toUpperCase();
  const legacy = `LG-${application === "partner" ? "P" : application ? "B" : "A"}-${hex.slice(0, 8)}-${hex.slice(-8)}`;
  const search = query.trim().toUpperCase();
  return [
    submissionTicket(id, application, record),
    legacyTicket(id, application === true),
    legacy,
    id.toUpperCase(),
  ].some((reference) => reference.includes(search));
}
