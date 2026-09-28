import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useSiteImages } from "@/hooks/useSiteImages";
import { createContactRequest, publicUploadFile } from "@/lib/site.functions";
import { ArrowRight, ArrowLeft, Check, Upload, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/konfigurator")({
  head: () => ({
    meta: [
      { title: "Gartenplaner – Loni Galabau GmbH" },
      {
        name: "description",
        content:
          "Konfigurieren Sie Ihr Gartenprojekt in wenigen Schritten. Zaunbau, Pflasterarbeiten, Rollrasen oder Bewässerung – direkt zum Vorab-Angebot.",
      },
    ],
  }),
  component: ConfiguratorPage,
});

// ─── Types ────────────────────────────────────────────────────────────────────

type ServiceType =
  | "zaunbau"
  | "pflasterarbeiten"
  | "rollrasen"
  | "gartengestaltung"
  | "bewaesserung";

interface Cfg {
  service: ServiceType | "";
  // Zaunbau
  fenceType: string;
  fenceLength: string;
  fenceHeight: string;
  fenceColor: string;
  fenceGate: string;
  // Pflaster
  pavingUsage: string;
  pavingArea: string;
  pavingMaterial: string;
  pavingExcavation: boolean;
  // Rollrasen
  lawnArea: string;
  lawnQuality: string;
  lawnRemoval: boolean;
  lawnMoleNet: boolean;
  // Gestaltung
  gardenArea: string;
  gardenState: string;
  gardenStyle: string;
  // Bewässerung
  irrigationArea: string;
  irrigationSource: string;
  irrigationControl: string;
  // Gegebenheiten
  soilCondition: string;
  gradient: string;
  machineryAccess: string;
  uploadedImages: { path: string; url: string }[];
  // Kontakt
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  timeframe: string;
  extraNotes: string;
}

const init: Cfg = {
  service: "",
  fenceType: "Doppelstabmatte",
  fenceLength: "",
  fenceHeight: "1.83m",
  fenceColor: "Anthrazit RAL 7016",
  fenceGate: "Kein Tor",
  pavingUsage: "Terrasse",
  pavingArea: "",
  pavingMaterial: "Betonstein-Pflaster",
  pavingExcavation: true,
  lawnArea: "",
  lawnQuality: "Sport & Spielrasen",
  lawnRemoval: true,
  lawnMoleNet: false,
  gardenArea: "",
  gardenState: "Neubau-Rohzustand",
  gardenStyle: "Modern & Minimalistisch",
  irrigationArea: "",
  irrigationSource: "Außenwasseranschluss",
  irrigationControl: "Smart-Control (App)",
  soilCondition: "Normaler Mutterboden",
  gradient: "Flaches Gelände",
  machineryAccess: "Breite Zufahrt > 2m",
  uploadedImages: [],
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  timeframe: "In 1-3 Monaten",
  extraNotes: "",
};

// ─── Services ────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: "zaunbau" as ServiceType,
    title: "Zaunbau & Sichtschutz",
    desc: "Doppelstabmatte, Holz, WPC oder Aluminium inkl. Toranlagen",
    emoji: "🏗️",
  },
  {
    id: "pflasterarbeiten" as ServiceType,
    title: "Pflaster- & Steinarbeiten",
    desc: "Terrassen, PKW-Einfahrten & Gartenwege professionell gepflastert",
    emoji: "🧱",
  },
  {
    id: "rollrasen" as ServiceType,
    title: "Rollrasen & Bepflanzung",
    desc: "Satter grüner Rasen mit Untergrund-Präparation & Bepflanzung",
    emoji: "🌿",
  },
  {
    id: "gartengestaltung" as ServiceType,
    title: "Gartengestaltung & Neuanlage",
    desc: "Ganzheitliche Neuplanung, Modellierung & Premium Bepflanzung",
    emoji: "🌳",
  },
  {
    id: "bewaesserung" as ServiceType,
    title: "Bewässerungsanlagen",
    desc: "Automatische Drip & Regnersysteme mit App-Steuerung",
    emoji: "💧",
  },
];

// ─── Section structure for sidebar ───────────────────────────────────────────

const SECTIONS = [
  { key: "dienst", label: "Dienstleistung", questions: 1 },
  { key: "details", label: "Projekt-Details", questions: 5 },
  { key: "vor-ort", label: "Vor Ort", questions: 3 },
  { key: "kontakt", label: "Kontakt", questions: 4 },
];

// Total question count
const TOTAL_QUESTIONS = 13;

// ─── Circular Progress SVG ────────────────────────────────────────────────────

function CircleProgress({ percent }: { percent: number }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
      <svg width="96" height="96" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="48" cy="48" r={r} fill="none" stroke="#e8ede9" strokeWidth="6" />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="var(--brand, #2d5a27)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-xl font-bold text-brand" style={{ lineHeight: 1 }}>
          {Math.round(percent)}
        </span>
        <span className="text-xs text-brand">%</span>
      </div>
    </div>
  );
}

// ─── Underline Input ──────────────────────────────────────────────────────────

function UInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 flex-1 min-w-0">
      <label className="text-xs text-gray-400 font-medium tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="border-0 border-b-2 border-gray-200 focus:border-brand outline-none bg-transparent text-lg font-medium text-gray-800 pb-2 placeholder:text-gray-300 transition-colors"
      />
    </div>
  );
}

// ─── Underline Select ─────────────────────────────────────────────────────────

function USelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1 flex-1 min-w-0">
      <label className="text-xs text-gray-400 font-medium tracking-wide">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-0 border-b-2 border-gray-200 focus:border-brand outline-none bg-transparent text-base font-medium text-gray-800 pb-2 transition-colors cursor-pointer appearance-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Option Card ──────────────────────────────────────────────────────────────

