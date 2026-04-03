export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  updatedAt?: string;
  published: boolean;
  tags?: string[];
  heroImageUrl?: string;
}
