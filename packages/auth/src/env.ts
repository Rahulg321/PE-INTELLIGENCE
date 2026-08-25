import "@repo/env/load";

const readOptional = (name: string): string | undefined => {
  const value = process.env[name];
  if (value === undefined || value === "") return undefined;
  return value;
};

const isGoogleConfigured = (): boolean =>
  Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_CLIENT_ID !== "" &&
      process.env.GOOGLE_CLIENT_SECRET !== "",
  );

const apiUrl = readOptional("BETTER_AUTH_URL") ?? "http://localhost:3000";
const appUrls = (readOptional("APP_URL") ?? apiUrl)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const isProduction = process.env.NODE_ENV === "production";
const cookieDomain = readOptional("COOKIE_DOMAIN");
const emailMode: "send" | "log" =
  readOptional("EMAIL_MODE") === "send" ? "send" : "log";
const emailFrom =
  readOptional("EMAIL_FROM") ?? `noreply@${new URL(apiUrl).host}`;

const trustedOrigins = [...new Set([apiUrl, ...appUrls])];

export const env = Object.freeze({
  apiUrl,
  appUrl: appUrls.length > 0 ? appUrls : [apiUrl],
  trustedOrigins,
  isProduction,
  cookieDomain,
  secret: readOptional("BETTER_AUTH_SECRET"),
  googleClientId: readOptional("GOOGLE_CLIENT_ID"),
  googleClientSecret: readOptional("GOOGLE_CLIENT_SECRET"),
  emailMode,
  emailFrom,
});

export { isGoogleConfigured };
