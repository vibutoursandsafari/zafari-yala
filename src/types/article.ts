import type { ArticleImage } from './articleImage';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  author: string;
  created_at: string | Date;
  images?: ArticleImage[];
}