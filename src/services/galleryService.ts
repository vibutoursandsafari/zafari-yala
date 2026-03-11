import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { GalleryImage } from '@/types/gallery';

const COLLECTION_NAME = 'gallery';

// Add a new image to gallery
export const addGalleryImage = async (
  imageData: Omit<GalleryImage, 'id' | 'createdAt'>
): Promise<GalleryImage> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...imageData,
    createdAt: Timestamp.now(),
  });

  return {
    id: docRef.id,
    ...imageData,
    createdAt: new Date().toISOString(),
  };
};

// Get all gallery images
export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      url: data.url,
      alt: data.alt,
      publicId: data.publicId,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
    };
  });
};

// Delete a gallery image
export const deleteGalleryImage = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};