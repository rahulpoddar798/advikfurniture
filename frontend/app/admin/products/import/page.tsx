import Image from 'next/image';
import catalog from '@/data/sample-catalog.json';
import SampleCatalogImport from '@/components/admin/SampleCatalogImport';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export default function SampleCatalogPage() {
  const categories = [...new Set(catalog.map((product) => product.categoryName))];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-4xl font-serif font-bold">Sample catalog</h2>
        <p className="text-stone-500">Review the complete listings below, then add them to your website.</p>
      </div>
      <SampleCatalogImport />
      {categories.map((category) => (
        <section key={category} className="space-y-4">
          <h3 className="text-2xl font-serif font-bold">{category} · 10 products</h3>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {catalog.filter((product) => product.categoryName === category).map((product) => (
              <article key={product.sku} className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
                <div className="relative aspect-[4/3]">
                  <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover" />
                </div>
                <div className="space-y-3 p-5">
                  <h4 className="font-semibold">{product.name}</h4>
                  <p>₹{product.price.toLocaleString('en-IN')} · Example price</p>
                  <dl className="space-y-1 text-sm text-stone-600 dark:text-stone-300">
                    <div><dt className="inline font-semibold">SKU: </dt><dd className="inline">{product.sku}</dd></div>
                    <div><dt className="inline font-semibold">Material: </dt><dd className="inline">{product.material}</dd></div>
                    <div><dt className="inline font-semibold">Dimensions: </dt><dd className="inline">{product.dimensions}</dd></div>
                    <div><dt className="inline font-semibold">Color: </dt><dd className="inline">{product.colors.join(', ')}</dd></div>
                    <div><dt className="inline font-semibold">Stock: </dt><dd className="inline">0 · Published</dd></div>
                  </dl>
                  <details className="text-sm">
                    <summary className="cursor-pointer font-semibold">Full description and photo credit</summary>
                    <p className="mt-3 leading-relaxed">{product.description}</p>
                    <a href={product.imageCredit.source} target="_blank" rel="noreferrer" className="mt-3 inline-block underline">Photo source on Unsplash</a>
                  </details>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
