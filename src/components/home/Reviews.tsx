'use client';

import { useEffect, useMemo, useState } from 'react';
import { FaCheckCircle, FaStar } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight, FiMessageCircle, FiX } from 'react-icons/fi';
import { addReview, getReviews } from '@/services/reviewService';
import type { Review } from '@/types/review';

const MAX_STARS = 5;

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getReviews();
        setReviews(data);
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
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Number((total / reviews.length).toFixed(1));
  }, [reviews]);

  const maxSlides = Math.max(0, reviews.length - itemsPerView + 1);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1280) {
        setItemsPerView(4);
      } else if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  useEffect(() => {
    if (currentSlide > maxSlides) {
      setCurrentSlide(maxSlides);
    }
  }, [currentSlide, maxSlides]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => Math.min(maxSlides, prev + 1));
  };



  const closeModal = () => {
    setIsModalOpen(false);
    setName('');
    setMessage('');
    setRating(5);
    setHoverRating(0);
    setFeedback(null);
    setFeedbackType(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setFeedbackType(null);

    if (!name.trim() || !message.trim()) {
      setFeedback('Name and review message are required.');
      setFeedbackType('error');
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview({
        name: name.trim(),
        message: message.trim(),
        rating,
      });

      const freshReviews = await getReviews();
      setReviews(freshReviews);
      setFeedback('Thanks! Your review has been published.');
      setFeedbackType('success');

      setTimeout(() => {
        closeModal();
      }, 1800);
    } catch (error) {
      console.error('Failed to submit review:', error);
      setFeedback('Failed to submit review. Please try again.');
      setFeedbackType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="relative overflow-hidden bg-[linear-gradient(135deg,#f5f7f2_0%,#eaf4e4_45%,#dfeedd_100%)] py-20">
      {/* Decorative blurred elements */}
      <div className="pointer-events-none absolute -left-24 top-14 h-60 w-60 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-lime-300/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Guest Reviews</p>
            <h2 className="mt-2 text-3xl font-extrabold text-emerald-950 sm:text-4xl">What Travelers Say</h2>
            <p className="mt-3 max-w-2xl text-sm text-emerald-900/75 sm:text-base">
              Every visitor can share their safari experience. Your review helps others choose their next adventure.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#0f6b3a_0%,#15803d_55%,#166534_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_-12px_rgba(15,107,58,0.8)] transition hover:brightness-110"
          >
            <FiMessageCircle />
            Write a Review
          </button>
        </div>

        <div className="mb-8 rounded-2xl border border-emerald-900/10 bg-white/80 p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-3xl font-black text-emerald-900">{averageRating > 0 ? averageRating : '0.0'}</div>
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: MAX_STARS }).map((_, index) => (
                <FaStar key={index} className="h-4 w-4" />
              ))}
            </div>
            <p className="text-sm text-emerald-900/70">Based on {reviews.length} review{reviews.length === 1 ? '' : 's'}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center text-emerald-800">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-emerald-100 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-emerald-900">No reviews yet</p>
            <p className="mt-2 text-sm text-emerald-900/70">Be the first traveler to share your experience.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-sm sm:p-6">
            <div className="relative overflow-hidden rounded-xl">
              <div
                className="flex gap-4 transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)` }}
              >
                {reviews.map((review) => (
                  <article
                    key={review.id}
                    className="shrink-0"
                    style={{ flex: `0 0 calc(${100 / itemsPerView}% - 0.75rem)` }}
                  >
                    <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/30 p-5 h-full">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="truncate text-base font-bold text-emerald-950">{review.name}</h3>
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: MAX_STARS }).map((_, index) => (
                            <FaStar
                              key={index}
                              className={`h-3.5 w-3.5 ${index < review.rating ? 'opacity-100' : 'opacity-30'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="break-words whitespace-pre-line text-sm leading-relaxed text-emerald-900/80">
                        {review.message}
                      </p>
                      <p className="mt-4 text-xs text-emerald-900/55">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  disabled={currentSlide === 0}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-900/15 text-emerald-900 transition hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous review"
                >
                  <FiChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  disabled={currentSlide >= maxSlides}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-900/15 text-emerald-900 transition hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next review"
                >
                  <FiChevronRight />
                </button>
              </div>

              <div className="flex items-center gap-1 text-sm text-emerald-900/70">
                <span className="font-semibold">{currentSlide + 1}</span>
                <span>-</span>
                <span className="font-semibold">{Math.min(currentSlide + itemsPerView, reviews.length)}</span>
                <span>of</span>
                <span className="font-semibold">{reviews.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-emerald-950">Share Your Review</h3>
                <p className="mt-1 text-sm text-emerald-900/70">Tell others about your safari experience.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-emerald-900/70 transition hover:bg-emerald-50 hover:text-emerald-950"
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
                <p className="mt-2 text-xs text-emerald-900/60">This popup will close automatically.</p>
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
                      const starValue = index + 1;
                      const isActive = (hoverRating || rating) >= starValue;
                      return (
                        <button
                          key={index}
                          type="button"
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(starValue)}
                          className="text-2xl transition hover:scale-110"
                          aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                        >
                          <FaStar className={isActive ? 'text-amber-400' : 'text-gray-300'} />
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
                    placeholder="Describe your safari experience..."
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
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}