import React from 'react';
import { getProductById } from '@/lib/services';
import ProductClient from './ProductClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { siteUrl } from '@/lib/site';
import { isInWishlist } from '@/app/actions/settings';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description || `Exquisite ${product.name} from Advik Furniture's premium collection.`,
    openGraph: {
      title: `${product.name} | Advik Furniture`,
      description: product.description || `Exquisite ${product.name} from Advik Furniture's premium collection.`,
      images: [
        {
          url: product.images?.[0] || '/logoAFI.png',
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Advik Furniture`,
      description: product.description || `Exquisite ${product.name} from Advik Furniture's premium collection.`,
      images: [product.images?.[0] || '/logoAFI.png'],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const wishlisted = await isInWishlist(id);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": product.images,
            "description": product.description,
            "sku": product.sku,
            "brand": {
              "@type": "Brand",
              "name": "Advik Furniture"
            },
            "offers": {
              "@type": "Offer",
              "url": `${siteUrl}/product/${id}`,
              "priceCurrency": "INR",
              "price": product.price,
              "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "itemCondition": "https://schema.org/NewCondition"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": product.reviews?.length || 1
            }
          }),
        }}
      />
      <ProductClient product={product} initialIsInWishlist={wishlisted} />
    </>
  );
}
