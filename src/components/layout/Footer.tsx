import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  const year = new Date().getFullYear();
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
              <div className="h-12 w-12 rounded-md bg-white/10 flex items-center justify-center text-white font-bold text-lg">Z</div>
              <div>
                <div className="text-2xl font-bold">Zafari</div>
                <div className="text-sm text-emerald-200">Guided safaris & bespoke adventures</div>
              </div>
            </div>

            <p className="mt-4 text-sm text-emerald-100 max-w-xs">
              We craft unforgettable wildlife experiences across stunning landscapes — responsibly and with local experts.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a className="w-9 h-9 rounded-md border border-white/20 flex items-center justify-center hover:bg-white/10" href="#" aria-label="facebook">
                <FaFacebookF />
              </a>
              <a className="w-9 h-9 rounded-md border border-white/20 flex items-center justify-center hover:bg-white/10" href="#" aria-label="instagram">
                <FaInstagram />
              </a>
              <a className="w-9 h-9 rounded-md border border-white/20 flex items-center justify-center hover:bg-white/10" href="#" aria-label="whatsapp">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Guides */}
          <div>
            <h4 className="text-sm font-semibold text-emerald-100 mb-3">Guides</h4>
            <ul className="space-y-2 text-sm text-emerald-200">
              <li><a href="#" className="hover:text-white">Expert Guides</a></li>
              <li><a href="#" className="hover:text-white">Safety & Ethics</a></li>
              <li><a href="#" className="hover:text-white">Wildlife</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>

          {/* Articles */}
          <div>
            <h4 className="text-sm font-semibold text-emerald-100 mb-3">Articles</h4>
            <ul className="space-y-2 text-sm text-emerald-200">
              <li><a href="/articles" className="hover:text-white">Latest Stories</a></li>
              <li><a href="#" className="hover:text-white">Photography Tips</a></li>
              <li><a href="#" className="hover:text-white">Conservation</a></li>
              <li><a href="#" className="hover:text-white">Travel Advice</a></li>
            </ul>
          </div>

          {/* Contact & Links */}
          <div>
            <h4 className="text-sm font-semibold text-emerald-100 mb-3">Contact</h4>
            <div className="text-sm text-emerald-200 space-y-3">
              <div className="flex items-center gap-2"><FiPhone /><span>+94 77 123 4567</span></div>
              <div className="flex items-center gap-2"><FiMail /><span>hello@zafari.example</span></div>
              <div className="flex items-center gap-2"><FiMapPin /><span>Yala National Park, Sri Lanka</span></div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-emerald-100 mb-3">Quick Links</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-emerald-200">
                <a href="#roadmap" className="hover:text-white">Road Map</a>
                <a href="#packages" className="hover:text-white">Packages</a>
                <a href="/articles" className="hover:text-white">Articles</a>
                <a href="#contact" className="hover:text-white">Contact</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-emerald-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© {year} Zafari. All rights reserved.</div>
          <div className="text-xs">Designed & operated with care — sustainable travel.</div>
        </div>
      </div>
    </footer>
  );
}