export { auth, authOptions, type Auth, type Session, type SessionUser } from "./auth";
export { authClient, getSession, signIn, signOut, useSession } from "./client";
export { cookiePrefix } from "./cookies";
export { env, isGoogleConfigured } from "./env";
export {
  googleScopes,
  hasSyncScopes,
  identityScope,
  needsGoogleGrant,
  parseScopes,
  signsInWithGoogle,
  syncScopes,
} from "./scopes";
export { notifySignedIn, onSignedIn } from "./signed-in";
