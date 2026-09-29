export type EmailRecord = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message?: string | null;
};
type Row = [string, string];
type Section = { title: string; rows?: Row[]; text?: string };
const escapeHtml = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
  );
const lines = (value: string) => escapeHtml(value).replace(/\r?\n/g, "<br>");
const row = (line: string): Row => {
  const at = line.indexOf(": ");
  return at < 0 ? ["Hinweis", line] : [line.slice(0, at), line.slice(at + 2)];
};

/** Decode the two existing, server-generated briefings without interpreting free text as HTML. */
export function emailSections(record: EmailRecord, application: boolean) {
  const message = record.message || "Keine zusätzliche Nachricht.";
  let channel = "";
  let notice = "";
  let sections: Section[] = [
    { title: application ? "Nachricht zur Bewerbung" : "Nachricht", text: message },
  ];
  if (
    !application &&
    record.subject?.startsWith("Gartenplaner:") &&
    message.startsWith("GARTENPLANER · Projektbriefing\n")
  ) {
    const footer = /\nKontaktweg: ([^\n]+)\nDatenschutzhinweise zur Bearbeitung bestätigt\.$/;
    channel = message.match(footer)?.[1] || "";
    const body = message.replace(footer, "");
    const notesAt = body.indexOf("\nWÜNSCHE & HINWEISE\n");
    const structured = notesAt < 0 ? body : body.slice(0, notesAt);
    const titles: Record<string, string> = {
      VORHABEN: "Vorhaben",
      GARTENGESTALTUNG: "Gartengestaltung",
      "PFLASTER & TERRASSE": "Pflaster & Terrasse",
      "NATURSTEIN & MAUERN": "Naturstein & Mauern",
      "ZAUN & SICHTSCHUTZ": "Zaun & Sichtschutz",
      RASENANLAGEN: "Rasenanlagen",
      BEWÄSSERUNG: "Bewässerung",
      ERDARBEITEN: "Erdarbeiten",
      ENTWÄSSERUNG: "Entwässerung",
      GARTENPFLEGE: "Gartenpflege",
      GRUNDSTÜCK: "Grundstück & Zugang",
      RAHMEN: "Budget, Termin & Rahmen",
    };
    sections = [];
    let current: Section | undefined;
    for (const line of structured.split("\n").slice(2)) {
      if (!line.trim()) continue;
      if (titles[line]) {
        current = { title: titles[line], rows: [] };
        sections.push(current);
      } else if (current) current.rows!.push(row(line));
    }
    if (notesAt >= 0)
      sections.push({
        title: "Wünsche & Hinweise",
        text: body
          .slice(notesAt + "\nWÜNSCHE & HINWEISE\n".length)
          .replace(/^Notizen: /, "")
          .trim(),
      });
    notice =
      "Maße sind Kundenangaben und vor Ausführung zu prüfen. Die Datenschutzhinweise zur Bearbeitung wurden bestätigt.";
  } else if (
    !application &&
    record.subject?.startsWith("Projektanfrage:") &&
    message.startsWith("Leistungsbereich: ") &&
    message.includes("\nBeschreibung:\n")
  ) {
    const at = message.indexOf("\nBeschreibung:\n");
    const metadata = message.slice(0, at).split("\n").map(row);
    channel = metadata.find(([key]) => key === "Bevorzugter Kontakt")?.[1] || "";
    const project = metadata.filter(
      ([key]) => !["Bevorzugter Kontakt", "Budget", "Zeitraum"].includes(key),
    );
    const frame = metadata.filter(([key]) => ["Budget", "Zeitraum"].includes(key));
    sections = [
      { title: "Projekt im Überblick", rows: project },
      { title: "Budget & Termin", rows: frame },
      { title: "Beschreibung & Wünsche", text: message.slice(at + "\nBeschreibung:\n".length) },
    ];
  }
  return { sections, channel, notice };
}

