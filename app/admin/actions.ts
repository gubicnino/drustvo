"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/validation/schemas";
import { getUserByUsername } from "@/lib/content/users-repo";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Vnesite uporabniško ime in geslo." };
  }

  const user = await getUserByUsername(parsed.data.username);
  const ok = user && (await verifyPassword(parsed.data.password, user.passwordHash));

  if (!user || !ok) {
    return { error: "Napačno uporabniško ime ali geslo." };
  }

  await createSession({ userId: user.id, username: user.username, role: "admin" });
  redirect("/admin/dashboard");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin");
}
