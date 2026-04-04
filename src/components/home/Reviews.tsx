'use client';

import { useEffect, useMemo, useState } from 'react';
import { FaStar } from 'react-icons/fa';
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
  const [currentSlide, setCurrentSlide] = useState(0);

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

  useEffect(() => {
    if (reviews.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % reviews.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [reviews.length]);

  useEffect(() => {
    if (currentSlide > reviews.length - 1) {
      setCurrentSlide(0);
    }
  }, [currentSlide, reviews.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % reviews.length);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setName('');
    setMessage('');
    setRating(5);
    setHoverRating(0);
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!name.trim() || !message.trim()) {
      setFeedback('Name and review message are required.');
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

      setTimeout(() => {
        closeModal();
      }, 700);
    } catch (error) {
      console.error('Failed to submit review:', error);
      setFeedback('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="bg-gradient-to-b from-white to-emerald-50/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {reviews.map((review) => (
                  <article key={review.id} className="w-full shrink-0 px-1">
                    <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/30 p-5">
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
                      <p className="min-h-24 text-sm leading-relaxed text-emerald-900/80">{review.message}</p>
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
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-900/15 text-emerald-900 transition hover:bg-emerald-50"
                  aria-label="Previous review"
                >
                  <FiChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-900/15 text-emerald-900 transition hover:bg-emerald-50"
                  aria-label="Next review"
                >
                  <FiChevronRight />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2.5 rounded-full transition-all ${index === currentSlide ? 'w-7 bg-emerald-700' : 'w-2.5 bg-emerald-200 hover:bg-emerald-300'}`}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
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

              {feedback && (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
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
          </div>
        </div>
      )}
    </section>
  );
}
