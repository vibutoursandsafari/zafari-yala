'use client';

import { useState } from 'react';
import {
  FiUser,
  FiMail,
  FiMessageSquare,
  FiSend,
  FiPhone,
  FiChevronRight,
  FiMapPin,
} from 'react-icons/fi';
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
} from 'react-icons/fa';

export default function Contact() {
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <section id="contact" className="relative bg-white py-24 overflow-hidden font-sans">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">

          {/* ── LEFT: Contact info panel (top) and Map (bottom) ── */}
          <div className="flex flex-col h-full gap-6">
            {/* Top: contact info card */}
            <div className="rounded-3xl border border-gray-300 bg-white p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>

              {/* Contact Information */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <FiPhone className="text-[#034d27] flex-shrink-0" size={18} />
                    <span className="text-gray-600 text-sm">Phone</span>
                  </div>
                  <a href="tel:+94771234567" className="text-gray-900 font-medium hover:text-[#034d27] transition-colors text-sm">
                    +94 77 123 4567
                  </a>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <FiMail className="text-[#034d27] flex-shrink-0" size={18} />
                    <span className="text-gray-600 text-sm">Email</span>
                  </div>
                  <a href="mailto:info@zafariyala.com" className="text-gray-900 font-medium hover:text-[#034d27] transition-colors text-sm">
                    info@zafariyala.com
                  </a>
                </div>

                <div className="flex items-start justify-between py-2">
                  <div className="flex items-center gap-3">
                    <FiMapPin className="text-[#034d27] flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-gray-600 text-sm">Location</span>
                  </div>
                  <p className="text-gray-900 font-medium text-right max-w-[60%] text-sm">
                    Yala National Park Road, Yala, Sri Lanka
                  </p>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Connect With Us</h4>
                <div className="grid grid-cols-3 gap-3">
                  <a
                    href="https://facebook.com/zafariyala"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-[#034d27] hover:bg-gray-50 transition-all group"
                  >
                    <FaFacebook size={24} className="text-[#034d27] group-hover:text-[#1877F2] transition-colors mb-2" />
                    <span className="text-xs text-gray-600">Facebook</span>
                  </a>

                  <a
                    href="https://instagram.com/zafariyala"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-[#034d27] hover:bg-gray-50 transition-all group"
                  >
                    <FaInstagram size={24} className="text-[#034d27] group-hover:text-pink-500 transition-colors mb-2" />
                    <span className="text-xs text-gray-600">Instagram</span>
                  </a>

                  <a
                    href="https://wa.me/94771234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-[#034d27] hover:bg-gray-50 transition-all group"
                  >
                    <FaWhatsapp size={24} className="text-[#034d27] group-hover:text-[#25D366] transition-colors mb-2" />
                    <span className="text-xs text-gray-600">WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom: map - separate panel that fills remaining height */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 flex-1 min-h-0">
              <iframe
                title="Yala National Park map"
                src="https://www.google.com/maps?q=Yala%20National%20Park&z=13&output=embed"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* RIGHT: Contact form */}
          <div className="flex flex-col gap-6 h-full">
            {/* Main glass card */}
              <div className="rounded-3xl border border-gray-300 bg-white p-8 sm:p-10 h-full">
              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl font-bold text-[#034d27] mb-1">
                Let&apos;s Get <span className="text-[#034d27]">Started</span>
              </h2>
              <p className="text-gray-600 text-sm mb-8">
                Tell us about your dream safari we&apos;ll handle the rest.
              </p>

              {/* Form */}
              <form className="flex flex-col gap-5" noValidate>
                {/* Name & Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
                      Full Name
                    </label>
                    <div
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 border bg-gray-50 transition-all duration-200 ${
                        focused === 'name'
                          ? 'border-emerald-400 ring-2 ring-emerald-400/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <FiUser
                        size={15}
                        className={focused === 'name' ? 'text-emerald-400' : 'text-gray-400'}
                      />
                      <input
                        type="text"
                        placeholder="James Frank"
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused(null)}
                        className="bg-transparent text-gray-900 placeholder-gray-400 text-sm w-full outline-none"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
                      Email Address
                    </label>
                    <div
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 border bg-gray-50 transition-all duration-200 ${
                        focused === 'email'
                          ? 'border-emerald-400 ring-2 ring-emerald-400/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <FiMail
                        size={15}
                        className={focused === 'email' ? 'text-emerald-400' : 'text-gray-400'}
                      />
                      <input
                        type="email"
                        placeholder="james@yahoo.com"
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                        className="bg-transparent text-gray-900 placeholder-gray-400 text-sm w-full outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone & Country row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
                      Phone
                    </label>
                    <div
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 border bg-gray-50 transition-all duration-200 ${
                        focused === 'phone'
                          ? 'border-emerald-400 ring-2 ring-emerald-400/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <FiPhone
                        size={15}
                        className={focused === 'phone' ? 'text-emerald-400' : 'text-gray-400'}
                      />
                      <input
                        type="tel"
                        placeholder="+94 77 123 4567"
                        onFocus={() => setFocused('phone')}
                        onBlur={() => setFocused(null)}
                        className="bg-transparent text-gray-900 placeholder-gray-400 text-sm w-full outline-none"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
                      Country
                    </label>
                    <div
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 border bg-gray-50 transition-all duration-200 ${
                        focused === 'country'
                          ? 'border-emerald-400 ring-2 ring-emerald-400/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <FiMapPin
                        size={15}
                        className={focused === 'country' ? 'text-emerald-400' : 'text-gray-400'}
                      />
                      <input
                        type="text"
                        placeholder="Sri Lanka"
                        onFocus={() => setFocused('country')}
                        onBlur={() => setFocused(null)}
                        className="bg-transparent text-gray-900 placeholder-gray-400 text-sm w-full outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
                    Your Message
                  </label>
                  <div
                    className={`flex gap-3 rounded-xl px-4 py-3 border bg-gray-50 transition-all duration-200 ${
                      focused === 'message'
                        ? 'border-emerald-400 ring-2 ring-emerald-400/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <FiMessageSquare
                      size={15}
                      className={`mt-0.5 flex-shrink-0 ${focused === 'message' ? 'text-emerald-400' : 'text-gray-400'}`}
                    />
                    <textarea
                      rows={4}
                      placeholder="Tell us your preferred dates, group size, and any special requests…"
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused(null)}
                      className="bg-transparent text-gray-900 placeholder-gray-400 text-sm w-full outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Send button */}
                <button
                  type="submit"
                  className="group flex items-center justify-center gap-2.5 bg-[#034d27] hover:bg-[#09522f] text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition transform duration-150 hover:-translate-y-0.5 active:scale-95"
                >
                  <FiSend size={15} />
                  <span>Send Message</span>
                  <FiChevronRight
                    size={15}
                    className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200"
                  />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}