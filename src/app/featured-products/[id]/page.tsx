import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChevronRight, faStar } from '@fortawesome/free-solid-svg-icons';
import { featuredProducts, getFeaturedProductById } from '@/data/featuredProducts';
import { FeaturedProductDetailClient } from './FeaturedProductDetailClient';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = getFeaturedProductById(id);

  if (!product) {
    return { title: 'Featured Product' };
  }

  return {
    title: `${product.name} | Featured Product`,
    description: product.description,
  };
}

export async function generateStaticParams() {
  return featuredProducts.map((product) => ({ id: product.id }));
}

export default async function FeaturedProductPage({ params }: Props) {
  const { id } = await params;
  const product = getFeaturedProductById(id);

  if (!product) notFound();

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="w-full px-3 py-6 sm:px-4 sm:py-8">
      <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-pink-600">
          Home
        </Link>
        <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
        <span>Featured Products</span>
        <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
        <span className="text-slate-800">{product.name}</span>
      </nav>

      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-pink-600"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
        Back to home
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
        <div className="overflow-hidden rounded-[2rem] border border-pink-100 bg-white shadow-sm">
          <div className="relative aspect-square bg-pink-50">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            {product.badge && (
              <span className="rounded-full bg-pink-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {product.badge}
              </span>
            )}
            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
              {product.category}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">{product.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold text-slate-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-lg text-slate-400 line-through">₹{product.originalPrice}</span>
            )}
            {discountPercent && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {(product.rating || product.reviews) && (
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
              <FontAwesomeIcon icon={faStar} className="h-4 w-4 text-amber-500" />
              <span>{product.rating?.toFixed(1)}</span>
              <span>({product.reviews} reviews)</span>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {product.occasions.map((occasion) => (
              <span
                key={occasion}
                className="rounded-full border border-pink-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
              >
                {occasion}
              </span>
            ))}
          </div>

          <FeaturedProductDetailClient product={product} />
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-pink-100 bg-pink-50/60 p-6">
          <h2 className="text-xl font-semibold text-slate-900">Why you&apos;ll love it</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700 sm:text-base">
            {product.highlights.map((item) => (
              <li key={item} className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-pink-100 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Product details</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700 sm:text-base">
            {product.details.map((item) => (
              <li key={item} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
