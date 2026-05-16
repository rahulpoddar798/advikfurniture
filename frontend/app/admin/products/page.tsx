import React from 'react';
import ProductList from '@/components/admin/ProductList';
import { getAdminProducts } from '@/app/actions/admin/products';

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h2 className="text-4xl font-serif font-bold tracking-tight text-white">Product Catalog</h2>
        <p className="text-stone-500 font-medium">Manage your furniture collection, stock levels, and product visibility.</p>
      </div>

      <ProductList products={products} />
    </div>
  );
}
