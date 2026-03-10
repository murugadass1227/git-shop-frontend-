'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Eye,
  ImagePlus,
  Package,
  PencilLine,
  RefreshCcw,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Wallet,
  X,
} from 'lucide-react';
import { getUploadUrl, type Product } from '@/lib/api';
import { productService } from '@/services/productService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

function formatPrice(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function getProductImage(product: Product) {
  const image = product.images?.[0];
  return getUploadUrl(image);
}

type EditorMode = 'edit' | 'price' | 'images';

type ProductFormState = {
  name: string;
  price: string;
  category: string;
  description: string;
  customizable: boolean;
  occasionsText: string;
  discountPercent: string;
  rating: string;
  images: string[];
};

function toFormState(product: Product): ProductFormState {
  return {
    name: product.name ?? '',
    price: String(product.price ?? 0),
    category: product.category ?? '',
    description: product.description ?? '',
    customizable: Boolean(product.customizable),
    occasionsText: product.occasions?.join(', ') ?? '',
    discountPercent: String(product.discountPercent ?? 0),
    rating: String(product.rating ?? 0),
    images: product.images ?? [],
  };
}

export default function AdminAllProductsPage() {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>('edit');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [pendingImageFiles, setPendingImageFiles] = useState<File[]>([]);
  const [pendingImagePreviews, setPendingImagePreviews] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await productService.list({ limit: 100 });
      setProducts(response.items ?? []);
      setError('');
    } catch {
      setError('Products could not be loaded right now. Please try refreshing.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (editorOpen || pendingImagePreviews.length === 0) return;
    pendingImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setPendingImagePreviews([]);
    setPendingImageFiles([]);
  }, [editorOpen]);

  const openEditor = (product: Product, mode: EditorMode) => {
    setSelectedProduct(product);
    setEditorMode(mode);
    setForm(toFormState(product));
    setPendingImageFiles([]);
    setPendingImagePreviews([]);
    setSaveError('');
    setEditorOpen(true);
  };

  const handleEditorUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    event.target.value = '';

    if (!files?.length || !form) return;

    const validImages = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (validImages.length === 0) {
      setSaveError('Please choose image files only.');
      return;
    }

    const previewUrls = validImages.map((file) => URL.createObjectURL(file));
    setPendingImageFiles((current) => [...current, ...validImages]);
    setPendingImagePreviews((current) => [...current, ...previewUrls]);
    setSaveError('');
  };

  const handleSaveProduct = async () => {
    if (!selectedProduct || !form) return;

    if (!form.name.trim()) {
      setSaveError('Product name is required.');
      return;
    }

    if (!form.category.trim()) {
      setSaveError('Category is required.');
      return;
    }

    setSaving(true);
    setSaveError('');

    try {
      let nextImages = [...form.images];

      if (pendingImageFiles.length > 0) {
        setUploadingImages(true);
        const { paths } = await productService.uploadImages(pendingImageFiles);
        nextImages = [...nextImages, ...paths];
      }

      const updated = await productService.update(selectedProduct._id, {
        name: form.name.trim(),
        price: Number(form.price) || 0,
        category: form.category.trim(),
        description: form.description.trim(),
        customizable: form.customizable,
        occasions: form.occasionsText
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        discountPercent: Number(form.discountPercent) || 0,
        rating: Number(form.rating) || 0,
        images: nextImages,
      });

      setProducts((current) => current.map((product) => (product._id === updated._id ? updated : product)));
      setSelectedProduct(updated);
      setActionMessage(`${updated.name} updated successfully.`);
      setPendingImageFiles([]);
      setPendingImagePreviews([]);
      setEditorOpen(false);
    } catch (updateError) {
      setSaveError((updateError as Error).message || 'Failed to update product.');
    } finally {
      setUploadingImages(false);
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await productService.remove(deleteTarget._id);
      setProducts((current) => current.filter((product) => product._id !== deleteTarget._id));
      setActionMessage(`${deleteTarget.name} deleted successfully.`);
      setDeleteTarget(null);
      if (selectedProduct?._id === deleteTarget._id) {
        setPendingImageFiles([]);
        setPendingImagePreviews([]);
        setEditorOpen(false);
      }
    } catch (deleteError) {
      setSaveError((deleteError as Error).message || 'Failed to delete product.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;

    return products.filter((product) =>
      [product.name, product.category, product.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [products, search]);

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-rose-100/70 p-6 shadow-[0_20px_60px_-30px_rgba(244,114,182,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">All products</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">See every product added to the store</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              When you add new products, they will appear here. Use the search box to quickly find a product by name, category or description.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/add-product"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Sparkles className="h-4 w-4" />
              Add product
            </Link>
            <button
              type="button"
              onClick={() => loadProducts(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm font-medium text-pink-700 transition hover:bg-pink-50 disabled:opacity-60"
            >
              <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh list'}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total loaded products</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{products.length}</p>
          </div>
          <div className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Filtered products</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{filteredProducts.length}</p>
          </div>
          <div className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Customizable products</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{products.filter((product) => product.customizable).length}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Product list</h3>
            <p className="mt-1 text-sm text-slate-500">Added products will be shown here in real time from the product API.</p>
          </div>

          <label className="flex min-w-[260px] items-center gap-3 rounded-2xl border border-pink-100 bg-pink-50/60 px-4 py-3">
            <Search className="h-4 w-4 text-pink-500" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        {actionMessage && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {actionMessage}
          </div>
        )}

        {loading ? (
          <div className="mt-8 flex min-h-[220px] items-center justify-center">
            <div className="h-10 w-10 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-[24px] border border-dashed border-pink-200 bg-pink-50/50 px-6 py-12 text-center">
            <Package className="mx-auto h-10 w-10 text-pink-400" />
            <h4 className="mt-4 text-lg font-semibold text-slate-900">No products found</h4>
            <p className="mt-2 text-sm text-slate-500">
              {products.length === 0
                ? 'You have not added any products yet. Create one and it will appear here.'
                : 'No products match your current search.'}
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {filteredProducts.map((product) => {
              const imageUrl = getProductImage(product);

              return (
                <div key={product._id} className="rounded-[24px] border border-pink-100 bg-pink-50/35 p-5">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[22px] border border-pink-100 bg-white">
                      {imageUrl ? (
                        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-pink-400">
                          <Package className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="truncate text-lg font-semibold text-slate-900">{product.name}</h4>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-pink-700">{product.category}</span>
                        {product.customizable && (
                          <span className="rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-semibold text-fuchsia-700">Customizable</span>
                        )}
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                        {product.description || 'No description added for this product yet.'}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                        <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-slate-900">{formatPrice(product.price)}</span>
                        <span className="rounded-full bg-white px-3 py-1.5 text-slate-600">{product.occasions?.length || 0} occasions</span>
                        <span className="rounded-full bg-white px-3 py-1.5 text-slate-600">{product.images?.length || 0} images</span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => openEditor(product, 'edit')}
                          className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-pink-700 transition hover:bg-pink-50"
                        >
                          <PencilLine className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditor(product, 'price')}
                          className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-pink-700 transition hover:bg-pink-50"
                        >
                          <Wallet className="h-4 w-4" />
                          Set price
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditor(product, 'images')}
                          className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-pink-700 transition hover:bg-pink-50"
                        >
                          <ImagePlus className="h-4 w-4" />
                          Update images
                        </button>
                        <Link
                          href={`/products/${product._id}`}
                          className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-pink-700 transition hover:bg-pink-50"
                        >
                          <Eye className="h-4 w-4" />
                          View product
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setSaveError('');
                            setDeleteTarget(product);
                          }}
                          className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editorMode === 'edit' && 'Edit product'}
              {editorMode === 'price' && 'Set product price'}
              {editorMode === 'images' && 'Update product images'}
            </DialogTitle>
            <DialogDescription>
              {editorMode === 'edit' && 'Update product details and save them in real time.'}
              {editorMode === 'price' && 'Change price, discount and rating for this product.'}
              {editorMode === 'images' && 'Upload new product images or remove old ones, then save.'}
            </DialogDescription>
          </DialogHeader>

          {form && (
            <div className="space-y-5">
              {saveError && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {saveError}
                </div>
              )}

              {editorMode !== 'price' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Product name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => setForm((current) => (current ? { ...current, name: event.target.value } : current))}
                      className="w-full rounded-2xl border border-pink-200 px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(event) => setForm((current) => (current ? { ...current, category: event.target.value } : current))}
                      className="w-full rounded-2xl border border-pink-200 px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    />
                  </div>
                </div>
              )}

              {(editorMode === 'edit' || editorMode === 'price') && (
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Price</label>
                    <input
                      type="number"
                      min={0}
                      value={form.price}
                      onChange={(event) => setForm((current) => (current ? { ...current, price: event.target.value } : current))}
                      className="w-full rounded-2xl border border-pink-200 px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Discount %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={form.discountPercent}
                      onChange={(event) =>
                        setForm((current) => (current ? { ...current, discountPercent: event.target.value } : current))
                      }
                      className="w-full rounded-2xl border border-pink-200 px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Rating</label>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                      value={form.rating}
                      onChange={(event) => setForm((current) => (current ? { ...current, rating: event.target.value } : current))}
                      className="w-full rounded-2xl border border-pink-200 px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    />
                  </div>
                </div>
              )}

              {editorMode === 'edit' && (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
                    <textarea
                      rows={4}
                      value={form.description}
                      onChange={(event) => setForm((current) => (current ? { ...current, description: event.target.value } : current))}
                      className="w-full rounded-2xl border border-pink-200 px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Occasions</label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-3.5 h-4 w-4 text-pink-500" />
                        <input
                          type="text"
                          value={form.occasionsText}
                          onChange={(event) =>
                            setForm((current) => (current ? { ...current, occasionsText: event.target.value } : current))
                          }
                          placeholder="Birthday, Anniversary, Wedding"
                          className="w-full rounded-2xl border border-pink-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-pink-50/60 px-4 py-3 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={form.customizable}
                        onChange={(event) =>
                          setForm((current) => (current ? { ...current, customizable: event.target.checked } : current))
                        }
                        className="rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                      />
                      Customizable
                    </label>
                  </div>
                </>
              )}

              {(editorMode === 'edit' || editorMode === 'images') && (
                <div className="space-y-4 rounded-[24px] border border-pink-100 bg-pink-50/35 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Product images</p>
                      <p className="text-sm text-slate-500">Upload product images and remove the ones you do not need.</p>
                    </div>
                    <input
                      ref={uploadInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleEditorUpload}
                    />
                    <button
                      type="button"
                      onClick={() => uploadInputRef.current?.click()}
                      disabled={uploadingImages}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-pink-700 shadow-sm transition hover:bg-pink-50 disabled:opacity-60"
                    >
                      <ImagePlus className="h-4 w-4" />
                      {pendingImageFiles.length > 0 ? `${pendingImageFiles.length} image(s) selected` : 'Choose images'}
                    </button>
                  </div>

                  {form.images.length === 0 && pendingImagePreviews.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-pink-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
                      No product images added yet.
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {form.images.map((image, index) => (
                        <div key={`${image}-${index}`} className="rounded-[22px] border border-pink-100 bg-white p-3">
                          <div className="h-32 overflow-hidden rounded-2xl bg-pink-50">
                            <img
                              src={getUploadUrl(image) ?? ''}
                              alt=""
                              className="h-full w-full object-cover"
                              onError={(event) => {
                                (event.target as HTMLImageElement).src =
                                  'data:image/svg+xml,' +
                                  encodeURIComponent(
                                    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect fill="%23fce7f3" width="320" height="180"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239d174d" font-size="16">Image unavailable</text></svg>',
                                  );
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setForm((current) =>
                                current ? { ...current, images: current.images.filter((_, imageIndex) => imageIndex !== index) } : current,
                              )
                            }
                            className="mt-3 inline-flex items-center gap-2 rounded-full border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                          >
                            <X className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>
                      ))}

                      {pendingImagePreviews.map((previewUrl, index) => (
                        <div key={`pending-${previewUrl}-${index}`} className="rounded-[22px] border border-pink-100 bg-white p-3">
                          <div className="h-32 overflow-hidden rounded-2xl bg-pink-50">
                            <img src={previewUrl} alt="" className="h-full w-full object-cover opacity-80" />
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
                              <ImagePlus className="h-3.5 w-3.5" />
                              Ready to upload
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                URL.revokeObjectURL(previewUrl);
                                setPendingImageFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
                                setPendingImagePreviews((current) => current.filter((_, previewIndex) => previewIndex !== index));
                              }}
                              className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                            >
                              <X className="h-3.5 w-3.5" />
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                pendingImagePreviews.forEach((url) => URL.revokeObjectURL(url));
                setPendingImageFiles([]);
                setPendingImagePreviews([]);
                setEditorOpen(false);
              }}
              className="border-pink-200"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProduct} disabled={saving || uploadingImages} className="bg-pink-600 text-white hover:bg-pink-700">
              {saving ? (uploadingImages ? 'Uploading and saving...' : 'Saving...') : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete product</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `Are you sure you want to delete "${deleteTarget.name}"? This action will remove the product and its uploaded images.`
                : 'Are you sure you want to delete this product?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="border-pink-200">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
