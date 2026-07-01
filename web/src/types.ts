export type Difficulty = "easy" | "medium" | "hard";

export interface Hike {
  id: string;
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  location: string;
  difficulty: Difficulty;
  distance: string;
  elevation: string;
  description: string;
  image: string;
  images: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Society {
  name: string;
  shortName: string;
  tagline: string;
  about: string;
  mission: string;
  founded: string;
  memberCount: string;
  hikesPerYear: string;
  email: string;
  phone: string;
  address: string;
  social: { facebook: string };
}

export interface GalleryItem {
  src: string;
  title: string;
  caption: string;
  slug: string;
  i: number;
}

export interface User {
  id: string;
  username: string;
  role: string;
}

export type HikeInput = Omit<
  Hike,
  "id" | "slug" | "image" | "createdAt" | "updatedAt"
>;
