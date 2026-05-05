'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FaCheckCircle, FaStar } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight, FiMessageCircle, FiX, FiEye, FiUser } from 'react-icons/fi';
import { addReview, getReviews } from '@/services/reviewService';
import type { Review } from '@/types/review';

const MAX_STARS = 5;
const CARD_MSG_LINES = 3;

// Initials avatar helper
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // deterministic hue from name
  const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold shadow-md"
      style={{ background: `hsl(${hue},55%,42%)` }}
      aria-hidden="true"
    >
      {initials || <FiUser className="w-5 h-5" />}
    </div>
  );
}

// Star row helper
function StarRow({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'xs' }) {
  const sz = size === 'xs' ? 'h-3 w-3' : 'h-3.5 w-3.5';
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: MAX_STARS }).map((_, i) => (
        <FaStar key={i} className={`${sz} ${i < rating ? 'opacity-100' : 'opacity-20'}`} />
      ))}
    </div>
  );
}

export default function Reviews() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Write-review modal
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);

  // View-review modal
  const [viewReview, setViewReview] = useState<Review | null>(null);

  // Slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // ── Entrance animation state per card ─────────────────────────────────────
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getReviews();
        setReviews(data);
        setVisibleCards(data.map(() => false));
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadReviews();
  }, []);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return Number((total / reviews.length).toFixed(1));
  }, [reviews]);

  const maxSlides = Math.max(0, reviews.length - itemsPerView + 1);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Stagger card entrance once in view
  useEffect(() => {
    if (!isInView || reviews.length === 0) return;
    reviews.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCards((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 200 + i * 90);
    });
  }, [isInView, reviews.length]);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1280) setItemsPerView(4);
      else if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 640) setItemsPerView(2);
      else setItemsPerView(1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (currentSlide > maxSlides) setCurrentSlide(maxSlides);
  }, [currentSlide, maxSlides]);

  const closeWrite = () => {
    setIsWriteOpen(false);
    setName(''); setMessage(''); setRating(5); setHoverRating(0);
    setFeedback(null); setFeedbackType(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null); setFeedbackType(null);
    if (!name.trim() || !message.trim()) {
      setFeedback('Name and review message are required.');
      setFeedbackType('error');
      return;
    }
    setIsSubmitting(true);
    try {
      await addReview({ name: name.trim(), message: message.trim(), rating });
      const fresh = await getReviews();
      setReviews(fresh);
      setVisibleCards(fresh.map(() => true));
      setFeedback('Thanks! Your review has been published.');
      setFeedbackType('success');
      setTimeout(() => closeWrite(), 1800);
    } catch {
      setFeedback('Failed to submit review. Please try again.');
      setFeedbackType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5-star distribution
  const starDist = useMemo(() => {
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => { if (dist[r.rating] !== undefined) dist[r.rating]++; });
    return dist;
  }, [reviews]);

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="relative overflow-hidden bg-[linear-gradient(135deg,#f5f7f2_0%,#eaf4e4_45%,#dfeedd_100%)] py-20"
    >
      {/* Blurred orbs */}
      <div className="pointer-events-none absolute -left-24 top-14 h-64 w-64 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-lime-300/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div
          className={`mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Guest Reviews</p>
            <h2 className="mt-2 text-3xl font-extrabold text-emerald-950 sm:text-4xl">What Travelers Say</h2>
            <p className="mt-2 max-w-xl text-sm text-emerald-900/70 sm:text-base">
              Every visitor can share their safari experience. Your review helps others choose their next adventure.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsWriteOpen(true)}
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#0f6b3a_0%,#15803d_55%,#166534_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_-12px_rgba(15,107,58,0.8)] transition hover:brightness-110 active:scale-95"
          >
            <FiMessageCircle />
            Write a Review
          </button>
        </div>

        {/* Rating summary card */}
        <div
          className={`mb-8 transition-all duration-700 delay-100 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          <div className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white/80 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-5 sm:p-6">

              {/* Left: big score */}
              <div className="flex flex-col items-center justify-center shrink-0 px-4 py-2 sm:border-r sm:border-emerald-900/10">
                <span className="text-6xl font-black text-emerald-900 leading-none tabular-nums">
                  {averageRating > 0 ? averageRating : '—'}
                </span>
                <StarRow rating={Math.round(averageRating)} size="sm" />
                <p className="mt-1.5 text-xs font-semibold text-emerald-700/70 uppercase tracking-wide">
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </p>
              </div>

              {/* Right: per-star bars */}
              <div className="flex-1 w-full flex flex-col gap-1.5 min-w-0">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = starDist[star] ?? 0;
                  const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-900/60 w-3 shrink-0">{star}</span>
                      <FaStar className="h-3 w-3 text-amber-400 shrink-0" />
                      <div className="flex-1 h-1.5 rounded-full bg-emerald-900/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-1000"
                          style={{ width: isInView ? `${pct}%` : '0%' }}
                        />
                      </div>
                      <span className="text-[10px] text-emerald-900/50 w-6 text-right shrink-0">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Reviews list / slider ── */}
        {isLoading ? (
          <div className="rounded-2xl border border-emerald-100 bg-white/60 p-8 text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-700">
              <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm font-medium">Loading reviews…</span>
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-emerald-100 bg-white/60 p-12 text-center">
            <p className="text-lg font-semibold text-emerald-900">No reviews yet</p>
            <p className="mt-2 text-sm text-emerald-900/60">Be the first traveler to share your experience.</p>
          </div>
        ) : (
          <div
            className={`transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            <div className="rounded-2xl border border-emerald-900/10 bg-white/70 p-4 shadow-sm sm:p-5 backdrop-blur-sm">
              {/* Slider track */}
              <div className="overflow-hidden rounded-xl">
                <div
                  className="flex gap-4 transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)` }}
                >
                  {reviews.map((review, idx) => (
                    <article
                      key={review.id}
                      className={`shrink-0 transition-all duration-500 ease-out ${visibleCards[idx] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-[0.97]'
                        }`}
                      style={{ flex: `0 0 calc(${100 / itemsPerView}% - 0.75rem)` }}
                    >
                      {/* review card */}
                      <div className="group flex h-[220px] flex-col rounded-2xl border border-emerald-900/8 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-300">

                        {/* Top: avatar + name + stars */}
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar name={review.name} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-emerald-950">{review.name}</p>
                            <StarRow rating={review.rating} size="xs" />
                          </div>
                        </div>

                        {/* Review text — fixed 3-line clamp */}
                        <p
                          className="flex-1 text-[13px] leading-relaxed text-emerald-900/75 overflow-hidden"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: CARD_MSG_LINES,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {review.message}
                        </p>

                        {/* Bottom: date + view button */}
                        <div className="mt-3 flex items-center justify-between gap-2 pt-2.5 border-t border-emerald-900/6">
                          <p className="text-[10px] text-emerald-900/45 leading-none">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric',
                            })}
                          </p>
                          <button
                            type="button"
                            onClick={() => setViewReview(review)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-700 transition-all duration-200 hover:scale-105 active:scale-95"
                          >
                            <FiEye className="w-3 h-3" />
                            View
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Slider controls */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
                    disabled={currentSlide === 0}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-900/15 text-emerald-900 transition hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Previous review"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSlide((p) => Math.min(maxSlides, p + 1))}
                    disabled={currentSlide >= maxSlides}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-900/15 text-emerald-900 transition hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Next review"
                  >
                    <FiChevronRight />
                  </button>
                </div>

                {/* Dot indicators */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: maxSlides + 1 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentSlide(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`rounded-full transition-all duration-300 ${i === currentSlide
                        ? 'w-5 h-2 bg-emerald-600'
                        : 'w-2 h-2 bg-emerald-900/20 hover:bg-emerald-900/40'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODEL 1: View a review */}
      {viewReview && (
        <div
          className="fixed inset-0 z-[75] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setViewReview(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-6 sm:p-7 animate-[fadeInUp_0.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={viewReview.name} />
                <div>
                  <p className="font-bold text-emerald-950">{viewReview.name}</p>
                  <StarRow rating={viewReview.rating} size="xs" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewReview(null)}
                className="rounded-full p-2 text-emerald-900/50 hover:bg-emerald-50 hover:text-emerald-900 transition"
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>

            {/* Full message */}
            <p className="text-sm leading-relaxed text-emerald-900/80 whitespace-pre-line max-h-[50vh] overflow-y-auto pr-1">
              {viewReview.message}
            </p>

            {/* Date */}
            <p className="mt-5 text-xs text-emerald-900/40 pt-4 border-t border-emerald-900/8">
              {new Date(viewReview.createdAt).toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
              })}
            </p>
          </div>
        </div>
      )}

      {/* MODEL 2: Write a review */}
      {isWriteOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-white p-6 shadow-2xl sm:p-8 animate-[fadeInUp_0.25s_ease-out]">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-emerald-950">Share Your Review</h3>
                <p className="mt-1 text-sm text-emerald-900/60">Tell others about your safari experience.</p>
              </div>
              <button
                type="button"
                onClick={closeWrite}
                className="rounded-full p-2 text-emerald-900/60 hover:bg-emerald-50 hover:text-emerald-950 transition"
                aria-label="Close review popup"
              >
                <FiX />
              </button>
            </div>

            {feedbackType === 'success' && feedback ? (
              <div className="rounded-2xl border border-emerald-200 bg-[linear-gradient(135deg,#ecfdf5_0%,#d1fae5_100%)] p-6 text-center shadow-sm">
                <FaCheckCircle className="mx-auto mb-3 h-12 w-12 text-emerald-600" />
                <h4 className="text-xl font-bold text-emerald-900">Thank You!</h4>
                <p className="mt-2 text-sm text-emerald-900/80">{feedback}</p>
                <p className="mt-1 text-xs text-emerald-900/50">This popup will close automatically.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-emerald-900">Your Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-emerald-900">Rating</label>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: MAX_STARS }).map((_, index) => {
                      const v = index + 1;
                      const active = (hoverRating || rating) >= v;
                      return (
                        <button
                          key={index}
                          type="button"
                          onMouseEnter={() => setHoverRating(v)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(v)}
                          className="text-2xl transition hover:scale-110"
                          aria-label={`Rate ${v} star${v > 1 ? 's' : ''}`}
                        >
                          <FaStar className={active ? 'text-amber-400' : 'text-gray-300'} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-emerald-900">Review</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="block w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Describe your safari experience…"
                    required
                  />
                </div>

                {feedbackType === 'error' && feedback && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                    {feedback}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#0f6b3a_0%,#15803d_55%,#166534_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_-12px_rgba(15,107,58,0.8)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Submitting…' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Keyframe for modal entrance */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </section>
  );
}