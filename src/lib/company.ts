export const company = {
  name: "Loni GalaBau GmbH",
  street: "Auf der Roos 3",
  city: "65795 Hattersheim am Main",
  phone: "06190 9266134",
  phoneHref: "tel:+4961909266134",
  email: "info@loni-galabau.de",
  hours: "Montag–Freitag, 7–18 Uhr",
  register: "HRB 125735",
  court: "Amtsgericht Frankfurt am Main",
  director: "Valon Sinanaj",
};
export const siteOrigin = (
  import.meta.env.VITE_SITE_URL || "https://loni-galabau.serhad1999.chatgpt.site"
).replace(/\/$/, "");
export const absoluteUrl = (path: string) => new URL(path, `${siteOrigin}/`).href;
