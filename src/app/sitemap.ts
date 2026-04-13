import { MetadataRoute } from 'next';
import { getArticles } from '@/services/articleService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yalawildspirit.com';
  
  // Static Routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  try {
    const articles = await getArticles();
    
    // Dynamic Routes for Articles
    const dynamicRoutes = articles.map((article) => {
      const slugPath = article.slug ? `/${article.slug}` : '';
      return {
        url: `${baseUrl}/articles/${article.id}${slugPath}`,
        lastModified: new Date(article.created_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error('Error generating sitemap for articles:', error);
    return staticRoutes;
  }
}
