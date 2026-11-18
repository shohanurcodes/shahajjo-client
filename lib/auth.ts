
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import {
  getSocialProviderConfig,
  type SocialProvider,
} from "@/lib/social-providers";

const mongoUri =
  process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";

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
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL;

const derivedBaseUrl =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (vercelHost
    ? `https://${vercelHost}`
    : "http://localhost:3000");

const socialProviders: Partial<
  Record<SocialProvider, { clientId: string; clientSecret: string }>
> = {};

for (const provider of ["github", "google"] as const) {
  const config = getSocialProviderConfig(provider);

  if (config) {
    socialProviders[provider] = config;
  }
}

export const auth = betterAuth({
  appName: "Sahajjo",

  baseURL: derivedBaseUrl,

  secret:
    process.env.BETTER_AUTH_SECRET ??
    "development-only-secret-please-set-better-auth-secret",

  database: mongodbAdapter(db, {
    client: mongoClient,
    transaction: false,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    requireEmailVerification: false,
    autoSignIn: true,
  },

  // Google and GitHub account linking.
  // Email verification is intentionally disabled for password accounts, so
  // implicit linking relies on the verified email from the trusted OAuth
  // provider instead. Different emails still cannot be linked.
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
      allowDifferentEmails: false,
      requireLocalEmailVerified: false,
    },
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
