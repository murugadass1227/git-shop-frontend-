'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  PackagePlus,
  ShieldCheck,
  Sparkles,
  Tags,
} from 'lucide-react';
import { getUploadUrl } from '@/lib/api';
import { productService, type CreateProductPayload } from '@/services/productService';

const DEFAULT_CATEGORIES = ['Mugs', 'Frames', 'Crystals', 'Apparel', 'Corporate', 'Novelty'];
const DEFAULT_OCCASIONS = ['Birthday', 'Anniversary', 'Wedding', 'Corporate'];
const WORKFLOW_HINTS = [
  'Product name, price and category are required before publishing.',
  'Upload multiple images to give admin a quick preview before save.',
  'Occasions and customization help the item surface in filtered collections.',
];

export function AddProductForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<CreateProductPayload>({
    name: '',
    price: 0,
    category: '',
    description: '',
    customizable: true,
    occasions: [],
    images: [],
    discountPercent: 0,
    rating: 0,
  });
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);

  const toggleOccasion = (occasion: string) => {
    const currentOccasions = form.occasions ?? [];
    const nextOccasions = currentOccasions.includes(occasion)
      ? currentOccasions.filter((item) => item !== occasion)
      : [...currentOccasions, occasion];

    setForm((current) => ({ ...current, occasions: nextOccasions }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    event.target.value = '';

    if (!files?.length) return;

    const validImages = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (validImages.length === 0) {
      setError('Please select valid image files only.');
      return;
    }

    const previewUrls = validImages.map((file) => URL.createObjectURL(file));
    setPendingPreviews((current) => [...current, ...previewUrls]);
    setUploading(true);
    setError('');

    try {
      const { paths } = await productService.uploadImages(validImages);
      setForm((current) => ({ ...current, images: [...(current.images ?? []), ...paths] }));
      setPendingPreviews((current) => current.filter((url) => !previewUrls.includes(url)));
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    } catch (uploadError) {
      setError((uploadError as Error).message || 'Upload failed. Make sure the backend is running.');
    } finally {
      setUploading(false);
    }
  };

  const allImageEntries = [
    ...(form.images ?? []).map((path) => ({ type: 'server' as const, path })),
    ...pendingPreviews.map((objectUrl) => ({ type: 'pending' as const, objectUrl })),
  ];

  const removeImage = (index: number) => {
    const uploadedImageCount = (form.images ?? []).length;

    if (index < uploadedImageCount) {
      setForm((current) => ({
        ...current,
        images: (current.images ?? []).filter((_, imageIndex) => imageIndex !== index),
      }));
      return;
    }

    const objectUrl = pendingPreviews[index - uploadedImageCount];
    URL.revokeObjectURL(objectUrl);
    setPendingPreviews((current) => current.filter((item) => item !== objectUrl));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Product name is required.');
      return;
    }

    if (!form.category.trim()) {
      setError('Category is required.');
      return;
    }

    if (form.price < 0) {
      setError('Price must be 0 or more.');
      return;
    }

    setLoading(true);

    try {
      await productService.create({
        ...form,
        name: form.name.trim(),
        category: form.category.trim(),
        description: form.description?.trim() ?? '',
        images: form.images?.filter(Boolean) ?? [],
        occasions: form.occasions ?? [],
      });
      router.push('/admin/products');
    } catch (submitError) {
      setError((submitError as Error).message || 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-rose-100/70 p-6 shadow-[0_20px_60px_-30px_rgba(244,114,182,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-pink-600 transition hover:text-pink-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to product management
            </Link>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">Catalog creation</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Create a product and publish it into the gift catalog</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Use this admin workspace to add the product basics, upload gallery images, apply occasion tags and enable personalization-ready
              settings.
            </p>
          </div>

          <div className="grid gap-3 sm:w-[320px]">
            {WORKFLOW_HINTS.map((hint) => (
              <div key={hint} className="rounded-[22px] border border-white/70 bg-white/90 px-4 py-3 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{hint}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <section className="space-y-6">
          <div className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
                <PackagePlus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Product basics</h3>
                <p className="text-sm text-slate-500">Fill the core details that customers see in the storefront.</p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Product name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="e.g. Floral photo mug"
                  className="w-full rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1}
                    value={form.price || ''}
                    onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) || 0 }))}
                    placeholder="499"
                    className="w-full rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Category *</label>
                  <select
                    required
                    value={form.category}
                    onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                    className="w-full rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                  >
                    <option value="">Select category</option>
                    {DEFAULT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={form.description ?? ''}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Describe the product, gifting use case and its standout details"
                  rows={5}
                  className="w-full rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-600">
                <ImagePlus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Product images</h3>
                <p className="text-sm text-slate-500">Upload visuals now so the admin team can verify the listing before publish.</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="rounded-[24px] border-2 border-dashed border-pink-200 bg-pink-50/50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Upload gallery or preview images</p>
                    <p className="mt-1 text-sm text-slate-500">Any image format is supported. Multiple files are supported.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploading ? 'Uploading...' : 'Choose images'}
                  </button>
                </div>
              </div>

              {allImageEntries.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {allImageEntries.map((entry, index) => (
                    <div key={entry.type === 'server' ? `server-${entry.path}-${index}` : `pending-${index}`} className="group relative">
                      <div className="overflow-hidden rounded-[22px] border border-pink-100 bg-pink-50">
                        <img
                          src={entry.type === 'server' ? getUploadUrl(entry.path) ?? '' : entry.objectUrl}
                          alt=""
                          className="h-44 w-full object-cover"
                          onError={(event) => {
                            (event.target as HTMLImageElement).src =
                              'data:image/svg+xml,' +
                              encodeURIComponent(
                                '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect fill="%23fce7f3" width="320" height="180"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239d174d" font-size="16">Preview unavailable</text></svg>',
                              );
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-3 top-3 rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white opacity-0 shadow transition group-hover:opacity-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Or paste image URLs</label>
                <textarea
                  value={(form.images ?? []).filter((path) => path.startsWith('http')).join('\n')}
                  onChange={(event) => {
                    const remoteUrls = event.target.value
                      .split('\n')
                      .map((value) => value.trim())
                      .filter(Boolean);
                    const uploadedPaths = (form.images ?? []).filter((path) => !path.startsWith('http'));
                    setForm((current) => ({ ...current, images: [...uploadedPaths, ...remoteUrls] }));
                  }}
                  rows={3}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <Tags className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Merchandising options</h3>
                <p className="text-sm text-slate-500">Set discovery tags and personalization switches for the product.</p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Occasions</label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_OCCASIONS.map((occasion) => {
                    const isActive = form.occasions?.includes(occasion);

                    return (
                      <button
                        key={occasion}
                        type="button"
                        onClick={() => toggleOccasion(occasion)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          isActive ? 'bg-pink-500 text-white shadow-sm' : 'bg-pink-50 text-slate-700 hover:bg-pink-100'
                        }`}
                      >
                        {occasion}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="flex items-start gap-3 rounded-[22px] border border-pink-100 bg-pink-50/60 px-4 py-4">
                <input
                  type="checkbox"
                  checked={form.customizable ?? true}
                  onChange={(event) => setForm((current) => ({ ...current, customizable: event.target.checked }))}
                  className="mt-1 h-4 w-4 rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-900">Customizable product</span>
                  <span className="mt-1 block text-sm text-slate-500">Enable name, photo, note or other personalization fields later.</span>
                </span>
              </label>

              <div className="grid gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Discount %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.discountPercent ?? 0}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, discountPercent: Number(event.target.value) || 0 }))
                    }
                    className="w-full rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Rating (0 - 5)</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    value={form.rating ?? 0}
                    onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) || 0 }))}
                    className="w-full rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-pink-100 bg-slate-900 p-6 text-white shadow-[0_18px_50px_-35px_rgba(15,23,42,0.85)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-pink-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Admin publish checklist</h3>
                <p className="text-sm text-slate-300">A quick final review before you save the product.</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                'Confirm the category matches the product listing section.',
                'Add at least one preview image for the catalog card.',
                'Turn on customization only for products that need extra input.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-pink-300" />
                  <p className="text-sm leading-6 text-slate-200">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Saving product...' : 'Add product'}
              </button>
              <Link
                href="/admin/products"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Cancel
              </Link>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