export function renderSubmissionEmail(
  record: EmailRecord,
  application: boolean,
  jobTitle: string,
  files: string[],
  adminUrl: string,
) {
  const { sections, channel, notice } = emailSections(record, application);
  const title = application
    ? "Neue Bewerbung"
    : record.subject?.startsWith("Gartenplaner:")
      ? "Neue Gartenplanung"
      : record.subject?.startsWith("Projektanfrage:")
        ? "Neue Projektanfrage"
        : "Neue Kontaktanfrage";
  const contact: Row[] = [
    ["Name", record.name],
    ["E-Mail", record.email],
    ["Telefon", record.phone || "Nicht angegeben"],
    ...(channel ? [["Kontaktwunsch", channel] as Row] : []),
  ];
  const renderRows = (rows: Row[]) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;table-layout:fixed">${rows.map(([key, value], i) => `<tr><td width="34%" valign="top" bgcolor="${i % 2 ? "#ffffff" : "#f5f7f3"}" style="padding:11px 12px;font-size:14px;line-height:21px;color:#607064;word-wrap:break-word">${lines(key)}</td><td width="66%" valign="top" bgcolor="${i % 2 ? "#ffffff" : "#f5f7f3"}" style="padding:11px 12px;font-size:14px;line-height:21px;color:#183f24;word-wrap:break-word;font-weight:600">${lines(value)}</td></tr>`).join("")}</table>`;
  const renderSection = (section: Section) =>
    `<tr><td style="padding:24px 24px 0"><h2 style="margin:0 0 12px;font-size:17px;line-height:24px;font-weight:700;color:#1e4826">${escapeHtml(section.title)}</h2>${section.rows ? renderRows(section.rows) : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td bgcolor="#f5f7f3" style="padding:16px;font-size:15px;line-height:24px;color:#263d2b;word-wrap:break-word">${lines(section.text || "Keine Angaben")}</td></tr></table>`}</td></tr>`;
  const text = [
    title.toUpperCase(),
    "",
    ...(jobTitle
      ? ["STELLE", jobTitle, ""]
      : record.subject
        ? ["BETREFF", record.subject, ""]
        : []),
    "KONTAKT",
    ...contact.map(([key, value]) => `${key}: ${value}`),
    ...sections.flatMap((s) => [
      "",
      s.title.toUpperCase(),
      ...(s.rows ? s.rows.map(([key, value]) => `${key}: ${value}`) : [s.text || "Keine Angaben"]),
    ]),
    "",
    `ANHÄNGE (${files.length})`,
    ...(files.length ? files.map((name) => "- " + name) : ["Keine Unterlagen beigefügt."]),
    "",
    "Antworten Sie auf diese E-Mail, um die anfragende Person zu erreichen.",
    "Adminbereich: " + adminUrl,
    ...(notice ? ["", notice] : []),
    "",
    "Vorgangsnummer: " + record.id,
  ].join("\n");
  const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head><body style="margin:0;padding:0;background-color:#eef2ec;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#eef2ec"><tr><td align="center" style="padding:24px 10px"><!--[if mso]><table role="presentation" width="640"><tr><td><![endif]--><table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="width:100%;max-width:640px;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif"><tr><td bgcolor="#1e4826" style="padding:28px 24px;color:#ffffff"><img src="cid:loni-logo" alt="Loni GalaBau GmbH" width="240" height="46" style="display:block;width:240px;max-width:100%;height:auto;border:0;margin:0 0 24px"><p style="margin:0 0 10px;font-size:12px;letter-spacing:2px;color:#c5dda8">WEBSITE-ANFRAGEN</p><h1 style="margin:0;font-size:27px;line-height:34px;font-weight:700;color:#ffffff">${title}</h1><p style="margin:10px 0 0;font-size:15px;line-height:23px;color:#e1ebdc">${lines(jobTitle || record.subject || "Eine neue Nachricht über die Website")}</p></td></tr>${renderSection({ title: application ? "Bewerberkontakt" : "Kontakt", rows: contact })}${sections.map(renderSection).join("")}${renderSection({ title: `Anhänge (${files.length})`, text: files.length ? files.map((name) => "• " + name).join("\n") : "Keine Unterlagen beigefügt." })}<tr><td style="padding:24px"><p style="margin:0 0 16px;font-size:14px;line-height:22px;color:#526454">Direkt auf diese E-Mail antworten, um ${escapeHtml(record.name)} zu erreichen.</p><table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="#1e4826" style="padding:14px 20px;border-radius:6px"><a href="${escapeHtml(adminUrl)}" style="font-size:14px;font-weight:700;color:#ffffff;text-decoration:none">Im Adminbereich öffnen →</a></td></tr></table></td></tr><tr><td bgcolor="#1e4826" style="padding:24px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td width="82" valign="middle"><img src="cid:gartenverband-logo" alt="Fachverband Garten- und Landschaftsbau" width="60" height="80" style="display:block;width:60px;height:80px;border:0"></td><td valign="middle" style="font-size:13px;line-height:21px;color:#ffffff">Partner im Fachverband<br>Garten-, Landschafts- und Sportplatzbau<br>Hessen-Thüringen</td></tr></table></td></tr><tr><td bgcolor="#f5f7f3" style="padding:18px 24px;font-size:12px;line-height:19px;color:#667468">${notice ? `${lines(notice)}<br><br>` : ""}Loni GalaBau GmbH · Website-Benachrichtigung<br>Vorgangsnummer: ${escapeHtml(record.id)}</td></tr></table><!--[if mso]></td></tr></table><![endif]--></td></tr></table></body></html>`;
  return { html, text };
}
