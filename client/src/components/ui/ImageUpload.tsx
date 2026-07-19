"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";

interface ImageUploadProps {
  value?: string | null;
  onChange: (base64: string | null) => void;
  className?: string;
}

export default function ImageUpload({ value, onChange, className = "" }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onChange(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering the file upload
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      {value ? (
        <div className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-[#d0c5af] bg-[#f5f3ef]">
          <Image
            src={value}
            alt="Uploaded preview"
            fill
            unoptimized
            className="object-cover transition-opacity duration-300 group-hover:opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-[#101827]/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <X size={18} />
              Remove Image
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={triggerSelect}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 text-center transition-all duration-200 ${
            isDragging
              ? "border-[#d4af37] bg-[#f5f3ef] shadow-inner"
              : "border-[#d0c5af] bg-[#f5f3ef] hover:border-[#d4af37] hover:bg-white"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
            accept="image/*"
            className="hidden"
          />
          <div 
            className={`mb-4 rounded-full p-4 transition-colors ${
              isDragging ? "bg-[#d4af37]/20 text-[#d4af37]" : "bg-white text-[#d0c5af]"
            }`}
          >
             <UploadCloud size={36} />
          </div>
          <p className="text-lg font-bold text-[#4d4635]">
            Click to upload <span className="font-normal text-[#8a8175]">or drag and drop</span>
          </p>
          <p className="mt-2 text-sm text-[#8a8175]">SVG, PNG, JPG or WebP (max. 5MB)</p>
        </div>
      )}
    </div>
  );
}
