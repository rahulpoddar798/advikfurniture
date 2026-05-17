const DEFAULT_PRODUCTION_URL = "https://advikfurniture.vercel.app";
const LOCAL_URL = "http://localhost:3000";

function withProtocol(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function normalizeUrl(url: string) {
  return withProtocol(url).replace(/\/+$/, "");
}

export function getSiteUrl() {
  const configuredUrl = process.env.NODE_ENV === "production"
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.VERCEL_URL ||
      process.env.AUTH_URL ||
      process.env.NEXTAUTH_URL
    : process.env.NEXT_PUBLIC_APP_URL ||
      process.env.AUTH_URL ||
      process.env.NEXTAUTH_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.VERCEL_URL;

  if (configuredUrl) {
    return normalizeUrl(configuredUrl);
  }

  return process.env.NODE_ENV === "production" ? DEFAULT_PRODUCTION_URL : LOCAL_URL;
}

export const siteUrl = getSiteUrl();
