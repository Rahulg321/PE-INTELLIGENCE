import { createAuthClient } from "better-auth/react";
import { cookiePrefix } from "./cookies";

/** Absent when this module is evaluated outside a browser (SSR/build), where the client falls back to a relative baseURL. */
const browserWindow: Window | undefined = globalThis.window;

export const authClient = createAuthClient({
  baseURL: browserWindow?.location.origin,
  cookiePrefix,
});

export const {
  getSession,
  signIn,
  signOut,
  signUp,
  useSession,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
  changePassword,
  changeEmail,
  updateUser,
  listAccounts,
  unlinkAccount,
  revokeSession,
  revokeOtherSessions,
} = authClient;

export type { Session, SessionUser } from "./auth";
