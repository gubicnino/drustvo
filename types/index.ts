export type Difficulty = "easy" | "medium" | "hard";

export interface Hike {
  id: string;
  slug: string;
  title: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  location: string;
  difficulty: Difficulty;
  distance: string;
  elevation: string;
  description: string;
  /** featured image path under /public, or "" for a placeholder */
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
  social: {
    facebook: string;
  };
}
