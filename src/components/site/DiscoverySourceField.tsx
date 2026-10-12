import { useId } from "react";
import { DISCOVERY_SOURCES, DISCOVERY_SOURCE_LABELS } from "@/lib/lead-qualification";

export function DiscoverySourceField({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-brand">
        Wie wurden Sie auf uns aufmerksam? <span className="font-normal">(freiwillig)</span>
      </label>
      <select
        id={id}
        name="discoverySource"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        aria-describedby={`${id}-hint`}
        className="w-full rounded-xl border border-brand/20 bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-60"
      >
        <option value="">Keine Angabe</option>
        {DISCOVERY_SOURCES.map((source) => (
          <option key={source} value={source}>
            {DISCOVERY_SOURCE_LABELS[source]}
          </option>
        ))}
      </select>
      <p id={`${id}-hint`} className="text-xs leading-relaxed text-foreground/65">
        Ihre freiwillige Angabe hilft uns, Anfragen besser einzuordnen. Dafür verwenden wir kein
        Browsertracking.
      </p>
    </div>
  );
}
