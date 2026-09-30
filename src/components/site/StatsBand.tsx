const FACTS = [
  { value: "Seit 2011", label: "Im Garten- und Landschaftsbau" },
  { value: "8 Gewerke", label: "Für Gärten und Außenanlagen" },
  { value: "Rhein-Main", label: "Aus Hattersheim am Main" },
  { value: "Persönlich", label: "Von der Anfrage bis zur Umsetzung" },
];

export function StatsBand() {
  return (
    <section aria-label="Loni auf einen Blick" className="bg-brand text-brand-foreground">
      <dl className="max-w-[1480px] mx-auto px-6 md:px-10 py-10 md:py-14 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
        {FACTS.map(({ value, label }) => (
          <div key={value} className="min-w-0">
            <dt className="font-display font-bold text-xl sm:text-2xl xl:text-3xl tracking-tight text-brand-foreground">
              {value}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-brand-foreground/80 max-w-[15rem]">
              {label}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
