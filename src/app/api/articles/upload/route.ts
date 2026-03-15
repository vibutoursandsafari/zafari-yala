import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { adminAuth } from '@/lib/firebaseAdmin';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function requireAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice('Bearer '.length);
  try {
    return await adminAuth.verifyIdToken(token);
  } catch {
    return null;
  }
}

// This route verifies the user's authentication before allowing them perform upload using this API.
// Verify - adminAuth.verifyIdToken(token);

/* Firebase Admin SDK runs with full previleges, but we still want to 
   verify the user's identity before allowing them to upload images.
   This is a simple check to ensure that only authenticated users can upload images, 
   even though the Firebase Admin SDK itself has full access to the database and storage. */

/* even though Cloudinary calls happen server-side (with your secret), the upload endpoint would
  let anyone store files into your Cloudinary account if left open. */

export async function POST(request: NextRequest) {
  try {
    const decoded = await requireAuth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'zafari-articles',
      resource_type: 'image',
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Article image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
