'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';

export default function Header() {
  // Header color only transparent when over hero section
  const [isOverHero, setIsOverHero] = useState(false);
  const [hash, setHash] = useState('');
  const pathname = usePathname();
  useEffect(() => {
    // Only observe hero on home page
    if (pathname !== '/') {
      return;
    }

    const heroSection = document.getElementById('hero');
    if (!heroSection) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOverHero(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(heroSection);
    return () => {
      observer.disconnect();
      setIsOverHero(false);
    };
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateHash = () => setHash(window.location.hash || '');
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  const headerBg = (isOverHero && pathname === '/')
    ? 'bg-white/5 backdrop-blur-md border-white/20'
    : 'bg-[#022814]/95 backdrop-blur-sm border-[#022814]/60';

  // Hide header on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b shadow-sm transition-all duration-300 ${headerBg}`}>
      {/* Decorative diagonal lines when header is not over hero */}
      {!(isOverHero && pathname === '/') && (
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.08) 10px, rgba(0,0,0,0.08) 20px)`
        }} />
      )}

      <div className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center" aria-label="Go to homepage">
          <Image
            src="/assets/images/yala_logo.png"
            alt="Yala Wild logo"
            width={110}
            height={44}
            priority
            className="h-11 w-auto object-contain"
          />
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-white hover:text-white transition-all duration-300 relative group"
          >
            Home
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
          <Link
            href="/gallery"
            className="text-white hover:text-white transition-all duration-300 relative group"
          >
            Gallery
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${pathname === '/gallery' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
          <Link
            href="/articles"
            className="text-white hover:text-white transition-all duration-300 relative group"
          >
            Articles
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${pathname === '/articles' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
          <Link
            href="/#about"
            className="text-white hover:text-white transition-all duration-300 relative group"
          >
            About Us
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${hash === '#about' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
        </nav>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/94763272593"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-gray-100 bg-transparent px-5 py-2 text-sm font-semibold text-white/95 transition-all duration-200 hover:bg-gray-100/5"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(115deg,transparent_25%,rgba(255,255,255,0.06)_50%,transparent_75%)] transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative flex h-5 w-5 items-center justify-center">
            <span className="absolute inline-flex h-5 w-5 rounded-full bg-white/10 animate-ping" />
            <FaWhatsapp className="relative h-5 w-5" />
          </span>
          <span className="relative">WhatsApp</span>
        </a>
      </div>
    </header>
  );
}