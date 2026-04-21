"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";

export default function About() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const badgeText = "YALA WILD SPIRIT";

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
      { threshold: 0.3 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-20 text-center relative"
      style={{
        backgroundImage: "url('/assets/images/about_cover3.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/30"></div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <p className="text-emerald-700 font-semibold text-2xl md:text-3xl tracking-wide mb-2">
          Create an Unforgettable Safari Experience
        </p>
        <h2 className="text-4xl font-bold mb-12 text-gray-800">
          The Finest Safari Adventure with{' '}
          <span className="text-amber-400">Yala Wild Spirit</span>
        </h2>

        {/* About Content Section */}
        <div className="mt-16 grid grid-cols-1 xl:grid-cols-9 gap-10 text-left px-4 lg:px-12 items-start">
          {/* Left Side - Image Composition */}
          <div className="xl:col-span-4 relative w-full max-w-xl mx-auto xl:mx-0 pb-10 sm:pb-12">
            <div className="relative group rounded-3xl overflow-hidden shadow-2xl h-[340px] sm:h-[400px] cursor-pointer">
              <Image
                src="/assets/images/about_1.jpg"
                alt="Safari jeep experience in Yala"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                priority={false}
              />
            </div>
            <div className="absolute group -bottom-6 -right-2 sm:-right-6 w-44 sm:w-52 h-56 sm:h-64 rounded-2xl overflow-hidden shadow-xl cursor-pointer">
              <Image
                src="/assets/images/about_2.jpg"
                alt="Wildlife close-up at Yala"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md">
              <p className="text-xs sm:text-sm font-semibold text-emerald-700 tracking-wide whitespace-nowrap">
                {badgeText.split("").map((char, index) => (
                  <span
                    key={`${char}-${index}`}
                    className="inline-block"
                    style={{
                      opacity: 0,
                      transform: "translateX(-16px)",
                      animationName: isInView ? "badge-letter-slide" : "none",
                      animationDuration: isInView ? "0.45s" : "0s",
                      animationTimingFunction: "ease-out",
                      animationFillMode: "forwards",
                      animationDelay: isInView ? `${index * 0.045}s` : "0s",
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* Middle - Content */}
          <div className="xl:col-span-5 max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Planning your next wildlife adventure?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 text-gray-600 text-base leading-relaxed">
              <p>Enjoy a simple, safe, and memorable Yala safari with local guidance.</p>
              <p>Quick WhatsApp booking and personalized tour support.</p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div>
                <div className="flex items-end gap-3">
                  <span className="text-6xl font-bold text-amber-400 leading-none">3</span>
                  <span className="text-lg font-semibold text-gray-800 pb-1">years</span>
                </div>
                <p className="mt-2 text-xl font-medium text-gray-700 leading-snug">Service in<br />Yala Safari</p>
              </div>

              <div className="md:text-left">
                <p className="text-gray-700 italic text-lg leading-relaxed">
                  “Tell us your dates and we&apos;ll handle the rest.”
                </p>
                <div className="mt-5">
                  <a
                    href="https://wa.me/94763272593"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
                  >
                    <FaWhatsapp className="text-lg" />
                    BOOK NOW
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes badge-letter-slide {
          from {
            opacity: 0;
            transform: translateX(-16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

      `}</style>
    </section>
  );
}