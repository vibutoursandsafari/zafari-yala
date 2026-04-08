 'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { MouseEvent } from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  const year = new Date().getFullYear();
  const router = useRouter();

  const handleScroll = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e?.preventDefault?.();
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
  return (
    <footer className="relative bg-[#034d27] text-white font-sans">
      {/* subtle patterned overlay */}
      <div className="absolute inset-0 opacity-8 pointer-events-none" aria-hidden>
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 12px, transparent 12px, transparent 24px)'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/assets/images/logo_yala_wild_spirit.png"
                alt="Yala Wild logo"
                width={56}
                height={56}
                className="h-14 w-auto object-contain"
              />
              <div>
                <div className="text-2xl font-bold">Yala wild spirit</div>
                <div className="text-sm text-emerald-200">Guided safaris & bespoke adventures</div>
              </div>
            </div>

            <p className="mt-4 text-sm text-emerald-100 max-w-xs">
              We craft unforgettable wildlife experiences across stunning landscapes — responsibly and with local experts.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a className="w-9 h-9 rounded-md border border-white/20 flex items-center justify-center hover:bg-white/10" href="https://facebook.com/zafariyala" aria-label="facebook">
                <FaFacebookF />
              </a>
              <a className="w-9 h-9 rounded-md border border-white/20 flex items-center justify-center hover:bg-white/10" href="https://instagram.com/zafariyala" aria-label="instagram">
                <FaInstagram />
              </a>
              <a className="w-9 h-9 rounded-md border border-white/20 flex items-center justify-center hover:bg-white/10" href="https://wa.me/94763272593" aria-label="whatsapp">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-emerald-100 mb-3">Navigate</h4>
            <ul className="space-y-2 text-sm text-emerald-200">
              <li>
                <Link href="/" className="hover:text-white">Home</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white">Gallery</Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-white">Articles</Link>
              </li>
              <li>
                <a href="#packages" onClick={(e) => handleScroll(e, 'packages')} className="hover:text-white">Packages</a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="hover:text-white">Contact</a>
              </li>
              <li>
                <a href="#reviews" onClick={(e) => handleScroll(e, 'reviews')} className="hover:text-white">Reviews</a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="hover:text-white">About</a>
              </li>
            </ul>
          </div>

          {/* Packages */}
          <div>
            <h4 className="text-sm font-semibold text-emerald-100 mb-3">Packages</h4>
            <ul className="space-y-2 text-sm text-emerald-200">
              <li>
                <a href="#packages" onClick={(e) => handleScroll(e, 'packages')} className="hover:text-white">Half Safari</a>
              </li>
              <li>
                <a href="#packages" onClick={(e) => handleScroll(e, 'packages')} className="hover:text-white">Full Safari</a>
              </li>
              <li>
                <a href="#packages" onClick={(e) => handleScroll(e, 'packages')} className="hover:text-white">Customized Tour</a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-emerald-100 mb-3">Contact</h4>
            <div className="text-sm text-emerald-200 space-y-3">
              <div className="flex items-center gap-2"><FiPhone /><a href="tel:+94763272593" className="hover:text-white">+94 76 327 2593</a></div>
              <div className="flex items-center gap-2"><FiMail /><a href="mailto:vibutoursandsafari@gmail.com" className="hover:text-white">vibutoursandsafari@gmail.com</a></div>
              <div className="flex items-center gap-2"><FiMapPin /> <span>Yala National Park, Sri Lanka</span></div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-emerald-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© {year} Yala Wild Spirit. All Rights Reserved.</div>
          <div className="text-xs">Designed & operated with care — sustainable travel.</div>
        </div>
      </div>
    </footer>
  );
}