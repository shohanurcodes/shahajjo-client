export type SocialProvider = "github" | "google";

export type SocialProviderConfig = {
  clientId: string;
  clientSecret: string;
};

export type SocialProviderAvailability = Record<SocialProvider, boolean>;

const providerEnabled: Record<SocialProvider, boolean> = {
  github: process.env.NEXT_PUBLIC_GITHUB_AUTH_ENABLED === "true",
  google: process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true",
};

export function getSocialProviderConfig(
  provider: SocialProvider,
): SocialProviderConfig | null {
  if (!providerEnabled[provider]) return null;

  const clientId =
    provider === "github"
      ? process.env.GITHUB_CLIENT_ID
      : process.env.GOOGLE_CLIENT_ID;
  const clientSecret =
    provider === "github"
      ? process.env.GITHUB_CLIENT_SECRET
      : process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) return null;

  return { clientId, clientSecret };
}

export function getSocialProviderAvailability(): SocialProviderAvailability {
  return {
    github: Boolean(getSocialProviderConfig("github")),
    google: Boolean(getSocialProviderConfig("google")),
  };
}
