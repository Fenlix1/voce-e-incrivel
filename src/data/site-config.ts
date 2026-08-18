import { SITE_CONFIG } from "@/lib/constants";

export function getSiteConfig() {
  if (typeof window === "undefined") return SITE_CONFIG;
  try {
    const stored = localStorage.getItem("site-config");
    if (stored) return { ...SITE_CONFIG, ...JSON.parse(stored) };
  } catch {}
  return SITE_CONFIG;
}

export function setSiteConfig(config: Partial<typeof SITE_CONFIG>) {
  localStorage.setItem("site-config", JSON.stringify(config));
}
