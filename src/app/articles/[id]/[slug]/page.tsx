import type { Metadata } from 'next';
import type { Article } from '@/types/article';
import { getArticleById } from '@/services/articleService';
import ArticleDetailsClient from './ArticleDetailsClient';

type Props = {
  params: { id: string; slug?: string } | Promise<{ id: string; slug?: string }>;
};

function excerptFromHtml(html = '', max = 160) {
  if (!html) return '';
  const stripped = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return stripped.length > max ? stripped.slice(0, max).trim() + '…' : stripped;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = (await params) as { id: string };
  if (!id) return {};
  try {
    const article = await getArticleById(id);
    if (!article) return {};
    const description = excerptFromHtml(article.content ?? '');
    const image = (article.images && article.images[0] && (typeof article.images[0] === 'string' ? article.images[0] : article.images[0].url)) || '/assets/images/about1.jpg';

    return {
      title: `${article.title} | Yala Wild Spirit`,
      description,
      authors: [{ name: article.author ?? 'Yala Wild Spirit' }],
      openGraph: {
        title: article.title,
        description,
        images: [image],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description,
        images: [image],
      },
    };
  } catch (err) {
    return {};
  }
}

export default async function ArticlePage({ params }: Props) {
  const { id } = (await params) as { id: string };
  const article: Article | null = id ? await getArticleById(id) : null;
  if (!article) {
    return <div className="min-h-screen flex items-center justify-center">Article not found</div>;
  }

  return <ArticleDetailsClient article={article} />;
}
