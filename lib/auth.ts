import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";

declare global {
  var _mongoClient: MongoClient | undefined;
}

const mongoClient =
  globalThis._mongoClient ??
  new MongoClient(mongoUri, { maxPoolSize: 10 });

if (process.env.NODE_ENV !== "production") {
  globalThis._mongoClient = mongoClient;
}

const db = mongoClient.db(process.env.DB_NAME ?? "sahajjo");

const vercelHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const derivedBaseUrl =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");

// Detect GitHub OAuth credentials (supports explicit GITHUB_* or GOOGLE_* if user put GitHub Ov23 credentials there)
const githubClientId =
  process.env.GITHUB_CLIENT_ID ||
  (process.env.GOOGLE_CLIENT_ID?.startsWith("Ov23")
    ? process.env.GOOGLE_CLIENT_ID
    : undefined);
const githubClientSecret =
  process.env.GITHUB_CLIENT_SECRET ||
  (process.env.GOOGLE_CLIENT_ID?.startsWith("Ov23")
    ? process.env.GOOGLE_CLIENT_SECRET
    : undefined);

const githubEnabled = Boolean(githubClientId && githubClientSecret);

const googleClientId = !process.env.GOOGLE_CLIENT_ID?.startsWith("Ov23")
  ? process.env.GOOGLE_CLIENT_ID
  : undefined;
const googleClientSecret = !process.env.GOOGLE_CLIENT_ID?.startsWith("Ov23")
  ? process.env.GOOGLE_CLIENT_SECRET
  : undefined;

const googleEnabled = Boolean(googleClientId && googleClientSecret);

const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};
if (githubEnabled && githubClientId && githubClientSecret) {
  socialProviders.github = {
    clientId: githubClientId,
    clientSecret: githubClientSecret,
  };
}
if (googleEnabled && googleClientId && googleClientSecret) {
  socialProviders.google = {
    clientId: googleClientId,
    clientSecret: googleClientSecret,
  };
}

export const auth = betterAuth({
  appName: "Sahajjo",
  baseURL: derivedBaseUrl,
  secret:
    process.env.BETTER_AUTH_SECRET ??
    "development-only-secret-please-set-better-auth-secret",
  database: mongodbAdapter(db, { client: mongoClient, transaction: false }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    requireEmailVerification: false,
    autoSignIn: true,
  },
  socialProviders,
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: Array.from(
    new Set(
      [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        derivedBaseUrl,
        process.env.BETTER_AUTH_URL,
        process.env.NEXT_PUBLIC_APP_URL,
        "https://shahajjo-client.vercel.app",
        vercelHost ? `https://${vercelHost}` : undefined,
      ].filter((origin): origin is string => Boolean(origin)),
    ),
  ),
  plugins: [
    jwt({
      jwt: {
        issuer: "sahajjo-client",
        audience: "sahajjo-api",
        expirationTime: "1h",
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image ?? undefined,
        }),
      },
      jwks: {
        keyPairConfig: { alg: "EdDSA" },
      },
    }),
  ],
});
