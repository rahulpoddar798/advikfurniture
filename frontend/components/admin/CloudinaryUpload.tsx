'use client';

import React from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Plus, X, Image as ImageIcon } from 'lucide-react';

interface CloudinaryUploadProps {
  value: string[];
  onChange: (url: string) => void;
  onRemove: (url: string) => void;
}

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  value,
  onChange,
  onRemove
}) => {
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const onUpload = (result: any) => {
    console.log("CLOUDINARY UPLOAD EVENT:", result.event);
    if (result.event === 'success') {
      console.log("UPLOAD SUCCESSFUL:", result.info.secure_url);
      onChange(result.info.secure_url);
    }
  };

  if (!uploadPreset || !cloudName) {
    console.error("Cloudinary config missing:", { uploadPreset, cloudName });
    return (
      <div className="p-8 rounded-[2.5rem] border-2 border-dashed border-red-900/30 bg-red-950/10 text-red-400 text-center space-y-3">
        <div className="p-3 w-fit mx-auto rounded-xl bg-red-900/20 border border-red-900/30">
          <ImageIcon size={24} />
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em]">Service Offline</p>
          <p className="text-[10px] mt-1 font-medium opacity-60">NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET or CLOUD_NAME is not set in Vercel.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-36 h-36 rounded-[1.5rem] overflow-hidden border border-stone-800 bg-stone-950 group shadow-xl">
            <div className="z-10 absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
              <button 
                type="button" 
                onClick={() => onRemove(url)} 
                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-2xl"
              >
                <X size={14} />
              </button>
            </div>
            <img
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000"
              alt="Gallery Item"
              src={url}
            />
          </div>
        ))}
      </div>
      
      <CldUploadWidget 
        onSuccess={onUpload} 
        uploadPreset={uploadPreset}
        options={{
          multiple: true,
          maxFiles: 10,
          styles: {
            palette: {
              window: "#0C0A09",
              sourceBg: "#0C0A09",
              windowBorder: "#1C1917",
              tabIcon: "#FFFFFF",
              inactiveTabIcon: "#57534E",
              menuIcons: "#A8A29E",
              link: "#FFFFFF",
              action: "#FFFFFF",
              inProgress: "#FFFFFF",
              complete: "#10B981",
              error: "#EF4444",
              textDark: "#000000",
              textLight: "#FFFFFF"
            }
          }
        }}
      >
        {({ open }) => {
          return (
            <button
              type="button"
              onClick={() => open()}
              className="w-full h-40 rounded-[2rem] border-2 border-dashed border-stone-800 bg-stone-950/30 hover:bg-stone-900/50 hover:border-stone-700 transition-all flex flex-col items-center justify-center space-y-3 text-stone-500 hover:text-stone-300 group"
            >
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 group-hover:scale-110 group-hover:border-stone-700 transition-all shadow-lg">
                <Plus size={24} />
              </div>
              <div className="text-center">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] block">Add to Portfolio</span>
                <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest mt-1">High-fidelity imagery only</span>
              </div>
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}

export default CloudinaryUpload;
