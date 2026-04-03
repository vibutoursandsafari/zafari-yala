'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { addGalleryImage } from '@/services/galleryService';
import { FiImage, FiPenTool, FiUploadCloud, FiLogOut, FiCheckCircle, FiCamera } from 'react-icons/fi';
import Image from 'next/image';

// slug generator
const slugify = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100);

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'article' | 'gallery'>('article');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Article form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Gallery form state
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryAlt, setGalleryAlt] = useState('');
  const [galleryPreviewUrl, setGalleryPreviewUrl] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryMessage, setGalleryMessage] = useState<string | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      setMessage('Maximum 5 images allowed');
      setSelectedFiles(files.slice(0, 5));
      return;
    }
    setSelectedFiles(files);
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setGalleryMessage(null);

    if (!file) {
      setGalleryFile(null);
      setGalleryPreviewUrl('');
      return;
    }

    setGalleryFile(file);
    setGalleryPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!title.trim() || !content.trim()) {
      setMessage('Title and content are required');
      return;
    }

    if (selectedFiles.length > 5) {
      setMessage('Maximum 5 images allowed');
      return;
    }

    if (!user) {
      setMessage('Unauthorized');
      return;
    }

    const token = await user.getIdToken();

    setSaving(true);
    try {
      const rawSlug = slugify(title || '');
      const slug = rawSlug && rawSlug.length > 0
        ? rawSlug
        : `untitled-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;
      // Upload images first (if any)
      const uploadedImages: Array<{ url: string; publicId?: string }> = [];
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('/api/articles/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadRes.ok) {
          const uploadData = await uploadRes.json().catch(() => ({}));
          throw new Error(uploadData?.error || 'Failed to upload image');
        }

        const uploadData = await uploadRes.json();
        uploadedImages.push({ url: uploadData.url, publicId: uploadData.publicId });
      }

      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, slug, content, category, author, images: uploadedImages }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Failed to create article');
      }

      const data = await res.json();
      setMessage('Article created (id: ' + data.id + ')');
      setTitle('');
      setContent('');
      setCategory('');
      setAuthor('');
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Failed to create article');
    } finally {
      setSaving(false);
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGalleryMessage(null);

    if (!galleryFile || !galleryAlt.trim()) {
      setGalleryMessage('Image and description are required');
      return;
    }

    if (!user) {
      setGalleryMessage('Unauthorized');
      return;
    }

    const token = await user.getIdToken();

    setUploadingGallery(true);
    try {
      const formData = new FormData();
      formData.append('file', galleryFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const data = await uploadResponse.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to upload image');
      }

      const { url, publicId } = await uploadResponse.json();

      await addGalleryImage({
        url,
        alt: galleryAlt.trim(),
        publicId,
      });

      setGalleryMessage('Gallery image uploaded successfully');
      setGalleryFile(null);
      setGalleryAlt('');
      setGalleryPreviewUrl('');
      if (galleryFileInputRef.current) {
        galleryFileInputRef.current.value = '';
      }
    } catch (err: unknown) {
      setGalleryMessage(err instanceof Error ? err.message : 'Failed to upload gallery image');
    } finally {
      setUploadingGallery(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f5f7f2_0%,#ebf4e5_45%,#dfeedd_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_30px_90px_-30px_rgba(24,63,42,0.35)] backdrop-blur-sm">
        <header className="border-b border-emerald-900/10 px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-800">Admin workspace</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-emerald-950 sm:text-4xl">
                Dashboard Control Center
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-emerald-900/70 sm:text-base">
                Choose a section to publish articles or upload gallery images.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </header>

        <main className="px-6 py-6 sm:px-8 sm:py-8">
          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setActiveTab('article')}
              className={`group rounded-2xl border p-5 text-left transition ${
                activeTab === 'article'
                  ? 'border-emerald-600 bg-emerald-50 shadow-lg shadow-emerald-100'
                  : 'border-emerald-900/10 bg-white hover:border-emerald-400 hover:bg-emerald-50/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${activeTab === 'article' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                  <FiPenTool size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-emerald-950">Publish Article</h2>
                  <p className="text-sm text-emerald-900/70">Write and publish safari stories</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`group rounded-2xl border p-5 text-left transition ${
                activeTab === 'gallery'
                  ? 'border-emerald-600 bg-emerald-50 shadow-lg shadow-emerald-100'
                  : 'border-emerald-900/10 bg-white hover:border-emerald-400 hover:bg-emerald-50/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${activeTab === 'gallery' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                  <FiImage size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-emerald-950">Upload Gallery</h2>
                  <p className="text-sm text-emerald-900/70">Add images for the public gallery</p>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-8 rounded-3xl border border-emerald-900/10 bg-white p-6 sm:p-8">
            {activeTab === 'article' ? (
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
                    <FiPenTool size={18} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-emerald-950">Publish Article</h2>
                    <p className="text-sm text-emerald-900/70">Create a new article and attach up to 5 images.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-emerald-900">Images (max 5)</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFilesChange}
                      className="block w-full cursor-pointer rounded-xl border border-dashed border-emerald-900/20 bg-emerald-50/50 p-3 text-sm text-emerald-950 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700"
                    />
                    <div className="mt-2 text-xs text-emerald-900/60">{selectedFiles.length} selected</div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-emerald-900">Title</label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="block w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                        placeholder="Article title"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-emerald-900">Author</label>
                      <input
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="block w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                        placeholder="Author name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-emerald-900">Content</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="block min-h-40 w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                      placeholder="Write the full article here..."
                      required
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-emerald-900">Category</label>
                      <input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="block w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                        placeholder="e.g. Wildlife"
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="rounded-xl border border-emerald-900/10 bg-emerald-50 px-4 py-3 text-sm text-emerald-900/70">
                        <FiCheckCircle className="mb-1 text-emerald-600" size={18} />
                        Article posts are saved to Firestore and visible on the website.
                      </div>
                    </div>
                  </div>

                  {message && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0f6b3a_0%,#15803d_55%,#166534_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_-12px_rgba(15,107,58,0.8)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiUploadCloud />
                    {saving ? 'Publishing...' : 'Publish Article'}
                  </button>
                </form>
              </section>
            ) : (
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
                    <FiCamera size={18} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-emerald-950">Upload Gallery</h2>
                    <p className="text-sm text-emerald-900/70">Add an image and description for the public gallery.</p>
                  </div>
                </div>

                <form onSubmit={handleGallerySubmit} className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-emerald-900">Gallery Image</label>
                    <input
                      ref={galleryFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryFileChange}
                      className="block w-full cursor-pointer rounded-xl border border-dashed border-emerald-900/20 bg-emerald-50/50 p-3 text-sm text-emerald-950 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700"
                    />
                  </div>

                  {galleryPreviewUrl && (
                    <div className="relative h-56 overflow-hidden rounded-2xl border border-emerald-900/10 bg-emerald-50">
                      <Image src={galleryPreviewUrl} alt="Preview" fill className="object-cover" unoptimized />
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-emerald-900">Image Description</label>
                    <input
                      value={galleryAlt}
                      onChange={(e) => setGalleryAlt(e.target.value)}
                      className="block w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                      placeholder="Describe the image..."
                      required
                    />
                  </div>

                  {galleryMessage && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
                      {galleryMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploadingGallery}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0f6b3a_0%,#15803d_55%,#166534_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_-12px_rgba(15,107,58,0.8)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiUploadCloud />
                    {uploadingGallery ? 'Uploading...' : 'Upload Gallery Image'}
                  </button>
                </form>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
