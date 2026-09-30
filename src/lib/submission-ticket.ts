const TICKET_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** Keep all 64 bits of the previous reference, with fewer, unambiguous characters. */
export function submissionTicket(id: string, application = false) {
  const hex = id.replace(/-/g, "").toUpperCase();
  let value = BigInt(`0x${hex.slice(0, 8)}${hex.slice(-8)}`);
  let compact = "";
  for (let i = 0; i < 13; i++) {
    compact = TICKET_ALPHABET[Number(value & 31n)] + compact;
    value >>= 5n;
  }
  return `${application ? "B" : "A"}-${compact}`;
}

/** Previously delivered references and full record IDs remain searchable. */
export function matchesSubmissionTicket(id: string, query: string, application = false) {
  const hex = id.replace(/-/g, "").toUpperCase();
  const legacy = `LG-${application ? "B" : "A"}-${hex.slice(0, 8)}-${hex.slice(-8)}`;
  const search = query.trim().toUpperCase();
  return [submissionTicket(id, application), legacy, id.toUpperCase()].some((reference) =>
    reference.includes(search),
  );
}
