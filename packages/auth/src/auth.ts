import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  db,
  users,
  sessions,
  accounts,
  verifications,
  rateLimits,
} from "db";
import { cookiePrefix } from "./cookies";
import { env, isGoogleConfigured } from "./env";
import { notifySignedIn } from "./signed-in";

export const authOptions: BetterAuthOptions = {
  secret: env.secret,
  baseURL: env.apiUrl,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users,
      sessions,
      accounts,
      verifications,
      rateLimits,
    },
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 256,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  rateLimit: {
    enabled: true,
    storage: "database",
  },
  advanced: {
    cookiePrefix,
    useSecureCookies: env.isProduction,
    ...(env.cookieDomain
      ? {
          crossSubDomainCookies: {
            enabled: true,
            domain: env.cookieDomain,
          },
        }
      : {}),
  },
  trustedOrigins: env.trustedOrigins,
  socialProviders: isGoogleConfigured()
    ? {
        google: {
          clientId: env.googleClientId!,
          clientSecret: env.googleClientSecret!,
        },
      }
    : {},
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          const user = await db.query.users.findFirst({
            where: { id: session.userId },
          });
          if (user) await notifySignedIn(user);
        },
      },
    },
  },
};

export const auth = betterAuth(authOptions);

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
export type SessionUser = Session["user"];
