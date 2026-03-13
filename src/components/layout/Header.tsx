'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FiArrowRight } from 'react-icons/fi';

export default function Header() {
  
  // Header color only transparent when over hero section
  const [isOverHero, setIsOverHero] = useState(false);
  const pathname = usePathname();

  // Hide header on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }
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

  // Active link underline logic
  const [hash, setHash] = useState('');

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
        <div className="text-2xl font-bold text-white hover:text-blue-600 transition-colors duration-300 cursor-pointer">
          Zafari.
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-white hover:text-white transition-all duration-300 relative group"
          >
            Home
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
          <a
            href="#gallery"
            className="text-white hover:text-white transition-all duration-300 relative group"
          >
            Gallery
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${hash === '#gallery' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </a>
          <a
            href="/articles"
            className="text-white hover:text-white transition-all duration-300 relative group"
          >
            Articles
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${pathname === '/articles' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </a>
          <a
            href="#about"
            className="text-white hover:text-white transition-all duration-300 relative group"
          >
            About Us
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${hash === '#about' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </a>
        </nav>

        {/* Get Started Button */}
        <button className="flex items-center gap-2 border border-white bg-transparent text-white px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 hover:bg-white/10 hover:scale-105">
          <span>Get Started</span>
          <FiArrowRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}