'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { GalleryImage } from '@/types/gallery';
import { getGalleryImages } from '@/services/galleryService';

const spanPattern = [
  'row-span-2', 'row-span-1', 'row-span-1', 'row-span-2',
  'row-span-1', 'row-span-2', 'row-span-1', 'row-span-1',
];

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await getGalleryImages();
        // Get only the latest 8 images
        setGalleryImages(images.slice(0, 8));
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  // Get first 5 images for mobile
  const mobileImages = galleryImages.slice(0, 5);

  return (
    <section className="bg-gray-900 py-12 md:py-14">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="mb-8 md:mb-12 md:flex md:items-center md:justify-between">
          <div className="md:pr-8">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">
              Gallery
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 text-left">
              Captured <span className="text-white">Moments</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl">
              Experience the breathtaking beauty of Yala through our lens
            </p>
          </div>

          {/* View Gallery Button - top right */}
          <div className="mt-4 md:mt-0 md:self-center">
            <Link href="/gallery" className="group flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-full font-semibold text-sm md:text-base transform transition-transform duration-300 hover:-translate-y-1 hover:scale-105">
              <span>View Gallery</span>
              <FiArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="animate-spin w-10 h-10 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : galleryImages.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No images yet</h3>
            <p className="text-gray-500 mb-4">Visit the gallery to upload images</p>
            <Link href="/gallery" className="text-amber-500 hover:text-amber-400 font-medium">
              Go to Gallery →
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Masonry Gallery - 8 images */}
            <div className="hidden md:grid grid-cols-4 auto-rows-[200px] gap-4 mb-10">
              {galleryImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`relative group overflow-hidden rounded-lg ${spanPattern[index % spanPattern.length]} cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:z-10`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
              {/* View more tile to fill the grid bottom-right */}
              <Link href="/gallery" className="relative group overflow-hidden rounded-lg cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:z-10 flex items-center justify-center bg-white/5 border border-white/10">
                <div className="text-center px-4 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-amber-400 font-semibold text-lg">View More</p>
                    <FiArrowRight className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-white text-xs mt-1">See the full gallery</p>
                </div>
              </Link>
            </div>

            {/* Mobile Masonry Gallery - 5 images */}
            <div className="grid md:hidden grid-cols-2 auto-rows-[180px] gap-3 mb-8">
              {mobileImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`relative group overflow-hidden rounded-lg ${
                    index === 0 || index === 3 ? 'row-span-2' : 'row-span-1'
                  } cursor-pointer`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
