import { env } from "./env";

export interface EmailMessage {
  to: string;
  from?: { email: string; name?: string };
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export type EmailSender = (message: EmailMessage) => Promise<unknown>;

let registeredSender: EmailSender | null = null;

/**
 * Register the runtime email sender. The host (e.g. the Cloudflare Worker)
 * wires its `send_email` binding here; the package stays provider-agnostic.
 */
export function setEmailSender(sender: EmailSender | null): void {
  registeredSender = sender;
}

export const emailFrom = env.emailFrom;

const logEmail = (message: EmailMessage, from: string): void => {
  const body = message.text ?? message.html ?? "";
  console.log(
    `[email] ${message.subject}\nFrom: ${from}\nTo: ${message.to}\n\n${body}`,
  );
};

/**
 * Send a transactional email. Uses the registered sender when `EMAIL_MODE` is
 * "send"; otherwise falls back to logging the rendered email so flows work in
 * local dev with no email provider configured.
 */
export async function sendEmail(message: EmailMessage): Promise<void> {
  const from = message.from ?? { email: emailFrom };
  if (env.emailMode === "send" && registeredSender) {
    await registeredSender({ ...message, from });
    return;
  }
  logEmail(message, from.email);
}
