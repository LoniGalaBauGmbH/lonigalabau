const PARTNERS = [
  {
    src: "/images/partner/creditreform.svg",
    name: "Creditreform",
    label: "Partner",
    detail: "Creditreform",
  },
  {
    src: "/images/partner/svlfg.svg",
    name: "SVLFG",
    label: "Mitglied",
    detail: "Sozialversicherung für Landwirtschaft, Forsten und Gartenbau",
  },
  {
    src: "/images/partner/gartenverband.svg",
    name: "Fachverband Garten-, Landschafts- und Sportplatzbau",
    label: "Partner im Fachverband",
    detail: "Garten-, Landschafts- und Sportplatzbau",
  },
  {
    src: "/images/partner/zertifizierung-bau.svg",
    name: "Zertifizierung Bau GmbH",
    label: "Partner",
    detail: "Zertifizierung Bau GmbH",
  },
];

export function Awards() {
  return (
    <section className="bg-surface" aria-labelledby="partner-heading">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="text-center mb-12">
          <span className="eyebrow text-brand/75">Gut verbunden</span>
          <h2
            id="partner-heading"
            className="display text-[clamp(1.75rem,3.5vw,2.75rem)] mt-5 text-brand scroll-mt-32"
          >
            Partner & Mitgliedschaften.
          </h2>
        </div>
        <div className="grid gap-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {PARTNERS.map((p) => (
            <div key={p.src} className="text-center flex flex-col items-center">
              <div className="h-32 w-full flex items-center justify-center mb-6">
                <img
                  src={p.src}
                  alt={p.name}
                  width={240}
                  height={96}
                  loading="lazy"
                  className={
                    "w-auto max-w-[min(240px,100%)] object-contain " +
                    (p.src.endsWith("zertifizierung-bau.svg") ? "h-32" : "h-24")
                  }
                />
              </div>
              <p className="font-display font-bold text-brand">{p.label}</p>
              <p className="mt-2 text-sm text-foreground/75 max-w-[260px] leading-relaxed">
                {p.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
