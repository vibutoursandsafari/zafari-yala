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
        <p className="text-teal-600 font-dancing text-2xl mb-2">
          Create an Unforgettable Safari Experience
        </p>
        <h2 className="text-4xl font-bold mb-12 text-gray-800">
          The Finest Safari Adventure with Yala Wild Spirit
        </h2>

        {/* About Content Section */}
        <div className="mt-16 grid grid-cols-1 xl:grid-cols-12 gap-10 text-left px-4 lg:px-12 items-start">
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
              <p className="text-xs sm:text-sm font-semibold text-teal-700 tracking-wide whitespace-nowrap">
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
            <p className="text-gray-600 leading-relaxed text-base mb-6">
              At Yala Wild Spirit, we specialize in delivering refined and unforgettable wildlife experiences in Yala, Sri Lanka.
            </p>
          
            <p className="text-gray-600 leading-relaxed mb-6 text-base">
              With over 3 years of expertise, we combine professional guidance, personalized service, and premium comfort to create safari journeys that are both thrilling and elegant. Our passion is to turn every adventure into a timeless memory.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6 text-base italic border-l-4 border-teal-600 pl-4">
              &ldquo;Get in touch with us and enjoy an incredible safari journey in Yala, Sri Lanka.
              We&apos;ll help you create unforgettable memories that last a lifetime.&rdquo;
            </p>
            <p className="text-gray-800 font-semibold">
              — Yala Wild Spirit Team
            </p>
          </div>

          {/* Right Side - Experience Badge */}
          <div className="xl:col-span-3 flex flex-col items-start xl:items-end">
            <div className="relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg">
              <div className="text-center">
                <div className="flex items-baseline gap-3 justify-center">
                  <span className="text-7xl md:text-8xl font-bold text-amber-600 leading-none">3</span>
                  <div className="text-left">
                    <span className="text-xl md:text-2xl font-semibold text-gray-800 block">years</span>
                    <span className="text-gray-600 text-sm">Service in</span>
                    <span className="text-gray-800 font-bold block text-lg">YALA Safari</span>
                  </div>
                </div>
                
                <a
                  href="https://wa.me/94763272593"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 bg-[#E07B67] hover:bg-[#d06a56] text-white px-10 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <FaWhatsapp className="text-xl" />
                  BOOK NOW
                </a>
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