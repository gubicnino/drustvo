/*
  Create or print an admin user record with a bcrypt password hash.

  Usage:
    npx tsx scripts/create-user.ts <username> <password>

  Prints a JSON entry you can paste into content/users.json. If content/users.json
  does not yet exist, it is created with this single user.
*/
import bcrypt from "bcryptjs";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

async function main() {
  const [username, password] = process.argv.slice(2);
  if (!username || !password) {
    console.error("Uporaba: npx tsx scripts/create-user.ts <uporabnisko-ime> <geslo>");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: randomUUID(), username, passwordHash, role: "admin" as const };

  const file = path.join(process.cwd(), "content", "users.json");
  let users: Array<typeof user> = [];
  try {
    const raw = await fs.readFile(file, "utf8");
    users = (JSON.parse(raw).users ?? []).filter(
      (u: { username: string }) => u.username !== username,
    );
  } catch {
    // file doesn't exist yet
  }
  users.push(user);

  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify({ users }, null, 2) + "\n", "utf8");

  console.log(`\n✓ Uporabnik "${username}" shranjen v content/users.json\n`);
  console.log(JSON.stringify(user, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
