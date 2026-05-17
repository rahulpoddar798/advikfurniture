'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  ChevronLeft, 
  Save, 
  Loader2,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { createProduct, updateProduct } from '@/app/actions/admin/products';
import CloudinaryUpload from './CloudinaryUpload';

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.preprocess((val) => (val === '' ? null : val), z.string().optional().nullable()),
  price: z.preprocess((val) => Number(val), z.number().min(0)),
  discountPrice: z.preprocess((val) => (val === '' || val === null ? null : Number(val)), z.number().min(0).nullable().optional()),
  sku: z.preprocess((val) => (val === '' ? null : val), z.string().optional().nullable()),
  stock: z.preprocess((val) => Number(val), z.number().int().min(0)),
  categoryId: z.string().min(1, "Category is required"),
  featured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  dimensions: z.preprocess((val) => (val === '' ? null : val), z.string().optional().nullable()),
  material: z.preprocess((val) => (val === '' ? null : val), z.string().optional().nullable()),
  colors: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'HIDDEN']).default('DRAFT'),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

type ProductFormValues = z.infer<typeof ProductSchema>;

interface ProductFormProps {
  initialData?: any;
  categories: any[];
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    getValues,
    formState: { errors } 
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema) as any,
    defaultValues: initialData || {
      name: '',
      description: '',
      shortDescription: '',
      price: 0,
      discountPrice: null,
      sku: '',
      stock: 0,
      categoryId: '',
      featured: false,
      isTrending: false,
      isBestSeller: false,
      dimensions: '',
      material: '',
      colors: [],
      tags: [],
      status: 'DRAFT',
      images: [],
    }
  });

  const images = watch('images');

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      let result;
      if (initialData) {
        result = await updateProduct(initialData.id, data);
        if (result?.error) {
          toast.error(result.error);
          return;
        }
        toast.success("Masterpiece updated");
      } else {
        result = await createProduct(data);
        if (result?.error) {
          toast.error(result.error);
          return;
        }
        toast.success("New masterpiece added");
      }
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <Link href="/admin/products" className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-stone-500 hover:text-white transition-all hover:bg-stone-800 shadow-lg">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight leading-tight">
              {initialData ? 'Edit Masterpiece' : 'Add New Piece'}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mt-2 flex items-center">
              <span className="w-1 h-1 rounded-full bg-stone-700 mr-2" />
              {initialData ? `Serial: ${initialData.sku || 'PENDING'}` : 'Cataloging excellence'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className="w-full md:w-auto flex items-center justify-center space-x-3 px-10 py-5 rounded-[1.25rem] bg-white text-stone-950 hover:bg-stone-200 transition-all font-bold uppercase tracking-[0.15em] text-[11px] shadow-2xl shadow-white/5 disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>{initialData ? 'Update Record' : 'Commit to Catalog'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-10">
          <div className="p-10 rounded-[2.5rem] bg-stone-900/30 backdrop-blur-3xl border border-stone-800/50 space-y-10 shadow-2xl">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 border-b border-stone-800/50 pb-6">Core Specifications</h3>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 ml-2">Nomenclature</label>
                <input 
                  {...register('name')}
                  placeholder="e.g. Minimalist Velvet Divan"
                  className="w-full bg-stone-950/40 border border-stone-800/80 rounded-[1.25rem] py-4.5 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm font-medium text-white placeholder:text-stone-700"
                />
                {errors.name && <p className="text-red-500 text-[10px] ml-2 font-bold">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 ml-2">Valuation (₹)</label>
                  <input 
                    {...register('price')}
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-stone-950/40 border border-stone-800/80 rounded-[1.25rem] py-4.5 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm font-medium text-white placeholder:text-stone-700"
                  />
                  {errors.price && <p className="text-red-500 text-[10px] ml-2 font-bold">{errors.price.message}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 ml-2">Offer Valuation (Optional)</label>
                  <input 
                    {...register('discountPrice')}
                    type="number"
                    placeholder="Discounted price"
                    className="w-full bg-stone-950/40 border border-stone-800/80 rounded-[1.25rem] py-4.5 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm font-medium text-white placeholder:text-stone-700"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 ml-2">Narrative</label>
                <textarea 
                  {...register('description')}
                  rows={8}
                  placeholder="Describe the craftsmanship and soul of this piece..."
                  className="w-full bg-stone-950/40 border border-stone-800/80 rounded-[1.5rem] py-5 px-7 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm font-medium text-white placeholder:text-stone-700 leading-relaxed resize-none"
                />
                {errors.description && <p className="text-red-500 text-[10px] ml-2 font-bold">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-stone-900/30 backdrop-blur-3xl border border-stone-800/50 space-y-10 shadow-2xl">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 border-b border-stone-800/50 pb-6">Dimensions & Texture</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 ml-2">Scale (Dimensions)</label>
                <input 
                  {...register('dimensions')}
                  placeholder="e.g. 210cm x 95cm x 85cm"
                  className="w-full bg-stone-950/40 border border-stone-800/80 rounded-[1.25rem] py-4.5 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm font-medium text-white placeholder:text-stone-700"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 ml-2">Composition (Material)</label>
                <input 
                  {...register('material')}
                  placeholder="e.g. Hand-carved Teak"
                  className="w-full bg-stone-950/40 border border-stone-800/80 rounded-[1.25rem] py-4.5 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm font-medium text-white placeholder:text-stone-700"
                />
              </div>
            </div>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-stone-900/30 backdrop-blur-3xl border border-stone-800/50 space-y-10 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-800/50 pb-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400">Visual Portfolio</h3>
              <span className="text-[9px] font-bold text-stone-600 uppercase tracking-widest">Min. 1 high-res image</span>
            </div>
            <CloudinaryUpload 
              value={images}
              onChange={(url) => setValue('images', [...getValues('images'), url], { shouldValidate: true, shouldDirty: true })}
              onRemove={(url) => setValue('images', getValues('images').filter(i => i !== url), { shouldValidate: true, shouldDirty: true })}
            />
            {errors.images && <p className="text-red-500 text-[10px] ml-2 font-bold">{errors.images.message}</p>}
          </div>
        </div>

        {/* Sidebar Details */}
        <div className="space-y-10">
          <div className="p-10 rounded-[2.5rem] bg-stone-900/30 backdrop-blur-3xl border border-stone-800/50 space-y-10 shadow-2xl">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 border-b border-stone-800/50 pb-6">Registry</h3>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 ml-2">Classification</label>
                <div className="relative">
                  <select 
                    {...register('categoryId')}
                    className="w-full bg-stone-950/40 border border-stone-800/80 rounded-[1.25rem] py-4.5 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm font-bold text-white appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-stone-900">Select Classification</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-stone-900">{cat.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
                    <ChevronLeft size={14} className="-rotate-90" />
                  </div>
                </div>
                {errors.categoryId && <p className="text-red-500 text-[10px] ml-2 font-bold">{errors.categoryId.message}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 ml-2">Inventory Serial (SKU)</label>
                <input 
                  {...register('sku')}
                  placeholder="e.g. AVK-2025-001"
                  className="w-full bg-stone-950/40 border border-stone-800/80 rounded-[1.25rem] py-4.5 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm font-medium text-white placeholder:text-stone-700"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 ml-2">Available Volume</label>
                <input 
                  {...register('stock')}
                  type="number"
                  className="w-full bg-stone-950/40 border border-stone-800/80 rounded-[1.25rem] py-4.5 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm font-bold text-white"
                />
                {errors.stock && <p className="text-red-500 text-[10px] ml-2 font-bold">{errors.stock.message}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 ml-2">Catalog Status</label>
                <div className="relative">
                  <select 
                    {...register('status')}
                    className="w-full bg-stone-950/40 border border-stone-800/80 rounded-[1.25rem] py-4.5 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm font-bold text-white appearance-none cursor-pointer"
                  >
                    <option value="DRAFT" className="bg-stone-900">Drafting</option>
                    <option value="PUBLISHED" className="bg-stone-900">Live Catalog</option>
                    <option value="ARCHIVED" className="bg-stone-900">Archive</option>
                    <option value="HIDDEN" className="bg-stone-900">Private</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
                    <ChevronLeft size={14} className="-rotate-90" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-stone-900/30 backdrop-blur-3xl border border-stone-800/50 space-y-10 shadow-2xl">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 border-b border-stone-800/50 pb-6">Visibility Tags</h3>
            
            <div className="space-y-3">
              {[
                { label: 'Featured Piece', id: 'featured' },
                { label: 'Trending Item', id: 'isTrending' },
                { label: 'Best Seller', id: 'isBestSeller' }
              ].map((tag) => (
                <div key={tag.id} className="flex items-center justify-between p-5 rounded-[1.25rem] bg-stone-950/40 border border-stone-800/50 hover:border-white/20 transition-all cursor-pointer group">
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 group-hover:text-stone-300 transition-colors">{tag.label}</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" {...register(tag.id as any)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-stone-500 after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white peer-checked:after:bg-stone-900"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
