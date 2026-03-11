export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  created_at: string | Date;
  image?: string;
}