import type { Metadata } from 'next';
import ArticlesPageClient from './ArticlesPageClient';

export const metadata: Metadata = {
  title: 'Articles | Yala Wild Spirit',
  description: 'Explore wildlife, safari guides, animals, and Sri Lankan culture through our latest articles.',
  openGraph: {
    title: 'Articles | Yala Wild Spirit',
    description: 'Discover wildlife stories, safari tips, and cultural insights from Sri Lanka.',
    url: 'https://yala-wild-spirit.com/articles',
    siteName: 'Yala Wild Spirit',
    images: ['/assets/images/about1.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Articles | Yala Wild Spirit',
    description: 'Wildlife, safari guides, and culture articles from Sri Lanka.',
    images: ['/assets/images/about1.jpg'],
  },
};

export default function ArticlesPage() {
  return <ArticlesPageClient />;
}