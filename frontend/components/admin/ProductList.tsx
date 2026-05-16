'use client';

import React from 'react';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  ExternalLink,
  Plus,
  Search,
  Filter,
  Package
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductListProps {
  products: any[];
}

const ProductList: React.FC<ProductListProps> = ({ products: initialProducts }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const filteredAndSortedProducts = React.useMemo(() => {
    let result = [...initialProducts];

    // Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.sku?.toLowerCase().includes(query) ||
        p.category?.name.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue: any = a[sortConfig.key];
        let bValue: any = b[sortConfig.key];

        // Handle nested category name
        if (sortConfig.key === 'category') {
          aValue = a.category?.name || '';
          bValue = b.category?.name || '';
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [initialProducts, searchQuery, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (!sortConfig || sortConfig.key !== column) {
      return <Filter size={10} className="ml-1 opacity-20" />;
    }
    return sortConfig.direction === 'asc' ? <span> ↑</span> : <span> ↓</span>;
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-900/50 border border-stone-800 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm text-white"
          />
        </div>
        
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Link 
            href="/admin/products/new"
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-white text-stone-950 hover:bg-stone-200 transition-all text-sm font-bold uppercase tracking-widest shadow-xl shadow-white/5"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-stone-900/40 backdrop-blur-2xl border border-stone-800 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800/50">
                <th 
                  className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 cursor-pointer hover:text-white transition-colors"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">Product <SortIcon column="name" /></div>
                </th>
                <th 
                  className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 cursor-pointer hover:text-white transition-colors"
                  onClick={() => requestSort('sku')}
                >
                  <div className="flex items-center">SKU <SortIcon column="sku" /></div>
                </th>
                <th 
                  className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 cursor-pointer hover:text-white transition-colors"
                  onClick={() => requestSort('category')}
                >
                  <div className="flex items-center">Category <SortIcon column="category" /></div>
                </th>
                <th 
                  className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 cursor-pointer hover:text-white transition-colors"
                  onClick={() => requestSort('price')}
                >
                  <div className="flex items-center">Price <SortIcon column="price" /></div>
                </th>
                <th 
                  className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 cursor-pointer hover:text-white transition-colors"
                  onClick={() => requestSort('stock')}
                >
                  <div className="flex items-center">Stock <SortIcon column="stock" /></div>
                </th>
                <th 
                  className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 cursor-pointer hover:text-white transition-colors"
                  onClick={() => requestSort('status')}
                >
                  <div className="flex items-center">Status <SortIcon column="status" /></div>
                </th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/30">
              {filteredAndSortedProducts.map((product) => (
                <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-stone-800 overflow-hidden border border-stone-700 flex-shrink-0">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-600">
                            <Package size={20} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{product.name}</p>
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">{product.material || 'Standard'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-stone-400">{product.sku || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-stone-800/50 border border-stone-700 px-2 py-1 rounded-md text-stone-300">
                      {product.category?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-white">₹{product.price.toLocaleString()}</p>
                    {product.discountPrice && (
                      <p className="text-[10px] text-stone-500 line-through">₹{product.discountPrice.toLocaleString()}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                      <span className="text-xs font-medium text-stone-300">{product.stock} in stock</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-tighter px-2.5 py-1 rounded-full border ${
                      product.status === 'PUBLISHED' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500' :
                      product.status === 'DRAFT' ? 'border-stone-500/20 bg-stone-500/10 text-stone-400' :
                      'border-red-500/20 bg-red-500/10 text-red-500'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/product/${product.id}`} 
                        target="_blank"
                        className="p-2 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-all"
                        title="View on site"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <Link 
                        href={`/admin/products/${product.id}`}
                        className="p-2 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-all"
                        title="Edit product"
                      >
                        <Edit size={16} />
                      </Link>
                      <button 
                        className="p-2 rounded-lg hover:bg-red-500/10 text-stone-400 hover:text-red-500 transition-all"
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="p-8 border-t border-stone-800/50 flex justify-between items-center">
          <p className="text-xs font-medium text-stone-500">Showing {products.length} of {products.length} products</p>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 rounded-xl bg-stone-800 text-stone-500 text-xs font-bold uppercase tracking-widest disabled:opacity-50" disabled>Prev</button>
            <button className="px-4 py-2 rounded-xl bg-stone-800 text-stone-500 text-xs font-bold uppercase tracking-widest disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
