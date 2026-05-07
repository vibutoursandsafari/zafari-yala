"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { FiMapPin, FiUser } from "react-icons/fi";

const stats = [
  { value: "3+", label: "Years of Experience" },
  { value: "100+", label: "Satisfied Clients" },
  { value: "40+", label: "Tours Handled" },
];

const contactCards = [
  {
    icon: <FiUser className="w-5 h-5" />,
    label: "Safari Guide",
    value: "Vibushana Abrew",
    sub: "Experienced Guide",
    accent: "from-emerald-500 to-teal-600",
    href: undefined,
  },
  {
    icon: <FaWhatsapp className="w-5 h-5" />,
    label: "WhatsApp",
    value: "+94 76 327 2593",
    sub: "Available daily · Quick response",
    accent: "from-[#25d366] to-[#128c7e]",
    href: "https://wa.me/94763272593",
  },
  {
    icon: <FiMapPin className="w-5 h-5" />,
    label: "Location",
    value: "Yala National Park, Sri Lanka",
    sub: "Southern Province",
    accent: "from-amber-400 to-amber-500",
    href: undefined,
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setIsInView(true); observer.disconnect(); }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative font-sans overflow-hidden bg-[linear-gradient(135deg,#f5f7f2_0%,#eaf4e4_45%,#dfeedd_100%)] py-14 md:py-20"
    >
      {/* Blurred orbs */}
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-lime-300/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Section label + heading (left-aligned) ── */}
        <div
          className={`mb-10 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
            Who we are?
          </span>
          <h2 className="mt-1 text-2xl font-extrabold text-emerald-950 sm:text-3xl lg:text-4xl">
            Why you should choose{" "}
            <span className="bg-gradient-to-r from-amber-500 to-amber-500 bg-clip-text text-transparent">
              Yala Wild Spirit?
            </span>
          </h2>
          <p className="mt-2 max-w-2xl text-base text-emerald-900/65 sm:text-lg">
            Experience the magic of Yala — local expertise, personal care, and unforgettable safaris in Sri Lanka.
          </p>
        </div>

        {/* ── Main content grid ── */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">

          {/* ── Left: Image composition ── */}
          <div
            className={`relative mx-auto w-full max-w-lg pb-8 transition-all duration-700 ease-out ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            {/* Main image */}
            <div className="relative h-[320px] sm:h-[380px] w-full overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/assets/images/about_1.jpg"
                alt="Safari jeep experience in Yala"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/30 via-transparent to-transparent" />
            </div>

            {/* Floating secondary image */}
            <div className="absolute -bottom-2 -right-4 sm:-right-8 h-40 w-32 sm:h-48 sm:w-40 overflow-hidden rounded-2xl border-4 border-white shadow-xl">
              <Image
                src="/assets/images/about_2.jpg"
                alt="Wildlife close-up at Yala"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Logo pill — top-left */}
            <div className="absolute -top-5 -left-3 sm:-left-5 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white/95 px-3 py-2.5 shadow-lg backdrop-blur-sm">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src="/assets/images/yala_wild_spirit_logo_green.png"
                  alt="Yala Wild Spirit Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 leading-tight">
                  Yala Wild Spirit
                </p>
                <p className="text-[10px] text-emerald-600/70 leading-tight mt-0.5">
                  By Vibushana Abrew
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: Stats + contact cards ── */}
          <div
            className={`flex flex-col gap-7 transition-all duration-700 ease-out delay-150 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center justify-center gap-1 rounded-2xl border border-emerald-900/10 bg-white/80 py-4 px-2 shadow-sm backdrop-blur-sm transition-all duration-700 ease-out ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                  style={{ transitionDelay: isInView ? `${250 + i * 80}ms` : "0ms" }}
                >
                  <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-br from-emerald-900 to-emerald-900 bg-clip-text text-transparent leading-none">
                    {stat.value}
                  </span>
                  <span className="text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-emerald-800/70 leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-emerald-900/10" />

            {/* Contact cards — modern horizontal pill style */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Get in Touch
              </p>

              {contactCards.map((card, i) => {
                const inner = (
                  <div
                    className={`group flex items-center gap-4 rounded-2xl bg-white/90 shadow-sm border border-emerald-900/8 px-4 py-3.5 transition-all duration-300 backdrop-blur-sm ${card.href ? "hover:shadow-md hover:border-emerald-400/30 cursor-pointer" : ""
                      }`}
                  >
                    {/* Left accent bar */}
                    <div className={`shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-white shadow-md transition-transform duration-300 ${card.href ? "group-hover:scale-110" : ""}`}>
                      {card.icon}
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700/60 leading-none mb-0.5">
                        {card.label}
                      </p>
                      <p className="text-sm font-bold text-emerald-950 truncate">{card.value}</p>
                      <p className="text-[11px] text-emerald-800/50 leading-tight mt-0.5">{card.sub}</p>
                    </div>

                    {/* Right arrow for clickable */}
                    {card.href && (
                      <div className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold transition-all duration-300 group-hover:bg-emerald-100 group-hover:translate-x-0.5">
                        →
                      </div>
                    )}
                  </div>
                );

                return card.href ? (
                  <a
                    key={i}
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={i}>{inner}</div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}