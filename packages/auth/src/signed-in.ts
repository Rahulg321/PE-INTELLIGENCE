import type { User } from "better-auth";

/** The account a completed sign-in belongs to, as Better Auth resolved it. */
export type SignedInUser = User;

export type SignedInHandler = (user: SignedInUser) => Promise<void> | void;

const handlers = new Set<SignedInHandler>();

export const notifySignedIn = async (user: SignedInUser): Promise<void> => {
  await Promise.allSettled(
    [...handlers].map(async (handler) => {
      try {
        await handler(user);
      } catch {
        // per-handler error isolation
      }
    }),
  );
};
