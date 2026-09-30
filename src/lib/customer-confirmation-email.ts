import { submissionTicket, type SubmissionTicketFields } from "./submission-ticket";

export type ConfirmationKind = "contact" | "project" | "planner" | "application";
export type ConfirmationInput = SubmissionTicketFields & {
  id: string;
  kind: ConfirmationKind;
  createdAt: string;
  attachmentCount: number;
  siteOrigin: string;
};

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
  );

export function renderCustomerConfirmation(input: ConfirmationInput) {
  const application = input.kind === "application";
  const ticket = submissionTicket(input.id, application, input);
  const date = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Berlin",
  }).format(new Date(input.createdAt));
  const noun = {
    contact: "Nachricht",
    project: "Projektanfrage",
    planner: "Gartenplanung",
    application: "Bewerbung",
  }[input.kind];
  const headline = application
    ? "Ihre Bewerbung<br>ist angekommen."
    : "Ihre Anfrage<br>ist angekommen.";
  const intro = application
    ? "Vielen Dank für Ihr Interesse an Loni GalaBau. Wir haben Ihre Bewerbung erhalten und freuen uns darauf, Sie kennenzulernen."
    : input.kind === "planner"
      ? "Vielen Dank für Ihre Gartenplanung. Ihre Angaben sind bei uns eingegangen und geben uns eine gute Grundlage, um Ihr Vorhaben mit Ihnen zu besprechen."
      : "Vielen Dank für Ihr Vertrauen in Loni GalaBau. Ihre Nachricht ist bei uns eingegangen. Wir freuen uns darauf, mehr über Ihr Vorhaben zu erfahren.";
  const steps = application
    ? [
        [
          "Wir schauen genau hin.",
          "Unser Team prüft Ihre Angaben und die eingereichten Unterlagen.",
        ],
        [
          "Wir melden uns persönlich.",
          "Anschließend besprechen wir mit Ihnen die nächsten Schritte.",
        ],
      ]
    : [
        [
          "Wir prüfen Ihr Vorhaben.",
          "Wir sehen uns Ihre Angaben und vorhandenen Unterlagen in Ruhe an.",
        ],
        [
          "Wir besprechen die nächsten Schritte.",
          "Wir melden uns bei Ihnen, klären offene Fragen und stimmen bei Bedarf einen Vor-Ort-Termin ab.",
        ],
      ];
  const inspirationTitle = application
    ? "Ihre Bewerbung.<br>Unser nächster Schritt."
    : "Ihr Vorhaben.<br>Persönlich besprochen.";
  const inspiration = application
    ? "Wenn für die Prüfung Ihrer Bewerbung noch Angaben fehlen, melden wir uns bei Ihnen. Sie brauchen Ihre Unterlagen nicht erneut zu senden."
    : "Wir prüfen Ihre Angaben und klären mit Ihnen, welche Informationen für den nächsten Schritt benötigt werden. Eine Beauftragung entsteht erst durch eine gesonderte Vereinbarung.";
  const cta = "Kontakt zu Ihrer Anfrage";
  const url = input.siteOrigin + "/kontakt";
  const attachments = input.attachmentCount
    ? `${input.attachmentCount} ${input.attachmentCount === 1 ? "Anhang" : "Anhänge"} erhalten`
    : "Keine Anhänge beigefügt";
  const text = [
    `${noun.toUpperCase()} EINGEGANGEN`,
    "",
    intro,
    "",
    `Ihre Ticketnummer: ${ticket}`,
    `Eingang: ${date} Uhr`,
    `Formular: ${noun}`,
    attachments,
    "",
    "SO GEHT ES WEITER",
    ...steps.flatMap(([title, copy], i) => [`${i + 1}. ${title}`, copy]),
    "",
    "Sie möchten etwas ergänzen?",
    "Antworten Sie einfach auf diese E-Mail. Bitte lassen Sie die Ticketnummer im Betreff stehen.",
    "",
    inspirationTitle.replace(/<br>/g, " "),
    inspiration,
    `${cta}: ${url}`,
    "",
    "Herzliche Grüße",
    "Ihr Team von Loni GalaBau",
    "",
    "Loni GalaBau GmbH · Auf der Roos 3 · 65795 Hattersheim am Main",
    "Telefon: 06190 9266134 · Montag bis Freitag, 07:00–18:00 Uhr",
    "E-Mail: webseite@loni-galabau.de",
    "Geschäftsführer: Valon Sinanaj · Amtsgericht Frankfurt am Main · HRB 125735",
    application
      ? "Dies ist eine automatische Eingangsbestätigung, noch keine Zusage."
      : "Dies ist eine automatische Eingangsbestätigung, noch kein Angebot und keine Auftragsbestätigung.",
    "Falls Sie keine Anfrage gestellt haben, können Sie uns kurz Bescheid geben.",
    `Datenschutz: ${input.siteOrigin}/datenschutz`,
  ].join("\n");
  const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>Ihre ${noun} ist angekommen</title><style>@media(max-width:480px){.pad{padding-left:22px!important;padding-right:22px!important}.title{font-size:32px!important;line-height:38px!important}.outer{padding:10px 6px!important}}</style></head>
