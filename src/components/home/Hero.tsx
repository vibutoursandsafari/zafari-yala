'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaPlay, FaPhone } from 'react-icons/fa';
import { MdOutlineWorkHistory } from 'react-icons/md';

const bgImages = [
  '/assets/images/cover_img_01.jpg',
  '/assets/images/cover_img_02.jpg',
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bgImages.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="relative h-screen min-h-[600px] flex flex-col text-white overflow-hidden">
      {/* Background slideshow with crossfade */}
      {bgImages.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 z-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={src}
            alt={`Safari background ${i + 1}`}
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

      {/* Slideshow dots */}
      <div className="absolute bottom-36 md:bottom-44 right-6 z-30 flex flex-col gap-2">
        {bgImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-6 rounded-full transition-all duration-300 ${
              i === current ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Main Content — left aligned, vertically centered */}
      <div className="relative z-20 flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-24 pb-8">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">
          <span className="w-8 h-px bg-amber-400" />
          Yala National Park
        </span>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-none mb-4 whitespace-nowrap">
          Yala wild <span className="text-amber-400">spirit</span>
        </h1>

        {/* Sub text */}
        <p className="text-sm sm:text-base text-gray-300 max-w-xs sm:max-w-sm mb-6 leading-relaxed">
          Explore the unseen beauty of Yala National Park with Zafari Tours, where every journey takes you deeper.
        </p>

        {/* Customer review */}
        <div className="flex items-start gap-3 max-w-xs sm:max-w-sm mb-8 border border-white/20 rounded-lg px-3 py-2 bg-white/5">
          <span className="text-amber-400 text-4xl leading-none font-serif mt-0 shrink-0">&ldquo;</span>
          <div className="min-w-0">
            <p className="text-white text-xs sm:text-sm leading-relaxed italic line-clamp-3">
              An absolutely breathtaking experience &mdash; spotted leopards, elephants, and crocodiles in one magical morning!
            </p>
            <p className="text-white text-xs font-semibold mt-2">&mdash; Samantha R., Australia</p>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white hover:bg-green-500 hover:border-green-500 transition-all duration-300 hover:scale-110"
            aria-label="WhatsApp"
          >
            <FaWhatsapp className="w-5 h-5" />
          </a>
          <a
            href="https://facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 hover:scale-110"
            aria-label="Facebook"
          >
            <FaFacebookF className="w-4 h-4" />
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white hover:bg-pink-500 hover:border-pink-500 transition-all duration-300 hover:scale-110"
            aria-label="Instagram"
          >
            <FaInstagram className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Bottom cards */}
      <div className="relative z-20 px-8 md:px-16 lg:px-24 pb-10 flex flex-col sm:flex-row items-center justify-center gap-4">

        {/* Tour Guide Card (wider on larger screens) */}
        <div className="flex items-center gap-6 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl px-6 py-5 w-full sm:max-w-md hover:bg-white/20 transition-all duration-300">
          {/* Guide avatar */}
          <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-amber-400 shrink-0">
            <Image
              src="/assets/images/cover_img_01.jpg"
              alt="Tour Guide"
              fill
              className="object-cover"
            />
          </div>
          {/* Guide details */}
          <div className="flex flex-col gap-2">
            <p className="font-bold text-white text-lg">Ravindu Vibushana Abrew</p>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
              <MdOutlineWorkHistory className="w-4 h-4 text-amber-400" />
              <span>3 years experience</span>
            </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
              <FaPhone className="w-4 h-4 text-amber-400" />
              <span>+94 76 327 2593</span>
            </div>
          </div>
          </div>

        {/* Video Tour Card (narrower, but same height as guide) */}
        <div className="flex items-center gap-6 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl px-6 py-5 w-full sm:max-w-xs cursor-pointer hover:bg-white/20 transition-all duration-300 group">
          {/* Play button (match guide avatar size) */}
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-400 group-hover:bg-amber-500 transition-all duration-300 group-hover:scale-110 shrink-0 shadow-lg shadow-amber-400/40">
            <FaPlay className="w-6 h-6 text-white" />
          </div>
          {/* Label (vertically centered) */}
          <div className="flex flex-col justify-center">
            <p className="font-bold text-white text-sm">Watch Video Tour</p>
            <p className="text-gray-300 text-xs">See the wild in action</p>
          </div>
        </div>

      </div>
    </section>
  );
}