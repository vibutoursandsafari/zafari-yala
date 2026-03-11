"use client";

import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";

const tourCategories = [
  { id: 1, src: "/assets/images/about1.jpg", title: "Elephant Trails" },
  { id: 2, src: "/assets/images/about2.jpg", title: "Leopard Safari" },
  { id: 3, src: "/assets/images/about3.jpg", title: "Bird Watching" },
  { id: 4, src: "/assets/images/about4.jpg", title: "Wildlife Photography" },
  { id: 5, src: "/assets/images/about5.jpg", title: "Camping Safari" },
];

export default function About() {
  return (
    <section
      className="py-20 text-center relative"
      style={{
        backgroundImage: "url('/assets/images/about_cover.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/80"></div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <p className="text-teal-600 font-dancing text-2xl mb-2">
          Create an Unforgettable Safari Experience
        </p>
        <h2 className="text-4xl font-bold mb-12 text-gray-800">The Finest Safari Adventure with Ravidu Yala Safari</h2>

        {/* Image Cards */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {tourCategories.map((item, index) => (
            <div
              key={item.id}
              className={`group relative w-52 cursor-pointer transition-all duration-300 hover:scale-105 ${
                index === 2 ? "rotate-0 scale-105 z-10" : index % 2 === 0 ? "rotate-[-4deg]" : "rotate-[4deg]"
              } hover:rotate-0`}
            >
              <div className={`relative w-full overflow-hidden rounded-2xl shadow-lg border-4 border-white ${
                index === 2 ? "h-72" : "h-64"
              }`}>
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>
                <p className="text-teal-600 text-sm cursor-pointer hover:underline">
                  Read More
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          <span className="w-3 h-3 rounded-full bg-teal-600"></span>
          <span className="w-3 h-3 rounded-full bg-gray-300"></span>
          <span className="w-3 h-3 rounded-full bg-gray-300"></span>
          <span className="w-3 h-3 rounded-full bg-gray-300"></span>
          <span className="w-3 h-3 rounded-full bg-gray-300"></span>
        </div>

        {/* Call to Action Section */}
        <div className="mt-20 flex flex-col lg:flex-row items-start justify-between gap-16 text-left px-4 lg:px-12">
          {/* Left Side - Content */}
          <div className="flex-1 max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Planning your next wildlife adventure?
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6 text-base">
              At Ravidu Yala Safari™, we specialize in delivering refined and unforgettable wildlife experiences in Yala, Sri Lanka. With over 3 years of expertise, we combine professional guidance, personalized service, and premium comfort to create safari journeys that are both thrilling and elegant. Our passion is to turn every adventure into a timeless memory.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6 text-base italic border-l-4 border-teal-600 pl-4">
              &ldquo;Get in touch with us and enjoy an incredible safari journey in Yala, Sri Lanka.
              We&apos;ll help you create unforgettable memories that last a lifetime.&rdquo;
            </p>
            <p className="text-gray-800 font-semibold">
              — The Ravidu Yala Safari Team
            </p>
          </div>

          {/* Right Side - Experience Badge */}
          <div className="flex-1 flex flex-col items-center lg:items-end">
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
                  href="https://wa.me/94XXXXXXXXXX"
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
    </section>
  );
}