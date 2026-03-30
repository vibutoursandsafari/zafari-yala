import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
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
      const created_at = (data.created_at as any)?.toDate?.() ?? data.created_at ?? new Date();
      const images = Array.isArray(data.images)
        ? data.images.map((img: any) => ({ url: img.url || img, publicId: img.publicId }))
        : undefined;

      articles.push({
        id: doc.id,
        title: data.title ?? '',
        slug: data.slug ?? '',
        content: data.content ?? '',
        category: data.category ?? '',
        author: data.author ?? '',
        created_at,
        images,
      });
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const docRef = doc(db, 'articles', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    const data = snap.data();
    const created_at = (data.created_at as any)?.toDate?.() ?? data.created_at ?? new Date();
    const images = Array.isArray(data.images)
      ? data.images.map((img: any) => ({ url: img.url || img, publicId: img.publicId }))
      : undefined;

    const article: Article = {
      id: snap.id,
      title: data.title ?? '',
      slug: data.slug ?? '',
      content: data.content ?? '',
      category: data.category ?? '',
      author: data.author ?? '',
      created_at,
      images,
    };

    return article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}