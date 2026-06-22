import "server-only";

/*
  Minimal GitHub Contents API client using fetch (no Octokit dependency).
  Used ONLY in production to persist writes by committing to the repo.
  In development, storage.ts writes to the local disk instead.
*/

const API = "https://api.github.com";

function repoConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";
  if (!token || !owner || !repo) {
    throw new Error(
      "Manjkajo GitHub spremenljivke (GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO).",
    );
  }
  return { token, owner, repo, branch };
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function currentSha(filePath: string): Promise<string | undefined> {
  const { token, owner, repo, branch } = repoConfig();
  const res = await fetch(
    `${API}/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
    { headers: headers(token), cache: "no-store" },
  );
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`GitHub getContent ${res.status}`);
  const data = (await res.json()) as { sha?: string };
  return data.sha;
}

/** Read a UTF-8 text file from the repo (production source of truth). */
export async function getFile(filePath: string): Promise<string> {
  const { token, owner, repo, branch } = repoConfig();
  const res = await fetch(
    `${API}/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
    { headers: headers(token), cache: "no-store" },
  );
  if (!res.ok) throw new Error(`GitHub getFile ${res.status}`);
  const data = (await res.json()) as { content: string };
  return Buffer.from(data.content, "base64").toString("utf8");
}

/** Create or update a file. Base64 content. Retries once on a 409 sha conflict. */
export async function putFile(
  filePath: string,
  base64Content: string,
  message: string,
): Promise<void> {
  const { token, owner, repo, branch } = repoConfig();
  for (let attempt = 0; attempt < 2; attempt++) {
    const sha = await currentSha(filePath);
    const res = await fetch(`${API}/repos/${owner}/${repo}/contents/${filePath}`, {
      method: "PUT",
      headers: { ...headers(token), "Content-Type": "application/json" },
      body: JSON.stringify({ message, content: base64Content, branch, sha }),
    });
    if (res.ok) return;
    if (res.status === 409 && attempt === 0) continue; // stale sha → retry
    throw new Error(`GitHub putFile ${res.status}: ${await res.text()}`);
  }
}

export function utf8ToBase64(text: string): string {
  return Buffer.from(text, "utf8").toString("base64");
}
