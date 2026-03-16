import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Article } from '@/types/article';

export async function getArticles(): Promise<Article[]> {
  try {
    const articlesRef = collection(db, 'articles');
    const q = query(articlesRef, orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const articles: Article[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        title: data.title || '',
        content: data.content || '',
        category: data.category || '',
        author: data.author || '',
        created_at: data.created_at?.toDate?.() || data.created_at || new Date(),
        // support multiple images stored as an array of { url, publicId }
        images: Array.isArray(data.images)
          ? data.images.map((img: any) => ({ url: img.url || img, publicId: img.publicId }))
          : undefined,
        // Note: single-image fallback removed; use `images` array instead
      });
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}