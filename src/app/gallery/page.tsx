'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { GalleryImage } from '@/types/gallery';
import {
  addGalleryImage,
  getGalleryImages,
  deleteGalleryImage,
} from '@/services/galleryService';

const spanPattern = [
  'row-span-2', 'row-span-1', 'row-span-1', 'row-span-2',
  'row-span-1', 'row-span-2', 'row-span-1', 'row-span-1',
];

export default function GalleryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [imageAlt, setImageAlt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!selectedFile || !imageAlt.trim()) {
      alert('Please select an image and enter a description');
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const { url, publicId } = await uploadResponse.json();

      // Save to Firebase
      const newImage = await addGalleryImage({
        url,
        alt: imageAlt.trim(),
        publicId,
      });

      setUploadedImages((prev) => [newImage, ...prev]);
      
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setImageAlt('');
      setIsModalOpen(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle image deletion
  const handleDelete = async (image: GalleryImage) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      // Delete from Cloudinary
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: image.publicId }),
      });

      // Delete from Firebase
      await deleteGalleryImage(image.id);

      setUploadedImages((prev) => prev.filter((img) => img.id !== image.id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageAlt('');
  };

  return (
    <main className="bg-gray-900 min-h-screen pt-28 pb-16">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Page Header */}
        <div className="flex justify-between items-start mb-10 md:mb-14">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">
              Gallery
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-amber-400">Gallery</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl">
              Experience the breathtaking beauty of Yala through our lens. Explore the wildlife, landscapes, and unforgettable moments captured on safari.
            </p>
          </div>
          {/* Add Image Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center w-12 h-12 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            title="Add new image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
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
            <p className="text-gray-500 mb-6">Click the + button to upload your first image</p>
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
                
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(image);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  title="Delete image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">Add New Image</h2>

            {/* File Input */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Select Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-gray-900 hover:file:bg-amber-600 file:cursor-pointer cursor-pointer"
              />
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Alt Text Input */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Image Description
              </label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Enter image description..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={isUploading || !selectedFile}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                'Upload Image'
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
