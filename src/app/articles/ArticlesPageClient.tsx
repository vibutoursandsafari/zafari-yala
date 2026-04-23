'use client';

import { useState, useEffect, useRef } from 'react';
import ArticlesCard from '@/components/articles/ArticlesCard';
import ArticleCardSkeleton from '@/components/articles/ArticleCardSkeleton';
import { FiBook } from 'react-icons/fi';
import { getArticles } from '@/services/articleService';
import type { Article } from '@/types/article';
import Link from 'next/link';

const categories = ['All', 'Wildlife', 'Animals', 'Safari Guide', 'Culture'];

export default function ArticlesPageClient() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      const fetchedArticles = await getArticles();
      setArticles(fetchedArticles);
      setLoading(false);
    }
    fetchArticles();
  }, []);

  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  useEffect(() => {
    if (loading) return;

    cardRefs.current = cardRefs.current.slice(0, filteredArticles.length);

    if (typeof window === 'undefined') return;

    const timers: number[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const idxAttr = (entry.target as HTMLElement).dataset.index;
          const idx = idxAttr ? Number(idxAttr) : -1;

          if (idx >= 0) {
            const timer = window.setTimeout(() => {
              setVisibleCards((prev) => {
                if (prev[idx]) return prev;
                const next = [...prev];
                next[idx] = true;
                return next;
              });
            }, idx * 120);
            timers.push(timer);
          }

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));

    return () => {
      observer.disconnect();
      timers.forEach((t) => clearTimeout(t));
    };
  }, [filteredArticles, loading]);

  return (
    <div className="min-h-screen pt-20 md:pt-28 bg-gray-50">
      {/* Simple Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">Read Articles</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter Buttons */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setVisibleCards([]);
                  setSelectedCategory(category);
                }}
                className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 shadow-sm
                  ${
                    selectedCategory === category
                      ? 'bg-[#03381c] text-white shadow-lg shadow-emerald-200 scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Articles Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, idx) => {
              const href = `/articles/${article.id}${article.slug ? '/' + article.slug : ''}`;
              return (
                <div
                  key={article.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  data-index={idx}
                  className={`will-change-transform transform transition-all duration-500 ${
                    visibleCards[idx] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
                  }`}
                >
                  <Link href={href} className="block">
                    <ArticlesCard 
                      id={article.id}
                      title={article.title}
                      content={article.content}
                      image={(article.images && article.images.length > 0) ? article.images[0].url : '/assets/images/about1.jpg'}
                      category={article.category}
                      author={article.author}
                      createdDate={typeof article.created_at === 'string' ? article.created_at : article.created_at.toISOString()}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FiBook className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600">
              Try selecting a different category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
