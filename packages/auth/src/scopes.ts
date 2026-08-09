export const identityScope = "openid email profile";

export const syncScopes = ["https://www.googleapis.com/auth/calendar.readonly"];

export const googleScopes = [identityScope, ...syncScopes];

export const parseScopes = (scopes: string | null | undefined): string[] =>
  (scopes ?? "")
    .split(" ")
    .map((scope) => scope.trim())
    .filter(Boolean);

export const hasSyncScopes = (scopes: string | null | undefined): boolean =>
  parseScopes(scopes).some((scope) => syncScopes.includes(scope));

export const needsGoogleGrant = (userScopes: string | null | undefined): boolean =>
  !syncScopes.every((scope) => parseScopes(userScopes).includes(scope));

export const signsInWithGoogle = (account: {
  providerId?: string | null;
  scope?: string | null;
}): boolean =>
  account.providerId === "google" && hasSyncScopes(account.scope);
