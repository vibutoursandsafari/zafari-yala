import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Review } from '@/types/review';

const COLLECTION_NAME = 'reviews';

type CreateReviewInput = Omit<Review, 'id' | 'createdAt'>;

type ReviewDoc = {
  name?: string;
  message?: string;
  rating?: number;
  createdAt?: { toDate?: () => Date } | string | Date;
};

export const addReview = async (reviewData: CreateReviewInput): Promise<Review> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...reviewData,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    ...reviewData,
    createdAt: new Date().toISOString(),
  };
};

export const getReviews = async (): Promise<Review[]> => {
  const reviewsRef = collection(db, COLLECTION_NAME);
  const reviewsQuery = query(reviewsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(reviewsQuery);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as ReviewDoc;
    return {
      id: doc.id,
      name: data.name || 'Anonymous',
      message: data.message || '',
      rating: typeof data.rating === 'number' ? data.rating : 5,
      createdAt: typeof data.createdAt === 'string' || data.createdAt instanceof Date
        ? data.createdAt
        : data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    };
  });
};
