'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Loader2,
  X,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { createCategory, deleteCategory, updateCategory } from '@/app/actions/admin/categories';

interface CategoryListProps {
  initialCategories: any[];
}

const CategoryList: React.FC<CategoryListProps> = ({ initialCategories }) => {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    setEditingCategory(null);
    setName('');
    setIsModalOpen(true);
  };

  const handleEdit = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCategory) {
        const res = await updateCategory(editingCategory.id, { name });
        if (res.success) {
          toast.success("Category updated");
          setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name } : c));
        } else {
          toast.error(res.error || "Failed to update");
        }
      } else {
        const res = await createCategory({ name });
        if (res.success && res.category) {
          toast.success("Category created");
          setCategories([...categories, { ...res.category, _count: { products: 0 } }]);
        } else {
          toast.error(res.error || "Failed to create");
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await deleteCategory(id);
      if (res.success) {
        toast.success("Category deleted");
        setCategories(categories.filter(c => c.id !== id));
      } else {
        toast.error(res.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="relative w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            placeholder="Search categories..."
            className="w-full bg-stone-900/50 border border-stone-800 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
          />
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-white text-stone-950 hover:bg-stone-200 transition-all text-sm font-bold uppercase tracking-widest shadow-xl shadow-white/5"
        >
          <Plus size={16} />
          <span>New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="group p-8 rounded-[2.5rem] bg-stone-900/40 backdrop-blur-2xl border border-stone-800 hover:border-white/20 transition-all duration-500 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-serif font-bold text-white tracking-tight">{cat.name}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mt-1">{cat._count?.products || 0} Products</p>
            </div>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleEdit(cat)}
                className="p-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-400 hover:text-white hover:border-stone-600 transition-all"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => handleDelete(cat.id)}
                className="p-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-400 hover:text-red-500 hover:border-red-500/50 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-stone-800 flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold text-white">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-4">Category Name</label>
                <input 
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Living Room"
                  className="w-full bg-stone-950/50 border border-stone-800 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-4 rounded-2xl bg-white text-stone-950 hover:bg-stone-200 transition-all font-bold uppercase tracking-widest shadow-xl shadow-white/5 disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                <span>{editingCategory ? 'Update' : 'Create'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
