'use client';

import React from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Plus, X, Image as ImageIcon } from 'lucide-react';

interface CloudinaryUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
}

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  value,
  onChange,
  onRemove
}) => {
  const onUpload = (result: any) => {
    onChange([...value, result.info.secure_url]);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-32 h-32 rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 group">
            <div className="z-10 absolute top-2 right-2">
              <button 
                type="button" 
                onClick={() => onRemove(url)} 
                className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg"
              >
                <X size={12} />
              </button>
            </div>
            <img
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              alt="Product"
              src={url}
            />
          </div>
        ))}
      </div>
      
      <CldUploadWidget 
        onSuccess={onUpload} 
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <button
              type="button"
              onClick={onClick}
              className="w-full h-32 rounded-3xl border-2 border-dashed border-stone-800 bg-stone-900/50 hover:bg-stone-900 hover:border-white/20 transition-all flex flex-col items-center justify-center space-y-2 text-stone-500 hover:text-white group"
            >
              <div className="p-3 rounded-2xl bg-stone-800 border border-stone-700 group-hover:scale-110 transition-transform">
                <ImageIcon size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Upload Images</span>
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}

export default CloudinaryUpload;
