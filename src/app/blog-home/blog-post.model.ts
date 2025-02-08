export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  tags?: string[];
  imageUrl?: string;
}
