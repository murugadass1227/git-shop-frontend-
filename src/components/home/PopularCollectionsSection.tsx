import Link from 'next/link';
import { popularCollections } from '@/data/popularCollections';

const collectionImages = [
  '/assets/category/c1.webp',
  '/assets/category/c2.webp',
  '/assets/category/c3.webp',
  '/assets/category/c4.webp',
  '/assets/category/c5.webp',
  '/assets/category/c6.webp',
  '/assets/category/c7.webp',
  '/assets/category/c8.png',
];

export function PopularCollectionsSection() {
  return (
    <section className="bg-white py-10 sm:py-14 md:py-16">
      <div className="w-full px-3 sm:px-4">
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">
            Popular Collections
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Explore gifts by theme and relationship
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Hover the collections menu in the header or jump straight into these curated categories.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularCollections.map((collection, index) => {
            const previewItems = collection.groups.flatMap((group) => group.items);
            const collectionImage = collectionImages[index % collectionImages.length];

            return (
              <Link
                key={collection.id}
                href={collection.href}
                className="group overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-square">
                  <img
                    src={collectionImage}
                    alt={collection.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-200">
                      {collection.highlight}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold">{collection.title}</h3>
                    <p className="mt-2 text-sm text-white/90">{collection.description}</p>
                  </div>
                </div>

               
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
