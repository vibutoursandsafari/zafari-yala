'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

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

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      setMessage('Maximum 5 images allowed');
      setSelectedFiles(files.slice(0, 5));
      return;
    }
    setSelectedFiles(files);
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
    <div className="min-h-screen flex flex-col items-stretch justify-start bg-gray-50 py-8">
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="bg-white border border-gray-300">
          {/* Single-row header: title left, logout right */}
          <header className="px-8 py-4 border-b flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </header>

          <main className="p-8">
            <section>
              <h2 className="text-xl text-black font-semibold mb-4">Publish Article</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Images (max 5)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFilesChange}
                    className="mt-1 block w-full border border-gray-400 p-2 text-gray-900"
                  />
                  <div className="mt-2 text-xs text-gray-600">
                    {selectedFiles.length} selected
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full border border-gray-400 p-2 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 block w-full border border-gray-400 p-2 h-32 text-gray-900"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1 block w-full border border-gray-400 p-2 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Author</label>
                    <input
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="mt-1 block w-full border border-gray-400 p-2 text-gray-900"
                      required
                    />
                  </div>
                </div>

                {message && (
                  <div className="text-sm text-gray-700">{message}</div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {saving ? 'Publishing...' : 'Publish Article'}
                  </button>
                </div>
              </form>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
