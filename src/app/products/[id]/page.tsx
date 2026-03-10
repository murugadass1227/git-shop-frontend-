import Link from 'next/link';
import { notFound } from 'next/navigation';
import { productService } from '@/services/productService';
import { ProductDetailClient } from './ProductDetailClient';
import { Gift } from 'lucide-react';
import { getUploadUrl } from '@/lib/api';

function productImageUrl(path: string): string {
  return getUploadUrl(path) ?? '';
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  try {
    const product = await productService.get(id);
    return { title: `${product.name} — Gondget`, description: product.description };
  } catch {
    return { title: 'Product — Gondget' };
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  let product;
  try {
    product = await productService.get(id);
  } catch {
    notFound();
  }
  if (!product) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 py-6 sm:py-8 overflow-x-hidden">
      <nav className="mb-4 sm:mb-6 text-xs sm:text-sm text-slate-600 truncate">
        <Link href="/products" className="hover:text-violet-600">Shop</Link>
        <span className="mx-1 sm:mx-2">/</span>
        <span className="text-slate-800 truncate">{product.name}</span>
      </nav>
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        <div className="space-y-3 sm:space-y-4 min-w-0">
          {product.images?.length ? (
            <>
              <div className="aspect-square overflow-hidden rounded-lg sm:rounded-xl bg-slate-100">
                <img src={productImageUrl(product.images[0])} alt={product.name} className="h-full w-full object-cover" />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {product.images.map((path, i) => (
                    <button key={i} type="button" className="aspect-square overflow-hidden rounded-lg border-2 border-slate-200 bg-slate-100 touch-manipulation">
                      <img src={productImageUrl(path)} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square flex items-center justify-center rounded-xl bg-slate-100">
              <Gift className="h-16 w-16 sm:h-24 sm:w-24 text-slate-300" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 break-words">{product.name}</h1>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <p className="text-xl sm:text-2xl font-bold text-violet-600">
              ₹{product.discountPercent ? Math.round(product.price * (1 - product.discountPercent / 100)) : product.price}
            </p>
            {product.discountPercent && (
              <span className="text-xs sm:text-sm text-slate-400 line-through">₹{product.price}</span>
            )}
            {product.discountPercent && (
              <span className="rounded bg-red-500 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-white">{product.discountPercent}% OFF</span>
            )}
          </div>
          <p className="mt-3 sm:mt-4 text-slate-600 text-sm sm:text-base">{product.description}</p>
          {product.occasions?.length > 0 && (
            <p className="mt-2 text-xs sm:text-sm text-slate-500">Occasions: {product.occasions.join(', ')}</p>
          )}
          <ProductDetailClient product={product} />
        </div>
      </div>
    </div>
  );
}
