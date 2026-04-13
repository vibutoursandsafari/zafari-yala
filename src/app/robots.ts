import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Protect admin panel and API endpoints
    },
    sitemap: 'https://yalawildspirit.com/sitemap.xml',
  };
}