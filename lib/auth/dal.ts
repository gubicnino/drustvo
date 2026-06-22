import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession, type SessionPayload } from "@/lib/auth/session";

/**
 * Verify the current session. Redirects to the login page when unauthenticated.
 * Memoized per request via React cache().
 */
export const verifySession = cache(async (): Promise<SessionPayload> => {
  const session = await getSession();
  if (!session?.userId) {
    redirect("/admin");
  }
  return session;
});

/** Returns the session or null without redirecting. */
export const getOptionalSession = cache(async (): Promise<SessionPayload | null> => {
  return getSession();
});
