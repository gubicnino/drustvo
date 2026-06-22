import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getSession } from "@/lib/auth/session";
import { writeBinary } from "@/lib/content/storage";
import { slugify } from "@/lib/utils";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(req: Request) {
  // Authorize (route handlers must not rely on the proxy alone).
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Nepooblaščen dostop." }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Datoteka manjka." }, { status: 400 });
  }

  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Dovoljene so slike JPG, PNG ali WEBP." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Slika je prevelika (največ 4 MB)." }, { status: 413 });
  }

  const baseName = slugify(file.name.replace(/\.[^.]+$/, "")) || "slika";
  const fileName = `${baseName}-${randomUUID().slice(0, 8)}.${ext}`;
  const repoPath = `public/uploads/${fileName}`;

  const bytes = Buffer.from(await file.arrayBuffer());
  try {
    await writeBinary(repoPath, bytes, `Naloži sliko: ${fileName}`);
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Nalaganje ni uspelo." }, { status: 500 });
  }

  return NextResponse.json({ path: `/uploads/${fileName}` });
}
