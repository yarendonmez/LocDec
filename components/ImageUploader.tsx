import React, { useState, useCallback, useRef } from 'react';
import UploadIcon from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isLoading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (files[0].type.startsWith('image/')) {
        onImageSelect(files[0]);
      }
    }
  }, [isLoading, onImageSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return;
    const files = e.target.files;
    if (files && files.length > 0) {
        if (files[0].type.startsWith('image/')) {
            onImageSelect(files[0]);
        }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const dragClass = isDragging ? 'border-indigo-500 bg-slate-700' : 'border-slate-600 hover:border-indigo-500';

  return (
    <div
      className={`w-full max-w-2xl mx-auto p-8 sm:p-12 border-2 border-dashed ${dragClass} rounded-2xl bg-slate-800/50 cursor-pointer transition-all duration-300 text-center flex flex-col items-center justify-center`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
        disabled={isLoading}
      />
      <UploadIcon className="w-16 h-16 text-slate-500 mb-4 transition-transform duration-300 group-hover:scale-110" />
      <h3 className="text-xl font-semibold text-slate-100">
        Drag & drop an image here, or click to select
      </h3>
      <p className="text-slate-400 mt-1">Supports: PNG, JPG, WEBP</p>
    </div>
  );
};

export default ImageUploader;