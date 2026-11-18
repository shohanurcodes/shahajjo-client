export type SocialProvider = "github" | "google";

export type SocialProviderConfig = {
  clientId: string;
  clientSecret: string;
};

export type SocialProviderAvailability = Record<SocialProvider, boolean>;

/**
 * Reads the first non-empty value from a list of environment variable names.
 * Hosts use slightly different naming conventions, so accepting the common
 * aliases avoids silently disabling a provider that is actually configured.
 */
function firstEnvValue(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

/**
 * The public flags are optional. They are only needed to hide a provider that
 * has credentials configured. When a flag is missing, credentials become the
 * source of truth so a fresh production deployment does not hide the buttons.
 */
function isProviderEnabled(provider: SocialProvider): boolean {
  const flag =
    provider === "github"
      ? process.env.NEXT_PUBLIC_GITHUB_AUTH_ENABLED
      : process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED;

  if (flag === undefined || flag.trim() === "") return true;
  return flag.trim() === "true";
}

export function getSocialProviderConfig(
  provider: SocialProvider,
): SocialProviderConfig | null {
  if (!isProviderEnabled(provider)) return null;

  const clientId =
    provider === "github"
      ? firstEnvValue(
          "GITHUB_CLIENT_ID",
          "GITHUB_ID",
          "AUTH_GITHUB_ID",
          "NEXT_PUBLIC_GITHUB_CLIENT_ID",
        )
      : firstEnvValue(
          "GOOGLE_CLIENT_ID",
          "GOOGLE_ID",
          "AUTH_GOOGLE_ID",
          "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
        );

  const clientSecret =
    provider === "github"
      ? firstEnvValue(
          "GITHUB_CLIENT_SECRET",
          "GITHUB_SECRET",
          "AUTH_GITHUB_SECRET",
        )
      : firstEnvValue(
          "GOOGLE_CLIENT_SECRET",
          "GOOGLE_SECRET",
          "AUTH_GOOGLE_SECRET",
        );

  if (!clientId || !clientSecret) return null;

  return { clientId, clientSecret };
}

export function getSocialProviderAvailability(): SocialProviderAvailability {
  return {
    github: Boolean(getSocialProviderConfig("github")),
    google: Boolean(getSocialProviderConfig("google")),
  };
}
