'use client';

import { useState, useEffect, useRef } from 'react';
import ArticlesCard from '@/components/articles/ArticlesCard';
import ArticleCardSkeleton from '@/components/articles/ArticleCardSkeleton';
import { FiBook } from 'react-icons/fi';
import { getArticles } from '@/services/articleService';
import type { Article } from '@/types/article';
import Link from 'next/link';

const categories = ['All', 'Wildlife', 'Animals', 'Safari Guide', 'Culture'];

// Background wildlife icons scattered across the page
interface BgIcon {
  src: string;
  style: {
    top: string;
    left?: string;
    right?: string;
    width: number;
    opacity: number;
    transform: string;
  };
}

const bgIcons: BgIcon[] = [
  { src: '/assets/icons/ic_elephant_white.png', style: { top: '6%',  left: '3%',   width: 72,  opacity: 0.08, transform: 'rotate(8deg)'  } },
  { src: '/assets/icons/ic_bird_white.png',     style: { top: '4%',  right: '6%',  width: 56,  opacity: 0.08, transform: 'rotate(-14deg)' } },
  { src: '/assets/icons/ic_tiger_white.png',    style: { top: '18%', left: '90%',  width: 64,  opacity: 0.07, transform: 'rotate(5deg)'   } },
  { src: '/assets/icons/ic_trunk_white.png',    style: { top: '35%', left: '2%',   width: 60,  opacity: 0.07, transform: 'rotate(-6deg)'  } },
  { src: '/assets/icons/ic_bear_white.png',     style: { top: '50%', right: '3%',  width: 68,  opacity: 0.07, transform: 'rotate(10deg)'  } },
  { src: '/assets/icons/ic_eagle_white.png',    style: { top: '65%', left: '88%',  width: 72,  opacity: 0.06, transform: 'rotate(-8deg)'  } },
  { src: '/assets/icons/ic_elephant_white.png', style: { top: '75%', left: '5%',   width: 60,  opacity: 0.07, transform: 'rotate(12deg)'  } },
  { src: '/assets/icons/ic_bird_white.png',     style: { top: '88%', left: '80%',  width: 52,  opacity: 0.08, transform: 'rotate(6deg)'   } },
  { src: '/assets/icons/jeep_icon_white_01.png',style: { top: '92%', left: '10%',  width: 70,  opacity: 0.07, transform: 'rotate(-4deg)'  } },
  { src: '/assets/icons/ic_tiger_white.png',    style: { top: '28%', left: '46%',  width: 54,  opacity: 0.05, transform: 'rotate(3deg)'   } },
];

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
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f5f7f2_0%,#eaf4e4_45%,#dfeedd_100%)] pt-20 md:pt-28">

      {/* ── Decorative blurred orbs ── */}
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-32 h-80 w-80 rounded-full bg-lime-300/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-200/15 blur-3xl" />

      {/* ── Scattered wildlife icons ── */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {bgIcons.map((icon, i) => (
          <img
            key={i}
            src={icon.src}
            alt=""
            style={{
              position: 'absolute',
              width: icon.style.width,
              height: icon.style.width,
              opacity: icon.style.opacity,
              transform: icon.style.transform,
              top: icon.style.top,
              left: icon.style.left,
              right: icon.style.right,
              filter: 'grayscale(100%) brightness(0)',
            }}
          />
        ))}
      </div>

      {/* ── Page header ── */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 text-center">
        <span className="mb-4 inline-block rounded-full border border-emerald-200 bg-white/70 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700 shadow-sm backdrop-blur-sm">
          Our Blog
        </span>
        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-emerald-950">
          Read Articles
        </h1>
        <p className="mt-2 mx-auto max-w-xl text-sm text-emerald-900/65 sm:text-base">
          Wildlife stories, safari guides, and cultural insights from the heart of Sri Lanka.
        </p>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Category Filter Buttons ── */}
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
                      ? 'bg-[linear-gradient(135deg,#0f6b3a_0%,#15803d_55%,#166534_100%)] text-white shadow-lg shadow-emerald-300/40 scale-105'
                      : 'bg-white/80 text-emerald-900 hover:bg-white hover:shadow-md border border-emerald-900/10 backdrop-blur-sm'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* ── Loading State ── */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* ── Articles Grid ── */}
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

        {/* ── Empty State ── */}
        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-emerald-900/10 bg-white/80 shadow-sm mb-4 backdrop-blur-sm">
              <FiBook className="text-emerald-500" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-emerald-950 mb-2">
              No articles found
            </h3>
            <p className="text-emerald-900/60 text-sm">
              Try selecting a different category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
