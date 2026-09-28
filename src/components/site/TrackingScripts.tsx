import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getTrackingSettings } from "@/lib/tracking.functions";
import { readConsent, type Consent } from "@/lib/consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function injectScript(id: string, src: string, async = true) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.async = async;
  s.src = src;
  document.head.appendChild(s);
}

function injectInline(id: string, code: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.innerHTML = code;
  document.head.appendChild(s);
}

export function TrackingScripts() {
  const fetchSettings = useServerFn(getTrackingSettings);
  const { data: settings } = useQuery({
    queryKey: ["tracking-settings"],
    queryFn: () => fetchSettings(),
    staleTime: 5 * 60_000,
  });

  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    setConsent(readConsent());
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Consent>).detail;
      setConsent(detail ?? readConsent());
    };
    window.addEventListener("loni:consent-updated", handler);
    const onStorage = () => setConsent(readConsent());
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("loni:consent-updated", handler);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (!settings || !consent || consent.version !== settings.consentVersion) return;
    if (typeof window === "undefined") return;

    // Statistik
    if (consent.analytics) {
      if (settings.ga4) {
        injectScript("ga4-src", `https://www.googletagmanager.com/gtag/js?id=${settings.ga4}`);
        injectInline(
          "ga4-init",
          `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${settings.ga4}',{anonymize_ip:${settings.anonymizeIp}});`,
        );
      }
      if (settings.gtm) {
        injectInline(
          "gtm-init",
          `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${settings.gtm}');`,
        );
      }
      if (settings.customHead) {
        injectInline("custom-head", settings.customHead);
      }
    }

    // Marketing
    if (consent.marketing) {
      if (settings.metaPixel) {
        injectInline(
          "meta-pixel",
          `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${settings.metaPixel}');fbq('track','PageView');`,
        );
      }
      if (settings.linkedinId) {
        injectInline(
          "linkedin-insight",
          `_linkedin_partner_id="${settings.linkedinId}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s)})(window.lintrk);`,
        );
      }
      if (settings.tiktokId) {
        injectInline(
          "tiktok-pixel",
          `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${settings.tiktokId}');ttq.page();}(window,document,'ttq');`,
        );
      }
    }
  }, [settings, consent]);

  return null;
}
