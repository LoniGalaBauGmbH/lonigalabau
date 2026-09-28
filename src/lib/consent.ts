export type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  version: number;
  ts: number;
};

const STORAGE_KEY = "loni.cookieConsent.v1";
const CONSENT_EVENT = "loni:consent-updated";

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Consent) : null;
    return parsed &&
      parsed.necessary === true &&
      typeof parsed.analytics === "boolean" &&
      typeof parsed.marketing === "boolean" &&
      Number.isInteger(parsed.version)
      ? parsed
      : null;
  } catch {
    return null;
  }
}

export function writeConsent(c: Consent) {
  const previous = readConsent();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: c }));
    if ((previous?.analytics && !c.analytics) || (previous?.marketing && !c.marketing)) {
      window.gtag?.("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      window.fbq?.("consent", "revoke");
      for (const cookie of document.cookie.split(";")) {
        const name = cookie.split("=")[0].trim();
        if (!/^(_ga|_gid|_gat|_gcl|_fbp|_fbc|_ttp|li_)/.test(name)) continue;
        document.cookie = name + "=; Max-Age=0; path=/";
        const parts = location.hostname.split(".");
        for (let i = 0; i < parts.length - 1; i++)
          document.cookie = name + "=; Max-Age=0; path=/; domain=." + parts.slice(i).join(".");
      }
      window.location.reload();
    }
  } catch {
    /* Keep optional scripts disabled when storage is unavailable. */
  }
}