<body style="margin:0;padding:0;background:#edf1e9;font-family:Arial,Helvetica,sans-serif;color:#24432c">
<div style="display:none;font-size:1px;color:#edf1e9;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">Vielen Dank! Ihre ${noun} ist bei uns eingegangen. Ticket ${ticket}.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#edf1e9"><tr><td class="outer" align="center" style="padding:32px 12px">
<!--[if mso]><table role="presentation" width="640"><tr><td><![endif]--><table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="width:100%;max-width:640px;border-collapse:collapse">
<tr><td class="pad" bgcolor="#1e4826" style="padding:34px 40px 0"><img src="cid:loni-logo" width="220" height="42" alt="Loni GalaBau GmbH" style="display:block;width:220px;max-width:100%;height:auto;border:0"></td></tr>
<tr><td class="pad" bgcolor="#1e4826" style="padding:34px 40px 38px"><p style="margin:0 0 14px;font-size:11px;font-weight:bold;letter-spacing:2px;color:#b5d98e">GUT ANGEKOMMEN. BEI LONI.</p><h1 class="title" style="margin:0 0 21px;font-size:42px;line-height:48px;font-weight:600;letter-spacing:-1px;color:#ffffff">${headline}</h1><p style="margin:0;font-size:16px;line-height:26px;color:#e5eddf">${intro}</p></td></tr>
<tr><td class="pad" bgcolor="#f0f4e9" style="padding:25px 40px"><p style="margin:0 0 8px;font-size:11px;font-weight:bold;letter-spacing:1.5px;color:#62745c">IHRE TICKETNUMMER</p><p style="margin:0 0 13px;font-size:19px;line-height:26px;font-weight:bold;letter-spacing:.3px;color:#1e4826;word-break:break-word">${ticket}</p><p style="margin:0;font-size:13px;line-height:21px;color:#52644b">${date} Uhr · ${noun}<br>${attachments}</p></td></tr>
<tr><td class="pad" style="padding:34px 40px 10px"><h2 style="margin:0;font-size:24px;line-height:31px;color:#1e4826">So geht es weiter.</h2></td></tr>
${steps.map(([title, copy], index) => `<tr><td class="pad" style="padding:15px 40px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td width="43" valign="top" style="padding-top:2px;font-size:17px;font-weight:bold;color:#78a04c">0${index + 1}</td><td><h3 style="margin:0 0 6px;font-size:16px;line-height:23px;color:#1e4826">${title}</h3><p style="margin:0;font-size:15px;line-height:24px;color:#526454">${copy}</p></td></tr></table></td></tr>`).join("")}
<tr><td class="pad" style="padding:20px 40px 35px"><p style="margin:0 0 7px;font-size:16px;font-weight:bold;color:#1e4826">Sie möchten etwas ergänzen?</p><p style="margin:0;font-size:15px;line-height:24px;color:#526454">Antworten Sie einfach auf diese E-Mail. Ihre Nachricht landet direkt bei unserem Team. Lassen Sie dafür bitte die Ticketnummer im Betreff stehen.</p></td></tr>
<tr><td><img src="cid:confirmation-photo-v1" width="640" height="300" alt="${application ? "Das Team von Loni GalaBau auf einer Baustelle" : "Garten mit Terrasse und Bepflanzung"}" style="display:block;width:100%;max-width:640px;height:auto;border:0"></td></tr>
<tr><td class="pad" bgcolor="#f8f8f0" style="padding:32px 40px 36px"><h2 style="margin:0 0 15px;font-size:29px;line-height:35px;font-weight:600;color:#1e4826">${inspirationTitle}</h2><p style="margin:0 0 23px;font-size:15px;line-height:25px;color:#526454">${inspiration}</p><table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="#1e4826" style="border-radius:25px"><a href="${escapeHtml(url)}" style="display:inline-block;padding:15px 23px;border:1px solid #1e4826;border-radius:25px;font-size:14px;font-weight:bold;text-decoration:none;color:#ffffff;mso-padding-alt:0"><!--[if mso]><i style="mso-font-width:150%;mso-text-raise:22pt">&nbsp;</i><![endif]-->${cta} &rarr;<!--[if mso]><i style="mso-font-width:150%">&nbsp;</i><![endif]--></a></td></tr></table></td></tr>
<tr><td class="pad" style="padding:30px 40px"><p style="margin:0;font-size:15px;line-height:25px;color:#1e4826">Herzliche Grüße<br><strong>Ihr Team von Loni GalaBau</strong></p></td></tr>
<tr><td class="pad" bgcolor="#1e4826" style="padding:28px 40px"><table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr><td valign="top"><p style="margin:0 0 9px;font-size:15px;font-weight:bold;color:#ffffff">Loni GalaBau GmbH</p><p style="margin:0;font-size:13px;line-height:22px;color:#d6e3d0">Auf der Roos 3 · 65795 Hattersheim am Main<br><a href="tel:+4961909266134" style="color:#ffffff;text-decoration:none">06190 9266134</a><br>Mo–Fr · 07:00–18:00 Uhr<br><a href="mailto:webseite@loni-galabau.de" style="color:#ffffff;text-decoration:underline">webseite@loni-galabau.de</a></p></td><td width="55" valign="top" align="right"><img src="cid:gartenverband-logo" width="45" height="60" alt="Fachverband" style="display:block;border:0"></td></tr></table></td></tr>
<tr><td class="pad" style="padding:23px 40px;font-size:11px;line-height:18px;color:#788274">Geschäftsführer: Valon Sinanaj · Amtsgericht Frankfurt am Main · HRB 125735<br><br>${application ? "Automatische Eingangsbestätigung – noch keine Zusage." : "Automatische Eingangsbestätigung – noch kein Angebot und keine Auftragsbestätigung."} Falls Sie keine Anfrage gestellt haben, können Sie uns kurz Bescheid geben.<br><br><a href="${escapeHtml(input.siteOrigin)}/datenschutz" style="color:#526454">Datenschutz</a> &nbsp;·&nbsp; <a href="${escapeHtml(input.siteOrigin)}/impressum" style="color:#526454">Impressum</a></td></tr>
</table><!--[if mso]></td></tr></table><![endif]--></td></tr></table></body></html>`;
  return { subject: `Ihre ${noun} ist angekommen · ${ticket}`, html, text };
}
