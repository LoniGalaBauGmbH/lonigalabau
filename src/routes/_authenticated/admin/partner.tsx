import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  adminListPartners,
  adminUpdatePartnerStatus,
  adminPartnerDocument,
  adminSaveNotes,
  adminRetryPartnerEmails,
} from "@/lib/admin.functions";
import {
  PARTNER_STATUSES,
  berlinToday,
  partnerAvailability,
  type PartnerStatus,
} from "@/lib/partner-application";
import { submissionTicket } from "@/lib/submission-ticket";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DeleteSubmission } from "@/components/admin/DeleteSubmission";
import { SubmissionNotification } from "@/components/admin/SubmissionNotification";
import { Search, ArrowUpRight, FileCheck2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/partner")({
  component: PartnerAdmin,
  head: () => ({
    meta: [
      { title: "Partnerbewerbungen · Loni Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});
type Partner = Awaited<ReturnType<typeof adminListPartners>>[number];
const date = (value: string) =>
  new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin" }).format(new Date(value));

function PartnerAdmin() {
  const list = useServerFn(adminListPartners);
  const query = useQuery({ queryKey: ["admin-partners"], queryFn: () => list() });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const rows = (query.data ?? []).filter(
    (row) =>
      (status === "all" || row.status === status) &&
      [
        row.company_name,
        row.name,
        row.email,
        row.city,
        row.service_area,
        row.trades.join(" "),
        submissionTicket(row.id, "partner", row),
      ]
        .join(" ")
        .toLocaleLowerCase("de")
        .includes(search.toLocaleLowerCase("de")),
  );
  const active = query.data?.find((row) => row.id === selected);
  return (
    <div>
      <p className="eyebrow">Zusammenarbeit</p>
      <h1 className="mt-2 text-3xl font-bold text-brand">Partnerbewerbungen</h1>
      <p className="mt-3 text-sm text-brand/70">
        Betriebe prüfen, Nachweise einsehen und den nächsten Schritt festhalten. „Vorgemerkt“ ist
        keine Auftragszusage.
      </p>
      <div className="mt-7 flex flex-col sm:flex-row gap-3">
        <label className="relative flex-1">
          <span className="sr-only">Partner suchen</span>
          <Search className="absolute left-3 top-3 h-5 w-5 text-brand/50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Firma, Ort, Leistung oder P-Nummer"
            className="w-full rounded-xl border border-brand/20 bg-white py-3 pl-10 pr-3 text-sm"
          />
        </label>
        <label>
          <span className="sr-only">Status filtern</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-brand/20 bg-white p-3 text-sm"
          >
            <option value="all">Alle Status</option>
            {Object.entries(PARTNER_STATUSES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {query.isLoading && (
        <p className="py-8" role="status">
          Bewerbungen werden geladen …
        </p>
      )}
      {query.isError && (
        <p className="py-8 text-red-700" role="alert">
          Bewerbungen konnten nicht geladen werden.{" "}
          <button className="underline" onClick={() => query.refetch()}>
            Erneut laden
          </button>
        </p>
      )}
      {!query.isLoading && !query.isError && (
        <p className="mt-5 text-sm text-brand/60">
          {rows.length} {rows.length === 1 ? "Bewerbung" : "Bewerbungen"}
        </p>
      )}
      <div className="mt-3 space-y-3">
        {rows.map((row) => (
          <button
            key={row.id}
            onClick={() => setSelected(row.id)}
            className="w-full rounded-2xl bg-white border border-brand/10 p-5 text-left hover:border-brand/40 focus-visible:outline-2 focus-visible:outline-brand"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-xs text-brand/60">
                  {submissionTicket(row.id, "partner", row)} · {date(row.created_at)}
                </span>
                <h2 className="mt-1 text-lg font-bold break-words">{row.company_name}</h2>
                <p className="mt-1 text-sm text-brand/70 break-words">
                  {row.city} · {row.trades.join(", ")}
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-brand/10 px-3 py-1.5">
                {PARTNER_STATUSES[row.status]}
              </span>
              <span
                className={`rounded-full px-3 py-1.5 ${row.certificate_valid_until < berlinToday() ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800"}`}
              >
                § 48b {row.certificate_valid_until < berlinToday() ? "abgelaufen am" : "gültig bis"}{" "}
                {date(row.certificate_valid_until)}
              </span>
              <span
                className={`rounded-full px-3 py-1.5 ${!row.vat_certificate_valid_until || row.vat_certificate_valid_until < berlinToday() ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800"}`}
              >
                § 13b{" "}
                {row.vat_certificate_valid_until
                  ? `${row.vat_certificate_valid_until < berlinToday() ? "abgelaufen am" : "gültig bis"} ${date(row.vat_certificate_valid_until)}`
                  : "fehlt"}
              </span>
              {(!row.notification_sent_at || !row.customer_confirmation_sent_at) && (
                <span className="rounded-full bg-amber-50 text-amber-800 px-3 py-1.5">
                  E-Mail ausstehend
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
      {!query.isLoading && !query.isError && !rows.length && (
        <p className="rounded-2xl bg-white p-8 mt-3 text-brand/70">
          Keine Bewerbungen für diese Auswahl.
        </p>
      )}
      <Dialog
        open={!!active}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90dvh] overflow-y-auto">
          {active && (
            <PartnerDetail key={active.id} row={active} onDeleted={() => setSelected(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PartnerDetail({ row, onDeleted }: { row: Partner; onDeleted: () => void }) {
  const qc = useQueryClient();
  const update = useServerFn(adminUpdatePartnerStatus),
    save = useServerFn(adminSaveNotes),
    sign = useServerFn(adminPartnerDocument),
    retry = useServerFn(adminRetryPartnerEmails);
  const [notes, setNotes] = useState(row.notes),
    [version, setVersion] = useState(row.notes_version),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState(""),
    [download, setDownload] = useState<Partial<Record<"tax" | "vat", string>>>({});
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-partners"] });
  async function action(fn: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Änderung fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }
  const info = [
    ["Betrieb", `${row.company_name} · ${row.legal_form}`],
    ["Anschrift", `${row.street}, ${row.postal_code} ${row.city}, Deutschland`],
    ["Kontakt", row.name],
    ["E-Mail", row.email],
    ["Telefon", row.phone],
    ["Leistungen", row.trades.join(", ")],
    ...(row.other_trade ? [["Weitere Leistungen", row.other_trade]] : []),
    ["Einsatzgebiet", row.service_area],
    [
      "Betriebsstruktur",
      row.workforce === "solo"
        ? "Einzelunternehmen ohne Beschäftigte"
        : "Betrieb mit Beschäftigten",
    ],
    ["Verfügbare Teamgröße", `${row.team_size} ${row.team_size === 1 ? "Person" : "Personen"}`],
    ["Verfügbarkeit", partnerAvailability(row)],
    ["Weitere Nachunternehmen", row.uses_subcontractors ? "Ja" : "Nein"],
  ];
  return (
    <>
      <DialogTitle className="pr-6 text-2xl break-words">{row.company_name}</DialogTitle>
      <DialogDescription>
        {submissionTicket(row.id, "partner", row)} · Eingegangen am {date(row.created_at)}
      </DialogDescription>
      <label className="text-sm font-medium">
        Bearbeitungsstatus
        <select
          value={row.status}
          disabled={busy}
          onChange={(e) =>
            void action(async () => {
              await update({ data: { id: row.id, status: e.target.value as PartnerStatus } });
              setNotice("Status gespeichert.");
            })
          }
          className="mt-2 block w-full rounded-xl border border-brand/20 p-3"
        >
          {Object.entries(PARTNER_STATUSES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4 py-3">
        {info.map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="text-xs text-brand/60">{label}</dt>
            <dd className="mt-1 text-sm font-medium break-words">{value}</dd>
          </div>
        ))}
      </dl>
      {row.message && (
        <div>
          <h3 className="font-semibold text-sm">Nachricht</h3>
          <p className="mt-2 text-sm whitespace-pre-wrap break-words">{row.message}</p>
        </div>
      )}
      {(
        [
          {
            kind: "tax",
            title: "Freistellungsbescheinigung § 48b EStG",
            until: row.certificate_valid_until,
          },
          {
            kind: "vat",
            title: "Nachweis § 13b UStG (USt 1 TG)",
            until: row.vat_certificate_valid_until,
          },
        ] as const
      ).map(({ kind, title, until }) => (
        <section key={kind} className="rounded-xl bg-brand/5 p-4" aria-label={title}>
          <h3 className="flex items-center gap-2 font-semibold">
            <FileCheck2 className="h-5 w-5 shrink-0" />
            {title}
          </h3>
          <p className={`mt-2 text-sm ${!until || until < berlinToday() ? "text-red-700" : ""}`}>
            {until
              ? `${until < berlinToday() ? "Abgelaufen am" : "Angegebenes Gültigkeitsdatum:"} ${date(until)}`
              : "Noch nicht eingereicht."}
          </p>
          <p className="mt-2 text-xs text-brand/70">
            Datum und Inhalt sind Angaben des Betriebs. Echtheit und Gültigkeit vor einem Einsatz
            prüfen.
          </p>
          {until && (
            <button
              className="mt-3 min-h-10 text-sm font-semibold underline disabled:opacity-50"
              disabled={busy}
              onClick={() =>
                void action(async () => {
                  const result = await sign({ data: { id: row.id, kind } });
                  setDownload((current) => ({ ...current, [kind]: result.url }));
                })
              }
            >
              Geschützten Download vorbereiten
            </button>
          )}
          {download[kind] && (
            <a
              className="block mt-2 text-sm font-semibold underline"
              href={download[kind]}
              target="_blank"
              rel="noopener noreferrer"
            >
              PDF herunterladen · Link 10 Minuten gültig
            </a>
          )}
        </section>
      ))}
      <p className="text-xs text-brand/70">
        Die Nachweise ersetzen keine Prüfung der steuerlichen Behandlung des konkreten Auftrags
        durch die Buchhaltung.
      </p>
      <label className="text-sm font-semibold">
        Interne Notizen
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={20000}
          rows={4}
          className="mt-2 w-full rounded-xl border border-brand/20 p-3 font-normal"
        />
      </label>
      <button
        className="self-start rounded-full bg-brand text-white px-5 py-3 text-sm disabled:opacity-50"
        disabled={busy}
        onClick={() =>
          void action(async () => {
            const result = await save({
              data: { table: "partner_applications", id: row.id, notes, version },
            });
            setVersion(result.version);
            setNotice("Notizen gespeichert.");
          })
        }
      >
        Notizen speichern
      </button>
      <SubmissionNotification
        key={`${row.notification_sent_at}-${row.customer_confirmation_sent_at}`}
        id={row.id}
        ticket={row}
        table="partner_applications"
        sentAt={row.notification_sent_at}
        deliveryStatus={row.notification_status}
        customerRequestedAt={row.customer_confirmation_requested_at}
        customerSentAt={row.customer_confirmation_sent_at}
        customerDeliveryStatus={row.customer_confirmation_status}
      />
      {(!row.notification_sent_at || !row.customer_confirmation_sent_at) && (
        <button
          disabled={busy}
          className="text-sm underline text-left min-h-11 disabled:opacity-50"
          onClick={() =>
            void action(async () => {
              const result = await retry({ data: { id: row.id } });
              setNotice(
                result.sent && result.confirmationSent
                  ? "Beide E-Mails wurden vom Versanddienst angenommen."
                  : "Mindestens eine E-Mail ist weiter ausstehend. Bitte Versandkonfiguration und Wiederholungszeitraum prüfen.",
              );
            })
          }
        >
          Ausstehende E-Mails erneut versuchen
        </button>
      )}
      {notice && (
        <p role="status" className="text-sm text-brand">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <DeleteSubmission
        table="partner_applications"
        id={row.id}
        onDeleted={() => {
          onDeleted();
          void refresh();
        }}
      />
    </>
  );
}
