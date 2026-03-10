import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChevronRight, faSliders, faStar } from '@fortawesome/free-solid-svg-icons';
import { ProductCard } from '@/components/product/ProductCard';
import { getCollectionGuide, filtersToQuery } from '@/data/collectionGuides';
import { productService } from '@/services/productService';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function CollectionGuidePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { tab } = await searchParams;
  const guide = getCollectionGuide(slug);

  if (!guide) {
    notFound();
  }

  const activeTab = guide.tabs.find((item) => item.id === tab) ?? guide.tabs[0];
  const queryString = filtersToQuery(activeTab.filters);
  const testimonials = [
    {
      name: 'Priya S',
      role: 'Verified buyer',
      quote: `Loved the ${guide.title.toLowerCase()} collection. Filters made it easy to find the right personalized gift quickly.`,
    },
    {
      name: 'Rahul V',
      role: 'Repeat customer',
      quote: `Product suggestions felt curated and the page layout was simple to browse. I found a great option in minutes.`,
    },
    {
      name: 'Anita M',
      role: 'Gift shopper',
      quote: `Nice static page setup with clear tabs, pricing filters and good product choices for special occasions.`,
    },
  ];

  const data = await productService
    .list({
      ...activeTab.filters,
      limit: 8,
    })
    .catch(() => ({ items: [], total: 0, page: 1, totalPages: 0 }));

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-slate-200 bg-[#fffaf8]">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">{guide.eyebrow}</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{guide.title}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{guide.description}</p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">{guide.badge}</span>
                <Link
                  href={`/products?${queryString}`}
                  className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                >
                  <FontAwesomeIcon icon={faSliders} className="h-4 w-4" />
                  Open filters
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-rose-100 bg-white shadow-[0_20px_60px_-30px_rgba(244,114,182,0.35)]">
              <img src={guide.heroImage} alt={guide.title} className="h-[260px] w-full object-cover sm:h-[320px]" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
          {guide.tabs.map((item) => (
            <Link
              key={item.id}
              href={`/collections/${guide.slug}?tab=${item.id}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab.id === item.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xl font-semibold text-slate-900">{activeTab.label}</p>
            <p className="mt-1 text-sm text-slate-500">{activeTab.description}</p>
          </div>
          <Link
            href={`/products?${queryString}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 transition hover:text-rose-700"
          >
            View more
            <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {activeTab.filters.occasion && (
            <span className="rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700">{activeTab.filters.occasion}</span>
          )}
          {activeTab.filters.category && (
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">{activeTab.filters.category}</span>
          )}
          {activeTab.filters.customizable === true && (
            <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">Personalized</span>
          )}
          {activeTab.filters.maxPrice != null && (
            <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">Under Rs. {activeTab.filters.maxPrice}</span>
          )}
          {activeTab.filters.search && (
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">{activeTab.filters.search}</span>
          )}
        </div>

        {data.items.length === 0 ? (
          <div className="mt-10 rounded-[28px] border border-slate-200 bg-slate-50 px-6 py-14 text-center">
            <p className="text-base font-medium text-slate-700">Products currently unavailable for this static collection.</p>
            <p className="mt-2 text-sm text-slate-500">Open the filters page and try another related tab.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {data.items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-10 rounded-[28px] border border-rose-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.24)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">Testimonials</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">What shoppers say about this collection</h2>
            </div>
            <span className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">4.9 average rating</span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.name} className="rounded-[24px] border border-slate-200 bg-[#fffaf8] p-5">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FontAwesomeIcon key={`${item.name}-${index}`} icon={faStar} className="h-4 w-4" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">&quot;{item.quote}&quot;</p>
                <div className="mt-5">
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-[28px] border border-rose-100 bg-gradient-to-r from-[#fff7fb] to-[#fff1f3] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">More filtered views</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Open the full shop page with these filters and explore more products.</p>
            </div>
            <Link
              href={`/products?${queryString}`}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Explore full catalog
              <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
