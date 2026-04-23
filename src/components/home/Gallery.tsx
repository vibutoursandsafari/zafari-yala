'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { GalleryImage } from '@/types/gallery';
import { getGalleryImages } from '@/services/galleryService';
import { getArticles } from '@/services/articleService';
import type { Article } from '@/types/article';

export default function Gallery() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const articleCardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [visibleArticles, setVisibleArticles] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await getGalleryImages();
        // keep full list from service; we'll slice for display (max 7 images + view-more)
        setGalleryImages(images);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const all = await getArticles();
        setArticles(all.slice(0, 3));
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoadingArticles(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    const node = sectionRef.current;

    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setVisibleArticles(articles.map(() => false));
    articleCardRefs.current = articleCardRefs.current.slice(0, articles.length);
  }, [articles]);

  useEffect(() => {
    if (typeof window === 'undefined' || articles.length === 0) return;

    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    if (!isMobile) {
      setVisibleArticles(articles.map(() => true));
      return;
    }

    const timers: number[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const idxAttr = (entry.target as HTMLElement).dataset.index;
          const idx = idxAttr ? Number(idxAttr) : -1;
          if (idx >= 0) {
            const t = window.setTimeout(() => {
              setVisibleArticles((prev) => {
                if (prev[idx]) return prev;
                const next = [...prev];
                next[idx] = true;
                return next;
              });
            }, idx * 120);
            timers.push(t);
          }

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    articleCardRefs.current.forEach((el) => el && observer.observe(el));

    return () => {
      observer.disconnect();
      timers.forEach((t) => clearTimeout(t));
    };
  }, [articles]);

  // Display logic: show max 5 images, then a View More tile
  const displayImages = galleryImages.slice(0, 5);
  const desktopImages = displayImages; // up to 5 images on desktop
  const mobileImages = displayImages; // up to 5 images on mobile, then view more

  return (
    <section ref={sectionRef} className="relative bg-[#034d27] py-12 md:py-14 overflow-visible font-sans">

      {/* Background Lines Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)`
        }} />
      </div>

      {/* Trunk icon in bottom-left */}
      <div className="absolute -left-8 -bottom-8 lg:-left-14 lg:-bottom-12 opacity-30 pointer-events-none z-0">
        <Image src="/assets/icons/ic_trunk_white.png" alt="decorative trunk" width={220} height={220} />
      </div>

      {/* Trunk icon in bottom-left */}
      <div className="absolute right-1/2 top-8 lg:right-1/4 lg:top-8 opacity-30 pointer-events-none z-0">
        <Image src="/assets/icons/ic_trunk_white.png" alt="decorative trunk" width={80} height={80} />
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-4 lg:px-6 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: gallery column (header + gallery) */}
          <div
            className={`transition-all duration-700 ease-out ${
              isInView ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'
            }`}
          >
            {/* Left header */}
            <div className="mb-6 md:mb-8 md:pr-8 font-sans">
              <div className="flex flex-row items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-1">
                    Gallery
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-1 truncate">
                    Captures
                  </h2>
                </div>

                <div className="ml-4">
                  <Link href="/gallery" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-transparent text-gray-200 font-semibold text-sm md:px-4 md:py-2 md:text-base transition-colors duration-200 hover:bg-white/5">
                    <span>View Gallery</span>
                    <FiArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
            {/* Loading State for gallery */}
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <svg className="animate-spin w-10 h-10 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : galleryImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No images yet</h3>
                <p className="text-gray-500 mb-4">Visit the gallery to upload images</p>
                <Link href="/gallery" className="text-amber-500 hover:text-amber-400 font-medium">
                  Go to Gallery →
                </Link>
              </div>
            ) : (
              <>
                {/* Desktop Uniform Grid (3x2) - show up to 5 images, then a View More tile */}
                <div className="hidden lg:grid grid-cols-3 auto-rows-[220px] gap-4 mb-10 lg:h-[456px]">
                  {desktopImages.map((image, index) => (
                    <div
                      key={image.id}
                      className={`relative group overflow-hidden rounded-lg cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:z-10 ${
                        isInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 80}ms` }}
                    >
                      <Image src={image.url} alt={image.alt} fill className="object-cover transition-all duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}

                  {/* View More tile always appended as the last cell */}
                  <Link
                    href="/gallery"
                    className={`relative group overflow-hidden rounded-lg cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:z-10 flex items-center justify-center bg-white/5 border border-white/10 ${
                      isInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                    }`}
                    style={{ transitionDelay: `${desktopImages.length * 80}ms` }}
                  >
                    <div className="text-center px-4 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-amber-400 font-semibold text-lg">View More</p>
                        <FiArrowRight className="w-4 h-4 text-amber-400" />
                      </div>
                      <p className="text-white text-xs mt-1">See the full gallery</p>
                    </div>
                  </Link>
                </div>

                {/* Mobile Uniform Grid - show up to 5 images, then View More tile */}
                <div className="grid lg:hidden grid-cols-2 auto-rows-[180px] gap-3 mb-8">
                  {mobileImages.map((image, index) => (
                    <div
                      key={image.id}
                      className={`relative group overflow-hidden rounded-lg cursor-pointer transition-all duration-500 ${
                        isInView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 70}ms` }}
                    >
                      <Image src={image.url} alt={image.alt} fill className="object-cover transition-all duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}

                  {/* Mobile View More tile */}
                  <Link
                    href="/gallery"
                    className={`relative group overflow-hidden rounded-lg cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:z-10 flex items-center justify-center bg-white/5 border border-white/10 ${
                      isInView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${mobileImages.length * 70}ms` }}
                  >
                    <div className="text-center px-4 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-amber-400 font-semibold">View More</p>
                        <FiArrowRight className="w-4 h-4 text-amber-400" />
                      </div>
                      <p className="text-white text-xs mt-1">See the full gallery</p>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Right: Articles column */}
          <aside
            className={`space-y-6 h-full transition-all duration-700 ease-out delay-150 ${
              isInView ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
            }`}
          >
            {/* Right header */}
            <div className="mb-4 md:mb-6 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-1">
                    Readings
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-1 break-words sm:truncate">Articles</h3>
                </div>

                <div className="sm:ml-4 self-start sm:self-auto">
                  <Link href="/articles" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-transparent text-gray-200 font-semibold text-sm md:px-4 md:py-2 md:text-base hover:bg-white/5">
                    <span>Read All</span>
                    <FiArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </Link>
                </div>
              </div>
            </div>
            {loadingArticles ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-28 bg-white/10 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4 h-full">
                {articles.map((a, idx) => (
                  <Link
                    key={a.id}
                    href={`/articles/${a.id}${a.slug ? '/' + a.slug : ''}`}
                    ref={(el) => {
                      articleCardRefs.current[idx] = el;
                    }}
                    data-index={idx}
                    className={`block transition-all duration-500 will-change-transform ${
                      visibleArticles[idx] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
                    }`}
                  >
                    <article style={{ flex: idx === 0 ? 2 : 1 }} className="bg-white rounded-xl p-1 shadow transition-shadow duration-300 group overflow-hidden h-full">
                      <div className="flex flex-col sm:flex-row gap-2 h-full">
                        <div className="w-full sm:w-28 md:w-32 h-44 sm:h-full rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                          <Image src={(a.images && a.images[0]) ? a.images[0].url : '/assets/images/about1.jpg'} alt={a.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-105" />
                        </div>
                        <div className="flex-1 flex flex-col py-2 px-3 sm:px-4 min-w-0">
                          <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-tight mb-1 break-words">{a.title}</h4>
                          <p className="text-left sm:text-justify text-sm md:text-sm text-gray-600 mt-0 mb-3 overflow-hidden break-words" style={{ WebkitLineClamp: idx === 0 ? 6 : 3, display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>
                            {a.content ? (idx === 0 ? (a.content.slice(0, 400) + (a.content.length > 400 ? '...' : '')) : (a.content.slice(0, 150) + (a.content.length > 150 ? '...' : ''))) : ''}
                          </p>
                          <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-0 sm:pr-4 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
                              <span className="text-xs bg-[#013a1d] text-white px-2 py-0.5 rounded-md">{a.category}</span>
                              <span className="text-xs text-gray-500">{new Date(typeof a.created_at === 'string' ? a.created_at : a.created_at.toISOString()).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold self-start sm:self-auto">
                              <span>Read</span>
                              <FiArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
