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
 * Credentials are the single source of truth. The old NEXT_PUBLIC_*_AUTH_ENABLED
 * flags are intentionally ignored: they were commonly copied as `false` into
 * production env files and silently hid providers that were fully configured.
 */
export function getSocialProviderConfig(
  provider: SocialProvider,
): SocialProviderConfig | null {
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
