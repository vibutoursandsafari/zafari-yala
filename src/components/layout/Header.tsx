'use client';

import Link from 'next/link';
import Image from 'next/image';
import { type MouseEvent, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  // Header color only transparent when over hero section
  const [isOverHero, setIsOverHero] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    // Track the section currently in view on the home page
    if (pathname !== '/') {
      return;
    }

    const sectionIds = ['hero', 'about', 'packages', 'reviews', 'contact'];

    const syncActiveSection = () => {
      const headerOffset = 140;
      const scrollPosition = window.scrollY + headerOffset;
      let currentSection = 'hero';

      const orderedSections = sectionIds
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => Boolean(element))
        .sort((a, b) => a.offsetTop - b.offsetTop);

      for (const element of orderedSections) {
        if (scrollPosition >= element.offsetTop) {
          currentSection = element.id;
        }
      }

      setActiveSection(currentSection);
      setIsOverHero(currentSection === 'hero');
    };

    syncActiveSection();
    window.addEventListener('scroll', syncActiveSection, { passive: true });
    window.addEventListener('resize', syncActiveSection);

    return () => {
      window.removeEventListener('scroll', syncActiveSection);
      window.removeEventListener('resize', syncActiveSection);
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const router = useRouter();

  const handleScroll = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e?.preventDefault?.();
    setActiveSection(id);
    if (typeof window === 'undefined') {
      router.push('/#' + id);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      router.push('/#' + id);
    }
  };

  const headerBg = (isOverHero && pathname === '/')
    ? 'bg-white/5 backdrop-blur-md border-white/20'
    : 'bg-[#022814]/95 backdrop-blur-sm border-[#022814]/60';

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const isActiveRoute = (route: string) => pathname === route;
  const isActiveSection = (sectionId: string) => pathname === '/' && activeSection === sectionId;
  const navLabelClass = (active: boolean) => `group relative inline-flex pb-1 transition-colors duration-300 ${active ? 'text-amber-300' : 'text-white hover:text-amber-200'}`;
  const navUnderlineClass = (active: boolean) => `absolute -bottom-1 left-0 h-0.5 origin-left rounded-full transition-transform duration-300 ${active ? 'scale-x-100 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.45)]' : 'scale-x-0 bg-amber-300 group-hover:scale-x-100'}`;
  const mobileLinkClass = (active: boolean) => `w-full rounded-lg border px-4 py-3 text-left text-base font-medium transition-colors ${active ? 'border-amber-300/70 bg-amber-300/10 text-amber-200' : 'border-white/15 text-white hover:border-white/40 hover:bg-white/5'}`;

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

      <div className="container mx-auto px-4 sm:px-6 py-4 md:px-16 flex items-center justify-between relative z-10">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center" aria-label="Go to homepage">
          <Image
            src="/assets/images/logo_yala_wild_spirit.png"
            alt="Yala Wild logo"
            width={100}
            height={100}
            priority
            className="h-14 w-auto object-contain bg-transparent"
          />
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className={navLabelClass(isActiveRoute('/') || isActiveSection('hero'))}
          >
            Home
            <span className={navUnderlineClass(isActiveRoute('/') || isActiveSection('hero'))} />
          </Link>
          <Link
            href="/gallery"
            className={navLabelClass(isActiveRoute('/gallery'))}
          >
            Gallery
            <span className={navUnderlineClass(isActiveRoute('/gallery'))} />
          </Link>
          <Link
            href="/articles"
            className={navLabelClass(isActiveRoute('/articles'))}
          >
            Articles
            <span className={navUnderlineClass(isActiveRoute('/articles'))} />
          </Link>
          <a
            href="#packages"
            onClick={(e) => handleScroll(e, 'packages')}
            className={navLabelClass(isActiveSection('packages'))}
          >
            Packages
            <span className={navUnderlineClass(isActiveSection('packages'))} />
          </a>
          <a
            href="#contact"
            onClick={(e) => handleScroll(e, 'contact')}
            className={navLabelClass(isActiveSection('contact'))}
          >
            Contact
            <span className={navUnderlineClass(isActiveSection('contact'))} />
          </a>
          <a
            href="#reviews"
            onClick={(e) => handleScroll(e, 'reviews')}
            className={navLabelClass(isActiveSection('reviews'))}
          >
            Reviews
            <span className={navUnderlineClass(isActiveSection('reviews'))} />
          </a>
          <a
            href="#about"
            onClick={(e) => handleScroll(e, 'about')}
            className={navLabelClass(isActiveSection('about'))}
          >
            About
            <span className={navUnderlineClass(isActiveSection('about'))} />
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition-colors hover:bg-white/10 md:hidden"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-drawer"
        >
          {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/94763272593"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative hidden md:inline-flex items-center gap-2 overflow-hidden rounded-full border border-gray-100 bg-transparent px-5 py-2 text-sm font-semibold text-white/95 transition-all duration-200 hover:bg-gray-100/5"
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

      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMobileMenu}
        aria-hidden={!isMobileMenuOpen}
      />

      <aside
        id="mobile-nav-drawer"
        className={`fixed right-0 top-0 z-50 h-dvh w-[84%] max-w-[360px] border-l border-white/10 bg-[#022814] p-6 shadow-2xl transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Menu</span>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          <Link href="/" className={mobileLinkClass(isActiveRoute('/') || isActiveSection('hero'))} onClick={closeMobileMenu}>
            Home
          </Link>
          <Link href="/gallery" className={mobileLinkClass(isActiveRoute('/gallery'))} onClick={closeMobileMenu}>
            Gallery
          </Link>
          <Link href="/articles" className={mobileLinkClass(isActiveRoute('/articles'))} onClick={closeMobileMenu}>
            Articles
          </Link>
          <a
            href="#packages"
            className={mobileLinkClass(isActiveSection('packages'))}
            onClick={(e) => {
              handleScroll(e, 'packages');
              closeMobileMenu();
            }}
          >
            Packages
          </a>
          <a
            href="#contact"
            className={mobileLinkClass(isActiveSection('contact'))}
            onClick={(e) => {
              handleScroll(e, 'contact');
              closeMobileMenu();
            }}
          >
            Contact
          </a>
          <a
            href="#reviews"
            className={mobileLinkClass(isActiveSection('reviews'))}
            onClick={(e) => {
              handleScroll(e, 'reviews');
              closeMobileMenu();
            }}
          >
            Reviews
          </a>
          <a
            href="#about"
            className={mobileLinkClass(isActiveSection('about'))}
            onClick={(e) => {
              handleScroll(e, 'about');
              closeMobileMenu();
            }}
          >
            About
          </a>
        </nav>

        <a
          href="https://wa.me/94763272593"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-300/60 bg-amber-300/10 px-5 py-3 text-sm font-semibold text-amber-200 transition-colors hover:bg-amber-300/20"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
          onClick={closeMobileMenu}
        >
          <FaWhatsapp className="h-5 w-5" />
          WhatsApp
        </a>
      </aside>
    </header>
  );
}