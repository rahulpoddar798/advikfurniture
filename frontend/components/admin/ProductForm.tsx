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
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("Product updated successfully");
      } else {
        result = await createProduct(data);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("Product created successfully");
      }
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/products" className="p-3 rounded-2xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white transition-all">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
              {initialData ? 'Edit Product' : 'Create New Product'}
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mt-1">
              {initialData ? `SKU: ${initialData.sku || 'N/A'}` : 'Add a new masterpiece to your catalog'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className="flex items-center space-x-2 px-8 py-4 rounded-2xl bg-white text-stone-950 hover:bg-stone-200 transition-all font-bold uppercase tracking-widest shadow-xl shadow-white/5 disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          <span>{initialData ? 'Save Changes' : 'Create Product'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-stone-900/40 backdrop-blur-2xl border border-stone-800 space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white border-b border-stone-800 pb-4">Basic Information</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-4">Product Name</label>
                <input 
                  {...register('name')}
                  placeholder="e.g. Eames Lounge Chair"
                  className="w-full bg-stone-950/50 border border-stone-800 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
                />
                {errors.name && <p className="text-red-500 text-[10px] ml-4 font-bold">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-4">Price (₹)</label>
                  <input 
                    {...register('price')}
                    type="number"
                    placeholder="0"
                    className="w-full bg-stone-950/50 border border-stone-800 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
                  />
                  {errors.price && <p className="text-red-500 text-[10px] ml-4 font-bold">{errors.price.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-4">Discount Price (₹)</label>
                  <input 
                    {...register('discountPrice')}
                    type="number"
                    placeholder="Optional"
                    className="w-full bg-stone-950/50 border border-stone-800 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
                  />
                  {errors.discountPrice && <p className="text-red-500 text-[10px] ml-4 font-bold">{errors.discountPrice.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-4">Description</label>
                <textarea 
                  {...register('description')}
                  rows={6}
                  placeholder="Tell the story of this piece..."
                  className="w-full bg-stone-950/50 border border-stone-800 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm resize-none"
                />
                {errors.description && <p className="text-red-500 text-[10px] ml-4 font-bold">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-stone-900/40 backdrop-blur-2xl border border-stone-800 space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white border-b border-stone-800 pb-4">Specifications</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-4">Dimensions</label>
                <input 
                  {...register('dimensions')}
                  placeholder="e.g. 80cm x 75cm x 90cm"
                  className="w-full bg-stone-950/50 border border-stone-800 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-4">Material</label>
                <input 
                  {...register('material')}
                  placeholder="e.g. Solid Oak, Premium Velvet"
                  className="w-full bg-stone-950/50 border border-stone-800 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-stone-900/40 backdrop-blur-2xl border border-stone-800 space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white border-b border-stone-800 pb-4">Product Images</h3>
            <CloudinaryUpload 
              value={images}
              onChange={(url) => setValue('images', [...getValues('images'), url], { shouldValidate: true, shouldDirty: true })}
              onRemove={(url) => setValue('images', getValues('images').filter(i => i !== url), { shouldValidate: true, shouldDirty: true })}
            />
            {errors.images && <p className="text-red-500 text-[10px] ml-4 font-bold">{errors.images.message}</p>}
          </div>
        </div>

        {/* Sidebar Details */}
        <div className="space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-stone-900/40 backdrop-blur-2xl border border-stone-800 space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white border-b border-stone-800 pb-4">Organization</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-4">Category</label>
                <select 
                  {...register('categoryId')}
                  className="w-full bg-stone-950/50 border border-stone-800 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm appearance-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-red-500 text-[10px] ml-4 font-bold">{errors.categoryId.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-4">SKU</label>
                <input 
                  {...register('sku')}
                  placeholder="e.g. FURN-CH-001"
                  className="w-full bg-stone-950/50 border border-stone-800 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-4">Stock Quantity</label>
                <input 
                  {...register('stock')}
                  type="number"
                  className="w-full bg-stone-950/50 border border-stone-800 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
                />
                {errors.stock && <p className="text-red-500 text-[10px] ml-4 font-bold">{errors.stock.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-4">Status</label>
                <select 
                  {...register('status')}
                  className="w-full bg-stone-950/50 border border-stone-800 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm appearance-none"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                  <option value="HIDDEN">Hidden</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-stone-900/40 backdrop-blur-2xl border border-stone-800 space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white border-b border-stone-800 pb-4">Promotions</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-950/50 border border-stone-800">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Featured</span>
                <input type="checkbox" {...register('featured')} className="w-5 h-5 rounded-md border-stone-800 bg-stone-900 accent-white" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-950/50 border border-stone-800">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Trending</span>
                <input type="checkbox" {...register('isTrending')} className="w-5 h-5 rounded-md border-stone-800 bg-stone-900 accent-white" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-950/50 border border-stone-800">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Best Seller</span>
                <input type="checkbox" {...register('isBestSeller')} className="w-5 h-5 rounded-md border-stone-800 bg-stone-900 accent-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
