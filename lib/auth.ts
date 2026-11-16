import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const mongoClient = new MongoClient(mongoUri, { maxPoolSize: 10 });
const db = mongoClient.db(process.env.DB_NAME ?? "sahajjo");

const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

export const auth = betterAuth({
  appName: "Sahajjo",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
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
  socialProviders: googleEnabled
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
      }
    : {},
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: Array.from(
    new Set(
      [
        "http://localhost:3000",
        process.env.BETTER_AUTH_URL,
        process.env.NEXT_PUBLIC_APP_URL,
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
