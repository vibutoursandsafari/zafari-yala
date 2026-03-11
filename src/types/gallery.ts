export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  publicId: string; // Cloudinary public ID for deletion
  createdAt: Date | string;
}
