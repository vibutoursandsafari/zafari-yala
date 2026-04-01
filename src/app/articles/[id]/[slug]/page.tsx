'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getArticleById } from '@/services/articleService';
import type { Article } from '@/types/article';
import { FaFacebookF, FaWhatsapp, FaTwitter, FaLink, FaCopy } from 'react-icons/fa';

export default function ArticleDetails() {
  const params = useParams() as { id?: string; slug?: string };
  const id = params?.id;
  const slug = params?.slug;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [primaryImage, setPrimaryImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    // UI-only placeholder
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      const a = await getArticleById(id);
      if (!mounted) return;
      setArticle(a);
      setPrimaryImage(a?.images?.[0]?.url ?? null);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [id, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 md:pt-28 pb-10 md:pb-12 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 sm:p-6">
            <div className="mb-4 animate-pulse">
              <div className="h-10 w-2/3 bg-gray-200 rounded" />
              <div className="mt-3 flex items-center gap-4 text-sm">
                <div className="h-5 w-24 bg-gray-200 rounded" />
                <div className="h-5 w-12 bg-gray-200 rounded" />
                <div className="h-5 w-28 bg-gray-200 rounded" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr,260px] gap-6">
              <div>
                <div className="bg-gray-200 w-full rounded-md h-72 sm:h-96" />

                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  <div className="h-14 w-28 bg-gray-200 rounded" />
                  <div className="h-14 w-28 bg-gray-200 rounded" />
                  <div className="h-14 w-28 bg-gray-200 rounded" />
                  <div className="h-14 w-28 bg-gray-200 rounded" />
                </div>

                <div className="mt-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-11/12" />
                  <div className="h-4 bg-gray-200 rounded w-4/5" />
                </div>
              </div>

              <aside className="w-full md:w-64">
                <div className="md:sticky md:top-28">
                  <div className="p-4">
                    <div className="h-5 bg-gray-200 rounded w-24 mb-4" />

                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-md bg-gray-200" />
                      <div className="h-10 w-10 rounded-md bg-gray-200" />
                      <div className="h-10 w-10 rounded-md bg-gray-200" />
                    </div>

                    <div className="mt-3">
                      <div className="h-10 bg-gray-200 rounded w-full" />
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!article) return <div className="min-h-screen flex items-center justify-center">Article not found</div>;

  const formatDate = (d: string | Date) => {
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const readingMinutes = (text = '') => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-28 pb-10 md:pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <nav className="text-sm text-gray-500 mb-3">Home <span className="mx-2">•</span> Our Blogs <span className="mx-2">•</span> <span className="text-gray-700">{article.category}</span></nav>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">{article.title}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-sm">{(article.author || 'A').slice(0,1)}</div>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-bold">{article.author}</span>
                </div>
              </div>

              <div className="h-6 w-px bg-gray-200" />

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="inline-block">{readingMinutes(article.content)} min read</span>
                <span className="text-gray-300">•</span>
                <span>{formatDate(article.created_at)}</span>
                <span className="text-gray-300">•</span>
                <span className="inline-block bg-green-950 text-white px-3 py-1 rounded-full text-sm">{article.category}</span>
              </div>
            </div>
          </div>

            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="md:flex-1">
                <article className="space-y-6">
              <div>
                <div className="overflow-hidden bg-gray-100 rounded-2xl">
                  {primaryImage ? (
                    <img src={primaryImage} alt={article.title} className="w-full h-64 sm:h-80 md:h-[520px] object-cover" />
                  ) : (
                    <div className="w-full h-64 sm:h-80 md:h-[520px] flex items-center justify-center text-gray-400">No image</div>
                  )}
                </div>

                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {(article.images ?? []).map((img, idx) => {
                    const url = typeof img === 'string' ? img : img?.url;
                    return (
                      <button
                        key={(url ?? String(idx)) + idx}
                        onClick={() => setPrimaryImage(url ?? null)}
                        className={`flex-shrink-0 rounded-lg overflow-hidden focus:outline-none w-20 sm:w-24 md:w-28 h-12 sm:h-16 md:h-20 ${primaryImage === url ? 'ring-1 ring-indigo-300' : ''}`}
                        aria-label={`Show image ${idx + 1}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url ?? undefined} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="prose prose-slate max-w-none text-gray-800 text-justify">
                <div className="text-sm text-gray-500 mb-3">By <span className="font-medium text-gray-700">{article.author}</span></div>
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
                  {/* share card is displayed from the aside (reused on mobile) */}
            </article>
              </div>

            <aside className="w-full md:w-80">
              <div className="md:sticky md:top-28">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-md">
                  <div className="text-sm font-medium text-gray-700 mb-3">Share this design</div>

                  <div className="flex justify-center items-center gap-4">
                    <button type="button" className="w-12 h-12 rounded-xl border border-green-900 flex items-center justify-center hover:bg-gray-50 text-green-900">
                      <FaFacebookF className="text-base" />
                    </button>

                    <button type="button" className="w-12 h-12 rounded-xl border border-green-900 flex items-center justify-center hover:bg-gray-50 text-green-900">
                      <FaTwitter className="text-base" />
                    </button>

                    <button type="button" className="w-12 h-12 rounded-xl border border-green-900 flex items-center justify-center hover:bg-gray-50 text-green-900">
                      <FaWhatsapp className="text-base" />
                    </button>
                  </div>
                  {/* copy link block */}
                  <div className="mt-4">
                    <div className="text-xs text-gray-500 mb-2">Or copy link</div>
                    <div className="flex items-center gap-2 border border-gray-100 rounded-md overflow-hidden">
                      <div className="flex-1 px-3 py-2 text-sm text-gray-700 truncate">https://www.uidesigndaily.com/posts/5d6ab9ea91dece0012006d44</div>
                      <button type="button" className="px-3 py-2 bg-white text-sm text-pink-500 border-l border-gray-100 hover:bg-gray-50">Copy</button>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
