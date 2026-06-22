import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getFile, putFile, utf8ToBase64 } from "@/lib/content/github";

const isProd = process.env.NODE_ENV === "production";
const root = process.cwd();

/**
 * Fresh read of a content file (admin source of truth).
 * Prod: read from GitHub so editors see their latest commits before redeploy.
 * Dev: read from local disk.
 */
export async function readJsonFresh<T>(repoPath: string): Promise<T> {
  if (isProd) {
    return JSON.parse(await getFile(repoPath)) as T;
  }
  const raw = await fs.readFile(path.join(root, repoPath), "utf8");
  return JSON.parse(raw) as T;
}

/** Env-aware write. Dev: local disk. Prod: commit to GitHub. */
export async function writeJson(repoPath: string, data: unknown, message: string): Promise<void> {
  const content = JSON.stringify(data, null, 2) + "\n";
  if (isProd) {
    await putFile(repoPath, utf8ToBase64(content), message);
  } else {
    await fs.writeFile(path.join(root, repoPath), content, "utf8");
  }
}

/** Write a binary asset (uploaded image). Dev: local disk. Prod: commit to GitHub. */
export async function writeBinary(
  repoPath: string,
  bytes: Buffer,
  message: string,
): Promise<void> {
  if (isProd) {
    await putFile(repoPath, bytes.toString("base64"), message);
  } else {
    const abs = path.join(root, repoPath);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, bytes);
  }
}