function OptionCard({
  emoji,
  title,
  desc,
  selected,
  onClick,
}: {
  emoji: string;
  title: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 text-center cursor-pointer transition-all duration-200 w-full ${
        selected
          ? "border-brand bg-brand/5 shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 size-6 rounded-full bg-brand flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
        </div>
      )}
      <span className="text-3xl">{emoji}</span>
      <div>
        <p className={`font-semibold text-sm ${selected ? "text-brand" : "text-gray-700"}`}>
          {title}
        </p>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{desc}</p>
      </div>
    </button>
  );
}

// ─── Toggle Card ──────────────────────────────────────────────────────────────

function ToggleCard({
  title,
  desc,
  value,
  onChange,
}: {
  title: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-center justify-between p-4 rounded-xl border-2 text-left w-full transition-all ${
        value ? "border-brand bg-brand/5" : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div>
        <p className={`font-semibold text-sm ${value ? "text-brand" : "text-gray-700"}`}>{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <div
        className={`size-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 transition-all ${
          value ? "border-brand bg-brand" : "border-gray-300"
        }`}
      >
        {value && <Check className="w-3 h-3 text-white stroke-[3]" />}
      </div>
    </button>
  );
}

// ─── Chips ────────────────────────────────────────────────────────────────────

function Chips({
  values,
  onSelect,
  suffix = "",
}: {
  values: string[];
  onSelect: (v: string) => void;
  suffix?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <span className="text-xs text-gray-400 self-center">Vorschläge:</span>
      {values.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onSelect(v)}
          className="px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-600 hover:border-brand hover:text-brand hover:bg-brand/5 transition-all font-medium"
        >
          {v}
          {suffix}
        </button>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function ConfiguratorPage() {
  const sendLead = useServerFn(createContactRequest);
  const { images } = useSiteImages();
  const [question, setQuestion] = useState(1); // 1–13 (or 13 = contact done)
  const [cfg, setCfg] = useState<Cfg>(init);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const totalQ = TOTAL_QUESTIONS;
  const percent = ((question - 1) / totalQ) * 100;

  // Which sidebar section is active
  const sectionIndex = question <= 1 ? 0 : question <= 6 ? 1 : question <= 9 ? 2 : 3;

  const uploadFn = useServerFn(publicUploadFile);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (cfg.uploadedImages.length + files.length > 3) {
      toast.error("Maximal 3 Fotos möglich.");
      return;
    }
    setUploading(true);
    const toastId = "photo-up-cfg";
    toast.loading("Bilder werden hochgeladen...", { id: toastId });
    try {
      const urls = [...cfg.uploadedImages];
      for (const file of Array.from(files)) {
        if (file.size > 10 * 1024 * 1024) {
          toast.warning(`${file.name} ist zu groß (max. 10 MB).`);
          continue;
        }
        const ext = file.name.split(".").pop() || "jpg";
        const path = `conf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        // Convert file to base64 safely
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Lesefehler"));
          reader.readAsDataURL(file);
        });

        const uploaded = await uploadFn({
          data: { bucket: "configurator-images", path, base64, contentType: file.type },
        });
        urls.push(uploaded);
      }
      setCfg((c) => ({ ...c, uploadedImages: urls }));
      toast.success("Foto(s) erfolgreich hochgeladen.", { id: toastId });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload fehlgeschlagen.";
      toast.error(msg, { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  // ── Navigation ─────────────────────────────────────────────────────────────

  const advance = () => {
    // Validation per question
    if (question === 1 && !cfg.service) {
      toast.error("Bitte wählen Sie eine Dienstleistung aus.");
      return;
    }
    if (question === 3 && cfg.service === "zaunbau" && !cfg.fenceLength) {
      toast.error("Bitte Zaunlänge eingeben.");
      return;
    }
    if (question === 3 && cfg.service === "pflasterarbeiten" && !cfg.pavingArea) {
      toast.error("Bitte Fläche eingeben.");
      return;
    }
    if (question === 3 && cfg.service === "rollrasen" && !cfg.lawnArea) {
      toast.error("Bitte Rasenfläche eingeben.");
      return;
    }
    if (question === 3 && cfg.service === "gartengestaltung" && !cfg.gardenArea) {
      toast.error("Bitte Gartengröße eingeben.");
      return;
    }
    if (question === 3 && cfg.service === "bewaesserung" && !cfg.irrigationArea) {
      toast.error("Bitte Fläche eingeben.");
      return;
    }
    if (question === totalQ) {
      handleSubmit();
      return;
    }
    setQuestion((q) => q + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    if (question > 1) setQuestion((q) => q - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!cfg.clientName || !cfg.clientEmail) {
      toast.error("Bitte Name und E-Mail angeben.");
      return;
    }
    const svc = SERVICES.find((s) => s.id === cfg.service);
    let specs = "";
    if (cfg.service === "zaunbau")
      specs = `- Typ: ${cfg.fenceType}\n- Länge: ${cfg.fenceLength} m\n- Höhe: ${cfg.fenceHeight}\n- Farbe: ${cfg.fenceColor}\n- Toranlage: ${cfg.fenceGate}`;
    else if (cfg.service === "pflasterarbeiten")
      specs = `- Nutzung: ${cfg.pavingUsage}\n- Fläche: ${cfg.pavingArea} m²\n- Material: ${cfg.pavingMaterial}\n- Erdarbeiten: ${cfg.pavingExcavation ? "Ja" : "Nein"}`;
    else if (cfg.service === "rollrasen")
      specs = `- Fläche: ${cfg.lawnArea} m²\n- Qualität: ${cfg.lawnQuality}\n- Altrasen: ${cfg.lawnRemoval ? "Ja" : "Nein"}\n- Maulwurfschutz: ${cfg.lawnMoleNet ? "Ja" : "Nein"}`;
    else if (cfg.service === "gartengestaltung")
      specs = `- Fläche: ${cfg.gardenArea} m²\n- Zustand: ${cfg.gardenState}\n- Stil: ${cfg.gardenStyle}`;
    else if (cfg.service === "bewaesserung")
      specs = `- Fläche: ${cfg.irrigationArea} m²\n- Quelle: ${cfg.irrigationSource}\n- Steuerung: ${cfg.irrigationControl}`;

    const imgs =
      cfg.uploadedImages.length > 0
        ? `${cfg.uploadedImages.length} Foto(s) als private Anhänge.`
        : "Keine Fotos.";

    const message = `### Projekt-Konfiguration: ${svc?.title}

#### Spezifikationen
${specs}

#### Gegebenheiten vor Ort
- Boden: ${cfg.soilCondition}
- Gefälle: ${cfg.gradient}
- Maschinenzugang: ${cfg.machineryAccess}

#### Zeitraum: ${cfg.timeframe}

#### Fotos
${imgs}

${cfg.extraNotes ? `#### Anmerkungen\n${cfg.extraNotes}` : ""}`;

    setSubmitting(true);
    try {
      await sendLead({
        data: {
          name: cfg.clientName,
          email: cfg.clientEmail,
          phone: cfg.clientPhone || "",
          subject: `Gartenplaner: ${svc?.title}`,
          message,
          image_paths: cfg.uploadedImages.map((image) => image.path),
        },
      });
      setSuccess(true);
      toast.success("Anfrage erfolgreich übermittelt!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fehler beim Absenden.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="min-h-screen bg-[#f7f8f5] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-lg p-12 max-w-md w-full text-center">
          <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full bg-brand/10 animate-ping"
              style={{ animationDuration: "2s" }}
            />
            <div className="size-16 rounded-full bg-brand/10 flex items-center justify-center text-brand relative">
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
            </div>
          </div>
          <h1 className="font-serif text-2xl font-semibold text-gray-800 mb-3">
            Planung erfolgreich erhalten!
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Wir werten Ihre Konfiguration sofort aus und melden uns innerhalb von 24 Stunden mit
            einer ersten Preisschätzung.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="block bg-brand text-white text-sm font-bold px-6 py-3 rounded-full hover:bg-brand/90 transition"
            >
              Zur Startseite
            </Link>
            <button
              type="button"
              onClick={() => {
                setCfg(init);
                setQuestion(1);
                setSuccess(false);
              }}
              className="text-sm text-gray-500 hover:text-brand transition"
            >
              Neue Planung starten
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render per question ───────────────────────────────────────────────────

  const renderQuestion = () => {
    switch (question) {
      // ── Q1: Service selection ─────────────────────────────────────────────
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Frage 1 / {totalQ}
              </p>
              <h2 className="text-3xl font-bold text-gray-800 leading-tight">
                Was planen Sie in Ihrem Garten?
              </h2>
              <p className="text-gray-400 text-sm mt-2">Wählen Sie das primäre Gewerk aus.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {SERVICES.map((svc) => (
                <OptionCard
                  key={svc.id}
                  emoji={svc.emoji}
                  title={svc.title}
                  desc={svc.desc}
                  selected={cfg.service === svc.id}
                  onClick={() => setCfg((c) => ({ ...c, service: svc.id }))}
                />
              ))}
            </div>
          </div>
        );

      // ── Q2: Material/Type selection ───────────────────────────────────────
      case 2:
        if (!cfg.service) return null;
        if (cfg.service === "zaunbau") {
          const types = [
            "Doppelstabmatte",
            "WPC Sichtschutz",
            "Holzzaun Lärche",
            "Aluminium Sichtschutz",
          ];
          return (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Frage 2 / {totalQ}
                </p>
                <h2 className="text-3xl font-bold text-gray-800 leading-tight">
                  Welches Zaun-Material wünschen Sie?
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {types.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setCfg((c) => ({ ...c, fenceType: t }))}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${cfg.fenceType === t ? "border-brand bg-brand/5" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div
                      className={`size-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${cfg.fenceType === t ? "border-brand bg-brand" : "border-gray-300"}`}
                    >
                      {cfg.fenceType === t && <div className="size-1.5 rounded-full bg-white" />}
                    </div>
                    <span
                      className={`font-medium text-sm ${cfg.fenceType === t ? "text-brand" : "text-gray-700"}`}
                    >
                      {t}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        }
        if (cfg.service === "pflasterarbeiten") {
          const usages = ["Terrasse", "PKW-Stellplatz / Einfahrt", "Gartenweg"];
          return (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Frage 2 / {totalQ}
                </p>
                <h2 className="text-3xl font-bold text-gray-800">Wofür wird die Fläche genutzt?</h2>
              </div>
              <div className="flex flex-col gap-3">
                {usages.map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setCfg((c) => ({ ...c, pavingUsage: u }))}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${cfg.pavingUsage === u ? "border-brand bg-brand/5" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div
                      className={`size-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${cfg.pavingUsage === u ? "border-brand bg-brand" : "border-gray-300"}`}
                    >
                      {cfg.pavingUsage === u && <div className="size-1.5 rounded-full bg-white" />}
                    </div>
                    <span
                      className={`font-medium text-sm ${cfg.pavingUsage === u ? "text-brand" : "text-gray-700"}`}
                    >
                      {u}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        }
        if (cfg.service === "rollrasen") {
          const qualities = ["Sport & Spielrasen", "Premium Zierrasen", "Schattenrasen"];
          return (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Frage 2 / {totalQ}
                </p>
                <h2 className="text-3xl font-bold text-gray-800">
                  Welche Rasenqualität wünschen Sie?
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {qualities.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setCfg((c) => ({ ...c, lawnQuality: q }))}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${cfg.lawnQuality === q ? "border-brand bg-brand/5" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div
                      className={`size-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${cfg.lawnQuality === q ? "border-brand bg-brand" : "border-gray-300"}`}
                    >
                      {cfg.lawnQuality === q && <div className="size-1.5 rounded-full bg-white" />}
                    </div>
                    <span
                      className={`font-medium text-sm ${cfg.lawnQuality === q ? "text-brand" : "text-gray-700"}`}
                    >
                      {q}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        }
        if (cfg.service === "gartengestaltung") {
          const styles = [
            "Modern & Minimalistisch",
            "Rustikal & Naturnah",
            "Asiatischer Zen-Garten",
            "Mediterrane Oase",
          ];
          return (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Frage 2 / {totalQ}
                </p>
                <h2 className="text-3xl font-bold text-gray-800">Welchen Stil bevorzugen Sie?</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {styles.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCfg((c) => ({ ...c, gardenStyle: s }))}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${cfg.gardenStyle === s ? "border-brand bg-brand/5" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div
                      className={`size-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${cfg.gardenStyle === s ? "border-brand bg-brand" : "border-gray-300"}`}
                    >
                      {cfg.gardenStyle === s && <div className="size-1.5 rounded-full bg-white" />}
                    </div>
                    <span
                      className={`font-medium text-sm ${cfg.gardenStyle === s ? "text-brand" : "text-gray-700"}`}
                    >
                      {s}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        }
        if (cfg.service === "bewaesserung") {
          const controls = ["Smart-Control (App)", "Klassische Zeitschaltuhr"];
          return (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Frage 2 / {totalQ}
                </p>
                <h2 className="text-3xl font-bold text-gray-800">
                  Welche System-Steuerung wünschen Sie?
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {controls.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCfg((cfg) => ({ ...cfg, irrigationControl: c }))}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${cfg.irrigationControl === c ? "border-brand bg-brand/5" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div
                      className={`size-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${cfg.irrigationControl === c ? "border-brand bg-brand" : "border-gray-300"}`}
                    >
                      {cfg.irrigationControl === c && (
                        <div className="size-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span
                      className={`font-medium text-sm ${cfg.irrigationControl === c ? "text-brand" : "text-gray-700"}`}
                    >
                      {c}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        }
        return null;

      // ── Q3: Size / Length ─────────────────────────────────────────────────
      case 3:
        return (
          <div className="space-y-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Frage 3 / {totalQ}
              </p>
              {cfg.service === "zaunbau" && (
                <h2 className="text-3xl font-bold text-gray-800">Wie lang soll der Zaun werden?</h2>
              )}
              {cfg.service === "pflasterarbeiten" && (
                <h2 className="text-3xl font-bold text-gray-800">
                  Wie groß ist die zu pflasternde Fläche?
                </h2>
              )}
              {cfg.service === "rollrasen" && (
                <h2 className="text-3xl font-bold text-gray-800">Wie groß ist die Rasenfläche?</h2>
              )}
              {cfg.service === "gartengestaltung" && (
                <h2 className="text-3xl font-bold text-gray-800">Wie groß ist Ihr Garten?</h2>
              )}
              {cfg.service === "bewaesserung" && (
                <h2 className="text-3xl font-bold text-gray-800">
                  Wie groß ist die zu bewässernde Fläche?
                </h2>
              )}
            </div>
            <div className="max-w-sm space-y-3">
              {cfg.service === "zaunbau" && (
                <>
                  <UInput
                    label="Länge in laufenden Metern"
                    value={cfg.fenceLength}
                    onChange={(v) => setCfg((c) => ({ ...c, fenceLength: v }))}
                    type="number"
                    placeholder="z. B. 25"
                    required
                  />
                  <Chips
                    values={["10", "20", "35", "50"]}
                    onSelect={(v) => setCfg((c) => ({ ...c, fenceLength: v }))}
                    suffix=" m"
                  />
                </>
              )}
              {cfg.service === "pflasterarbeiten" && (
                <>
                  <UInput
                    label="Fläche in m²"
                    value={cfg.pavingArea}
                    onChange={(v) => setCfg((c) => ({ ...c, pavingArea: v }))}
                    type="number"
                    placeholder="z. B. 40"
                    required
                  />
                  <Chips
                    values={["20", "40", "75", "120"]}
                    onSelect={(v) => setCfg((c) => ({ ...c, pavingArea: v }))}
                    suffix=" m²"
                  />
                </>
              )}
              {cfg.service === "rollrasen" && (
                <>
                  <UInput
                    label="Fläche in m²"
                    value={cfg.lawnArea}
                    onChange={(v) => setCfg((c) => ({ ...c, lawnArea: v }))}
                    type="number"
                    placeholder="z. B. 120"
                    required
                  />
                  <Chips
                    values={["50", "100", "200", "400"]}
                    onSelect={(v) => setCfg((c) => ({ ...c, lawnArea: v }))}
                    suffix=" m²"
                  />
                </>
              )}
              {cfg.service === "gartengestaltung" && (
                <>
                  <UInput
                    label="Ungefähre Gartengröße in m²"
                    value={cfg.gardenArea}
                    onChange={(v) => setCfg((c) => ({ ...c, gardenArea: v }))}
                    type="number"
                    placeholder="z. B. 250"
                    required
                  />
                  <Chips
                    values={["150", "300", "500", "800"]}
                    onSelect={(v) => setCfg((c) => ({ ...c, gardenArea: v }))}
                    suffix=" m²"
                  />
                </>
              )}
              {cfg.service === "bewaesserung" && (
                <>
                  <UInput
                    label="Fläche in m²"
                    value={cfg.irrigationArea}
                    onChange={(v) => setCfg((c) => ({ ...c, irrigationArea: v }))}
                    type="number"
                    placeholder="z. B. 150"
                    required
                  />
                  <Chips
                    values={["80", "150", "300", "600"]}
                    onSelect={(v) => setCfg((c) => ({ ...c, irrigationArea: v }))}
                    suffix=" m²"
                  />
                </>
              )}
            </div>
          </div>
        );

      // ── Q4: Extra spec ────────────────────────────────────────────────────
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Frage 4 / {totalQ}
              </p>
              {cfg.service === "zaunbau" && (
                <h2 className="text-3xl font-bold text-gray-800">Welche Zaunhöhe wünschen Sie?</h2>
              )}
              {cfg.service === "pflasterarbeiten" && (
                <h2 className="text-3xl font-bold text-gray-800">
                  Welches Pflastermaterial wünschen Sie?
                </h2>
              )}
              {cfg.service === "rollrasen" && (
                <h2 className="text-3xl font-bold text-gray-800">Soll Altrasen entfernt werden?</h2>
              )}
              {cfg.service === "gartengestaltung" && (
                <h2 className="text-3xl font-bold text-gray-800">Wie ist der aktuelle Zustand?</h2>
              )}
              {cfg.service === "bewaesserung" && (
                <h2 className="text-3xl font-bold text-gray-800">
                  Welche Wasserquelle steht bereit?
                </h2>
              )}
            </div>
            <div className="max-w-sm space-y-3">
              {cfg.service === "zaunbau" && (
                <USelect
                  label="Zaun-Höhe"
                  value={cfg.fenceHeight}
                  onChange={(v) => setCfg((c) => ({ ...c, fenceHeight: v }))}
                  options={[
                    "0.83m – Vorgartenzaun",
                    "1.03m",
                    "1.23m",
                    "1.43m",
                    "1.63m",
                    "1.83m – Optimaler Sichtschutz",
                    "2.03m – Maximaler Schutz",
                  ]}
                />
              )}
              {cfg.service === "pflasterarbeiten" && (
                <div className="flex flex-col gap-3">
                  {["Betonstein-Pflaster", "Edles Naturstein-Pflaster", "Klinker-Pflaster"].map(
                    (m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setCfg((c) => ({ ...c, pavingMaterial: m }))}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${cfg.pavingMaterial === m ? "border-brand bg-brand/5" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <div
                          className={`size-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${cfg.pavingMaterial === m ? "border-brand bg-brand" : "border-gray-300"}`}
                        >
                          {cfg.pavingMaterial === m && (
                            <div className="size-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <span
                          className={`font-medium text-sm ${cfg.pavingMaterial === m ? "text-brand" : "text-gray-700"}`}
                        >
                          {m}
                        </span>
                      </button>
                    ),
                  )}
                </div>
              )}
              {cfg.service === "rollrasen" && (
                <div className="space-y-3">
                  <ToggleCard
                    title="Alten Rasen & Unkraut abtragen"
                    desc="Rasenschäler-Einsatz durch den Loni Fuhrpark"
                    value={cfg.lawnRemoval}
                    onChange={(v) => setCfg((c) => ({ ...c, lawnRemoval: v }))}
                  />
                  <ToggleCard
                    title="Maulwurfschutz-Gitter unterlegen"
                    desc="Dauerhafter Schutz gegen Maulwurfhügel"
                    value={cfg.lawnMoleNet}
                    onChange={(v) => setCfg((c) => ({ ...c, lawnMoleNet: v }))}
                  />
                </div>
              )}
              {cfg.service === "gartengestaltung" && (
                <div className="flex flex-col gap-3">
                  {["Neubau-Rohzustand", "Altgarten mit Wildwuchs", "Teil-Renovierung"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setCfg((c) => ({ ...c, gardenState: s }))}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${cfg.gardenState === s ? "border-brand bg-brand/5" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <div
                        className={`size-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${cfg.gardenState === s ? "border-brand bg-brand" : "border-gray-300"}`}
                      >
                        {cfg.gardenState === s && (
                          <div className="size-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span
                        className={`font-medium text-sm ${cfg.gardenState === s ? "text-brand" : "text-gray-700"}`}
                      >
                        {s}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {cfg.service === "bewaesserung" && (
                <div className="flex flex-col gap-3">
                  {["Außenwasseranschluss", "Zisterne / Regenwassertank", "Eigener Brunnen"].map(
                    (s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCfg((c) => ({ ...c, irrigationSource: s }))}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${cfg.irrigationSource === s ? "border-brand bg-brand/5" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <div
                          className={`size-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${cfg.irrigationSource === s ? "border-brand bg-brand" : "border-gray-300"}`}
                        >
                          {cfg.irrigationSource === s && (
                            <div className="size-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <span
                          className={`font-medium text-sm ${cfg.irrigationSource === s ? "text-brand" : "text-gray-700"}`}
                        >
                          {s}
                        </span>
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        );

      // ── Q5: Color / Extras ────────────────────────────────────────────────
      case 5:
        return (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Frage 5 / {totalQ}
              </p>
              {cfg.service === "zaunbau" && (
                <h2 className="text-3xl font-bold text-gray-800">Welche Farbe & Toranlage?</h2>
              )}
              {cfg.service === "pflasterarbeiten" && (
                <h2 className="text-3xl font-bold text-gray-800">Sind Erdarbeiten erforderlich?</h2>
              )}
              {cfg.service !== "zaunbau" && cfg.service !== "pflasterarbeiten" && (
                <h2 className="text-3xl font-bold text-gray-800">
                  Möchten Sie noch etwas ergänzen?
                </h2>
              )}
            </div>
            <div className="max-w-xl space-y-4">
              {cfg.service === "zaunbau" && (
                <div className="max-w-sm space-y-4">
                  <USelect
                    label="Farbwunsch"
                    value={cfg.fenceColor}
                    onChange={(v) => setCfg((c) => ({ ...c, fenceColor: v }))}
                    options={[
                      "Anthrazit RAL 7016",
                      "Moosgrün RAL 6005",
                      "Holz natur",
                      "Silber verzinkt",
                    ]}
                  />
                  <USelect
                    label="Toranlage"
                    value={cfg.fenceGate}
                    onChange={(v) => setCfg((c) => ({ ...c, fenceGate: v }))}
                    options={[
                      "Kein Tor",
                      "Einfach-Tor (1.00m breit)",
                      "Zweiflügel-Tor (3.00m breit)",
                    ]}
                  />
                </div>
              )}
              {cfg.service === "pflasterarbeiten" && (
                <div className="max-w-sm">
                  <ToggleCard
                    title="Erdarbeiten & Aushub erforderlich"
                    desc="Bodenvorbereitung und Schotter-Tragschicht durch den Loni Fuhrpark"
                    value={cfg.pavingExcavation}
                    onChange={(v) => setCfg((c) => ({ ...c, pavingExcavation: v }))}
                  />
                </div>
              )}
              {cfg.service !== "zaunbau" && cfg.service !== "pflasterarbeiten" && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400 font-medium tracking-wide">
                      Anmerkungen & Sonderwünsche (optional)
                    </label>
                    <textarea
                      value={cfg.extraNotes}
                      onChange={(e) => setCfg((c) => ({ ...c, extraNotes: e.target.value }))}
                      placeholder="z. B. besonderer Zugang, Pflanzenwünsche, Terminpräferenzen, Mähkante..."
                      rows={5}
                      className="w-full border-2 border-gray-200 focus:border-brand rounded-xl p-3 outline-none resize-none text-sm text-gray-800 placeholder:text-gray-300 transition-colors"
                    />
                  </div>
                  {/* Suggestions Chips */}
                  <div>
                    <span className="text-xs text-gray-400 font-medium">
                      Häufige Ergänzungen (Klicken zum Hinzufügen):
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cfg.service === "rollrasen" &&
                        [
                          "Mähkante erwünscht",
                          "Maulwurfschutz",
                          "Zusätzliche Beete",
                          "Automatische Bewässerung",
                        ].map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => {
                              setCfg((c) => {
                                const exist = c.extraNotes.trim();
                                if (!exist) return { ...c, extraNotes: chip };
                                if (exist.includes(chip)) return c;
                                return { ...c, extraNotes: `${exist}, ${chip}` };
                              });
                            }}
                            className="px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-600 hover:border-brand hover:text-brand hover:bg-brand/5 transition-all font-medium"
                          >
                            + {chip}
                          </button>
                        ))}
                      {cfg.service === "gartengestaltung" &&
                        [
                          "Lichtkonzept gewünscht",
                          "Terrassen-Neuanlage",
                          "Wasserspiel / Teich",
                          "Sichtschutz-Pflanzen",
                        ].map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => {
                              setCfg((c) => {
                                const exist = c.extraNotes.trim();
                                if (!exist) return { ...c, extraNotes: chip };
                                if (exist.includes(chip)) return c;
                                return { ...c, extraNotes: `${exist}, ${chip}` };
                              });
                            }}
                            className="px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-600 hover:border-brand hover:text-brand hover:bg-brand/5 transition-all font-medium"
                          >
                            + {chip}
                          </button>
                        ))}
                      {cfg.service === "bewaesserung" &&
                        [
                          "Tropfbewässerung für Hecken",
                          "Rasen-Versenkregner",
                          "WLAN-Steuerung",
                          "Regensensor",
                        ].map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => {
                              setCfg((c) => {
                                const exist = c.extraNotes.trim();
                                if (!exist) return { ...c, extraNotes: chip };
                                if (exist.includes(chip)) return c;
                                return { ...c, extraNotes: `${exist}, ${chip}` };
                              });
                            }}
                            className="px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-600 hover:border-brand hover:text-brand hover:bg-brand/5 transition-all font-medium"
                          >
                            + {chip}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      // ── Q6: Soil condition ────────────────────────────────────────────────
      case 6:
        return (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Frage 6 / {totalQ}
              </p>
              <h2 className="text-3xl font-bold text-gray-800">Wie ist die Bodenbeschaffenheit?</h2>
              <p className="text-gray-400 text-sm mt-2">Das beeinflusst den Maschineneinsatz.</p>
            </div>
            <div className="flex flex-col gap-3 max-w-md">
              {[
                "Normaler Mutterboden",
                "Lehmig / Schwerer Boden",
                "Sandig / Lockeres Erdreich",
                "Steinig / Felsig",
                "Unbekannt",
              ].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setCfg((c) => ({ ...c, soilCondition: s }))}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${cfg.soilCondition === s ? "border-brand bg-brand/5" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div
                    className={`size-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${cfg.soilCondition === s ? "border-brand bg-brand" : "border-gray-300"}`}
                  >
                    {cfg.soilCondition === s && <div className="size-1.5 rounded-full bg-white" />}
                  </div>
                  <span
                    className={`font-medium text-sm ${cfg.soilCondition === s ? "text-brand" : "text-gray-700"}`}
                  >
                    {s}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );

      // ── Q7: Gradient / Slope ──────────────────────────────────────────────
      case 7:
        return (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Frage 7 / {totalQ}
              </p>
              <h2 className="text-3xl font-bold text-gray-800">Wie ist das Gelände geneigt?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
              {[
                { id: "Flaches Gelände", label: "Flach", desc: "Kein Gefälle", emoji: "▬" },
                {
                  id: "Leichtes Gefälle",
                  label: "Leichtes Gefälle",
                  desc: "Sanfter Hang",
                  emoji: "⟋",
                },
                {
                  id: "Starke Hanglage",
                  label: "Starke Hanglage",
                  desc: "Stützkonstruktion nötig",
                  emoji: "⛰️",
                },
              ].map((g) => (
                <OptionCard
                  key={g.id}
                  emoji={g.emoji}
                  title={g.label}
                  desc={g.desc}
                  selected={cfg.gradient === g.id}
                  onClick={() => setCfg((c) => ({ ...c, gradient: g.id }))}
                />
              ))}
            </div>
          </div>
        );

      // ── Q8: Machinery access ──────────────────────────────────────────────
      case 8:
        return (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Frage 8 / {totalQ}
              </p>
              <h2 className="text-3xl font-bold text-gray-800">
                Wie breit ist die Maschinenzufahrt?
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Wichtig für unsere Fuhrpark-Planung (Bagger, Lader, LKW).
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
              {[
                {
                  id: "Breite Zufahrt > 2m",
                  label: "Breit (> 2 m)",
                  desc: "Großgeräte möglich",
                  emoji: "🚛",
                },
                {
                  id: "Schmale Zufahrt < 1m",
                  label: "Schmal (< 1 m)",
                  desc: "Nur Minibagger einsetzbar",
                  emoji: "🚜",
                },
                {
                  id: "Keine Zufahrt",
                  label: "Keine Zufahrt",
                  desc: "Reine Handarbeit nötig",
                  emoji: "🪚",
                },
              ].map((a) => (
                <OptionCard
                  key={a.id}
                  emoji={a.emoji}
                  title={a.label}
                  desc={a.desc}
                  selected={cfg.machineryAccess === a.id}
                  onClick={() => setCfg((c) => ({ ...c, machineryAccess: a.id }))}
                />
              ))}
            </div>
          </div>
        );

      // ── Q9: Photo upload ──────────────────────────────────────────────────
      case 9:
        return (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Frage 9 / {totalQ}
              </p>
              <h2 className="text-3xl font-bold text-gray-800">Haben Sie Fotos Ihres Gartens?</h2>
              <p className="text-gray-400 text-sm mt-2">
                Optional – bis zu 3 Fotos helfen uns bei der Vorab-Einschätzung.
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handlePhotoUpload}
              disabled={uploading}
              className="hidden"
            />
            {cfg.uploadedImages.length < 3 && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full max-w-md py-10 rounded-2xl border-2 border-dashed border-gray-300 hover:border-brand hover:bg-brand/5 transition-all flex flex-col items-center gap-3 text-gray-400 hover:text-brand group"
              >
                <div className="size-12 rounded-xl bg-gray-100 group-hover:bg-brand/10 flex items-center justify-center transition-all">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">
                    <span className="underline">Klicken zum Hochladen</span> oder Drag & Drop
                  </p>
                  <p className="text-xs mt-1">
                    {uploading ? "Upload läuft..." : "JPG, PNG, WEBP – max. 10 MB pro Foto"}
                  </p>
                </div>
              </button>
            )}
            {cfg.uploadedImages.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {cfg.uploadedImages.map((image, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={image.url}
                      alt={`Foto ${i + 1}`}
                      className="h-24 w-32 rounded-xl object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setCfg((c) => ({
                          ...c,
                          uploadedImages: c.uploadedImages.filter((_, idx) => idx !== i),
                        }))
                      }
                      className="absolute -top-2 -right-2 size-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      // ── Q10: Name ─────────────────────────────────────────────────────────
      case 10:
        return (
          <div className="space-y-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Frage 10 / {totalQ}
              </p>
              <h2 className="text-3xl font-bold text-gray-800">Wie heißen Sie?</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-8 max-w-lg">
              <UInput
                label="Vorname"
                value={cfg.clientName.split(" ")[0] || ""}
                onChange={(v) =>
                  setCfg((c) => ({
                    ...c,
                    clientName: `${v} ${c.clientName.split(" ").slice(1).join(" ")}`.trim(),
                  }))
                }
                placeholder="Max"
                required
              />
              <UInput
                label="Nachname"
                value={cfg.clientName.split(" ").slice(1).join(" ") || ""}
                onChange={(v) =>
                  setCfg((c) => ({
                    ...c,
                    clientName: `${c.clientName.split(" ")[0] || ""} ${v}`.trim(),
                  }))
                }
                placeholder="Mustermann"
              />
            </div>
          </div>
        );

      // ── Q11: Email ────────────────────────────────────────────────────────
      case 11:
        return (
          <div className="space-y-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Frage 11 / {totalQ}
              </p>
              <h2 className="text-3xl font-bold text-gray-800">Wie lautet Ihre E-Mail-Adresse?</h2>
            </div>
            <div className="max-w-sm">
              <UInput
                label="E-Mail-Adresse"
                value={cfg.clientEmail}
                onChange={(v) => setCfg((c) => ({ ...c, clientEmail: v }))}
                type="email"
                placeholder="max@beispiel.de"
                required
              />
            </div>
          </div>
        );

      // ── Q12: Phone + Timeframe ────────────────────────────────────────────
      case 12:
        return (
          <div className="space-y-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Frage 12 / {totalQ}
              </p>
              <h2 className="text-3xl font-bold text-gray-800">Wie können wir Sie erreichen?</h2>
            </div>
            <div className="flex flex-col gap-8 max-w-md">
              <UInput
                label="Telefonnummer (optional)"
                value={cfg.clientPhone}
                onChange={(v) => setCfg((c) => ({ ...c, clientPhone: v }))}
                type="tel"
                placeholder="+49 170 1234567"
              />
              <USelect
                label="Gewünschter Projektstart"
                value={cfg.timeframe}
                onChange={(v) => setCfg((c) => ({ ...c, timeframe: v }))}
                options={["Schnellstmöglich", "In 1-3 Monaten", "In 3-6 Monaten", "Flexibel"]}
              />
            </div>
          </div>
        );

      // ── Q13: Final notes + confirm ────────────────────────────────────────
      case 13: {
        const svc = SERVICES.find((s) => s.id === cfg.service);
        return (
          <div className="space-y-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Frage 13 / {totalQ}
              </p>
              <h2 className="text-3xl font-bold text-gray-800">Zusammenfassung & Absenden</h2>
              <p className="text-gray-400 text-sm mt-2">
                Überprüfen Sie Ihre Angaben vor dem Absenden.
              </p>
            </div>
            <div className="max-w-md space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 font-medium tracking-wide">
                  Ihre Anmerkungen & Sonderwünsche (optional)
                </label>
                <textarea
                  value={cfg.extraNotes}
                  onChange={(e) => setCfg((c) => ({ ...c, extraNotes: e.target.value }))}
                  placeholder="z. B. besonderer Zugang, Pflanzenwünsche, Terminpräferenzen..."
                  rows={4}
                  className="border-2 border-gray-200 focus:border-brand rounded-xl p-3 outline-none resize-none text-sm text-gray-800 placeholder:text-gray-300 transition-colors"
                />
              </div>
              {/* Summary */}
              <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Ihre Zusammenfassung
                </p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dienstleistung:</span>
                    <span className="font-semibold text-gray-800">{svc?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-semibold text-gray-800">{cfg.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">E-Mail:</span>
                    <span className="font-semibold text-gray-800">{cfg.clientEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Zeitraum:</span>
                    <span className="font-semibold text-gray-800">{cfg.timeframe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fotos:</span>
                    <span className="font-semibold text-gray-800">
                      {cfg.uploadedImages.length} Foto(s)
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-400 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <span className="text-amber-500 mt-0.5">ℹ️</span>
                <span>
                  Dies ist eine unverbindliche Erstanfrage. Vor einem Auftrag findet immer ein
                  kostenloser Vor-Ort-Termin statt.
                </span>
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  // ── Layout ────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: "#f7f8f5",
        fontFamily: "'Inter', 'Archivo', system-ui, sans-serif",
      }}
    >
      {/* ── Left Sidebar ─────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 p-6 fixed top-0 left-0 bottom-0 z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center mb-10">
          <img src={images.logo} alt="Loni Galabau GmbH" className="h-10 w-auto" />
        </Link>

        {/* Circular progress */}
        <div className="flex flex-col items-center mb-8">
          <CircleProgress percent={percent} />
          <p className="text-xs text-gray-400 mt-3">
            {question} / {totalQ} Fragen
          </p>
        </div>

        {/* Section nav */}
        <div className="space-y-1 flex-1">
          {SECTIONS.map((sec, i) => (
            <div
              key={sec.key}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${i === sectionIndex ? "bg-brand/8 border border-brand/20" : ""}`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`size-2 rounded-full ${i < sectionIndex ? "bg-brand" : i === sectionIndex ? "bg-brand" : "bg-gray-300"}`}
                />
                <span
                  className={`text-sm font-medium ${i === sectionIndex ? "text-brand" : i < sectionIndex ? "text-gray-700" : "text-gray-400"}`}
                >
                  {sec.label}
                </span>
              </div>
              {i < sectionIndex && <CheckCircle2 className="w-4 h-4 text-brand" />}
              {i === sectionIndex && (
                <span className="text-xs text-brand font-bold">{sec.questions}</span>
              )}
              {i > sectionIndex && (
                <span className="text-xs text-gray-300 font-medium">{sec.questions}</span>
              )}
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-auto pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 italic leading-relaxed">
            "Ein gepflegter Garten ist die sichtbare Verlängerung Ihres Zuhauses."
          </p>
          <div className="flex items-center gap-2 mt-3">
            <img src={images.logo} alt="Loni Galabau GmbH" className="h-6 w-auto opacity-60" />
          </div>
        </div>
      </aside>

      {/* ── Mobile header ─────────────────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={images.logo} alt="Loni Galabau GmbH" className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {question}/{totalQ}
          </span>
          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="flex-1 lg:ml-64 flex flex-col">
        <div className="flex-1 px-6 sm:px-10 lg:px-16 pt-20 lg:pt-16 pb-32">
          <div className="max-w-2xl mx-auto">{renderQuestion()}</div>
        </div>

        {/* ── Bottom navigation bar ────────────────────────────────────── */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-gray-100 px-6 sm:px-10 lg:px-16 py-4 flex items-center justify-between z-10">
          {question > 1 ? (
            <button
              type="button"
              onClick={back}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </button>
          ) : (
            <Link to="/" className="text-sm text-gray-400 hover:text-brand transition font-medium">
              Abbrechen
            </Link>
          )}

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-300 hidden sm:block">ENTER</span>
            <button
              type="button"
              onClick={advance}
              disabled={submitting}
              className="flex items-center gap-2 bg-brand text-white text-sm font-bold px-7 py-3 rounded-full hover:bg-brand/90 transition-all shadow-sm disabled:opacity-50"
            >
              {question === totalQ
                ? submitting
                  ? "Wird gesendet..."
                  : "Anfrage senden"
                : "Weiter"}
              {question < totalQ && <ArrowRight className="w-4 h-4" />}
              {question === totalQ && !submitting && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
