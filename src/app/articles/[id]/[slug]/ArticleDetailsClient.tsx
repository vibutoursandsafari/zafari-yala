'use client';

import { useState, useEffect } from 'react';
import type { Article } from '@/types/article';
import { FaFacebookF, FaWhatsapp, FaTwitter, FaRegCopy, FaInstagram } from 'react-icons/fa';

export default function ArticleDetailsClient({ article }: { article: Article }) {
  const [primaryImage, setPrimaryImage] = useState<string | null>(article?.images?.[0]?.url ?? null);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') setShareUrl(window.location.href);
  }, []);

  const handleCopyLink = () => {
    const url = shareUrl || '';
    if (navigator.clipboard && url) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      });
    } else if (url) {
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 1200); } catch {}
      document.body.removeChild(el);
    }
  };

  const openWindow = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareFacebook = () => {
    const u = encodeURIComponent(shareUrl || '');
    if (!u) return;
    openWindow(`https://www.facebook.com/sharer/sharer.php?u=${u}`);
  };

  const shareTwitter = () => {
    const u = encodeURIComponent(shareUrl || '');
    const text = encodeURIComponent(article.title || '');
    openWindow(`https://twitter.com/intent/tweet?text=${text}&url=${u}`);
  };

  const shareWhatsApp = () => {
    const u = encodeURIComponent(shareUrl || '');
    const text = encodeURIComponent(article.title || '');
    openWindow(`https://wa.me/?text=${text}%20${u}`);
  };

  const shareInstagram = async () => {
    const url = shareUrl || '';
    if (!url) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title || '', text: article.title || '', url });
        return;
      } catch {}
    }
    // Fallback: copy link and open Instagram
    handleCopyLink();
    openWindow('https://www.instagram.com/');
  };
    
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
            <nav className="text-sm text-gray-500 mb-3">Home <span className="mx-2">•</span> Our Articles <span className="mx-2">•</span> <span className="text-gray-700">{article.category}</span></nav>
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
                          aria-label={`Show image ${idx + 1}`}>
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
              </article>
            </div>

            <aside className="w-full md:w-80">
              <div className="md:sticky md:top-28">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-md">
                  <div className="text-sm font-medium text-gray-700 mb-3">Share this article</div>

                  <div className="flex justify-center items-center gap-4">
                    <button
                      type="button"
                      onClick={shareFacebook}
                      aria-label="Share on Facebook"
                      className="w-12 h-12 rounded-xl border border-green-900 flex items-center justify-center text-green-900 hover:bg-green-900 hover:text-white hover:scale-105 transform transition focus:outline-none focus:ring-2 focus:ring-green-200"
                    >
                      <FaFacebookF className="text-base" />
                    </button>

                    <button
                      type="button"
                      onClick={shareTwitter}
                      aria-label="Share on Twitter"
                      className="w-12 h-12 rounded-xl border border-green-900 flex items-center justify-center text-green-900 hover:bg-green-900 hover:text-white hover:scale-105 transform transition focus:outline-none focus:ring-2 focus:ring-green-200"
                    >
                      <FaTwitter className="text-base" />
                    </button>

                    <button
                      type="button"
                      onClick={shareInstagram}
                      aria-label="Share on Instagram"
                      className="w-12 h-12 rounded-xl border border-green-900 flex items-center justify-center text-green-900 hover:bg-green-900 hover:text-white hover:scale-105 transform transition focus:outline-none focus:ring-2 focus:ring-green-200"
                    >
                      <FaInstagram className="text-base" />
                    </button>

                    <button
                      type="button"
                      onClick={shareWhatsApp}
                      aria-label="Share on WhatsApp"
                      className="w-12 h-12 rounded-xl border border-green-900 flex items-center justify-center text-green-900 hover:bg-green-900 hover:text-white hover:scale-105 transform transition focus:outline-none focus:ring-2 focus:ring-green-200"
                    >
                      <FaWhatsapp className="text-base" />
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs text-gray-500 mb-2">Or copy link</div>
                    <div className="flex items-center gap-2 border border-gray-100 rounded-md overflow-hidden">
                      <div className="flex-1 px-3 py-2 text-sm text-gray-700 truncate">{shareUrl || 'Share link'}</div>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        aria-label="Copy link"
                        className="px-3 py-2 bg-white text-md text-green-900 border-l border-gray-100 hover:bg-gray-50 flex items-center justify-center"
                      >
                        <FaRegCopy className="text-green-900" />
                      </button>
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
