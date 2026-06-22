import "server-only";
import { readJsonFresh } from "@/lib/content/storage";
import type { UserRecord } from "@/lib/validation/schemas";

const USERS_PATH = "content/users.json";

interface UsersFile {
  users: UserRecord[];
}

export async function getUserByUsername(username: string): Promise<UserRecord | null> {
  const file = await readJsonFresh<UsersFile>(USERS_PATH);
  return file.users.find((u) => u.username === username) ?? null;
}
