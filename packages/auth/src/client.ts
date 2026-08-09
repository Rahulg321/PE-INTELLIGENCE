import { createAuthClient } from "better-auth/react";
import { cookiePrefix } from "./cookies";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
  cookiePrefix,
});

export const { getSession, signIn, signOut, useSession } = authClient;

export type { Session, SessionUser } from "./auth";
