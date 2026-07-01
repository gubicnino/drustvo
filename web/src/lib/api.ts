import type { GalleryItem, Hike, HikeInput, Society, User } from "../types";

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || "/api";
const TOKEN_KEY = "pd_token";

/** Origin za slike (/uploads). Pri relativnem API-ju je ista domena (prazno). */
const MEDIA_ORIGIN = /^https?:\/\//.test(API_BASE) ? new URL(API_BASE).origin : "";

/** Pretvori pot do slike (/uploads/...) v polni URL. */
export function mediaUrl(path: string): string {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return MEDIA_ORIGIN + path;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;
  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isForm = false,
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (isForm) {
    payload = body as FormData;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(API_BASE + path, { method, headers, body: payload });

  if (res.status === 401 && token) {
    setToken(null); // potekel/neveljaven žeton
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = (data && data.error) || `Napaka ${res.status}`;
    throw new ApiError(message, res.status, data?.fields);
  }
  return data as T;
}

export const api = {
  // Javno
  getSociety: () => request<Society>("GET", "/society"),
  getHikes: (params?: { status?: string; difficulty?: string; sort?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return request<Hike[]>("GET", "/hikes" + (q ? `?${q}` : ""));
  },
  getHike: (slug: string) => request<Hike>("GET", `/hikes/${slug}`),
  getGallery: () => request<GalleryItem[]>("GET", "/gallery"),

  // Avtentikacija
  login: (username: string, password: string) =>
    request<{ token: string; user: User }>("POST", "/login", { username, password }),
  me: () => request<{ user: User }>("GET", "/me"),

  // Admin
  adminHikes: () => request<Hike[]>("GET", "/admin/hikes"),
  adminHike: (id: string) => request<Hike>("GET", `/admin/hikes/${id}`),
  createHike: (data: HikeInput) => request<Hike>("POST", "/admin/hikes", data),
  updateHike: (id: string, data: HikeInput) => request<Hike>("PUT", `/admin/hikes/${id}`, data),
  deleteHike: (id: string) => request<{ ok: true }>("DELETE", `/admin/hikes/${id}`),
  publishHike: (id: string, published: boolean) =>
    request<{ ok: true }>("POST", `/admin/hikes/${id}/publish`, { published }),
  upload: (files: FileList | File[]) => {
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files[]", f));
    return request<{ paths: string[]; errors?: string[] }>("POST", "/admin/upload", fd, true);
  },
  galleryFiles: () => request<{ src: string; name: string }[]>("GET", "/admin/gallery"),
  deleteGalleryFile: (file: string) =>
    request<{ ok: true }>("DELETE", "/admin/gallery", { file }),
  updateSociety: (data: Society) => request<Society>("PUT", "/admin/society", data),
};
