import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import admin from 'firebase-admin';

/* writing via Admin SDK bypasses Firestore rules, so the server must enforce who may create articles.
Token verification ensures only logged-in/authorized users can write. */

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice('Bearer '.length);
    try {
      await adminAuth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, category, author, images } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    if (images !== undefined) {
      if (!Array.isArray(images)) {
        return NextResponse.json({ error: 'Images must be an array' }, { status: 400 });
      }
      if (images.length > 5) {
        return NextResponse.json({ error: 'Maximum 5 images allowed' }, { status: 400 });
      }
    }

    const docRef = await adminDb.collection('articles').add({
      title,
      content,
      category: category || '',
      author: author || '',
      images: Array.isArray(images)
        ? images.map((img: any) => ({ url: img?.url, publicId: img?.publicId }))
        : [],
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
