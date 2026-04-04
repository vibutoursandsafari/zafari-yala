'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { GalleryImage } from '@/types/gallery';
import { getGalleryImages } from '@/services/galleryService';

const spanPattern = [
  'row-span-2', 'row-span-1', 'row-span-1', 'row-span-2',
  'row-span-1', 'row-span-2', 'row-span-1', 'row-span-1',
];

export default function GalleryPage() {
  const [uploadedImages, setUploadedImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch uploaded images from Firebase on mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await getGalleryImages();
        setUploadedImages(images);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <main className="min-h-screen pt-28 pb-16 bg-[linear-gradient(135deg,#f5f7f2_0%,#eaf4e4_45%,#dfeedd_100%)] font-sans">
      <div className="container mx-auto px-6 md:px-26 lg:px-32">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-10 md:mb-14">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">
              Gallery
            </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-950 mb-4">
                Gallery - Yala Wild Spirit
            </h1>
              <p className="text-gray-800 text-sm md:text-base max-w-2xl">
              Experience the breathtaking beauty of Yala through our lens. Explore the wildlife, landscapes, and unforgettable moments captured on safari.
            </p>
          </div>
          {/* Right: total images */}
          <div className="hidden md:flex items-center ml-6 text-sm text-emerald-900/70">
            <span className="font-medium">Total {uploadedImages.length} images.</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin w-10 h-10 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : uploadedImages.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No images yet</h3>
            <p className="text-gray-500 mb-6">No gallery images are available yet.</p>
          </div>
        ) : (
          /* Masonry Gallery Grid */
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-3 md:gap-4">
            {uploadedImages.map((image, index) => (
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
          </div>
        )}
      </div>
    </main>
  );
}
