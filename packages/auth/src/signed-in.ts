import type { User } from "better-auth";

type SignedInHandler = (user: User & Record<string, any>) => Promise<void> | void;

const handlers = new Set<SignedInHandler>();

export const notifySignedIn = async (
  user: User & Record<string, any>,
): Promise<void> => {
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
