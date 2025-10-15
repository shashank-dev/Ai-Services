
import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  id: string;
  title: string;
  description: string;
  onFileChange: (file: File) => void;
  previewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, description, onFileChange, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onFileChange(file);
      } else {
        alert('Please select an image file.');
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const baseClasses = "relative group flex flex-col items-center justify-center w-full h-80 bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer transition-all duration-300 ease-in-out";
  const hoverClasses = "hover:border-teal-500 hover:bg-slate-700";
  const dragClasses = isDragging ? "border-teal-400 bg-slate-700 scale-105" : "";
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${dragClasses}`}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
      {previewUrl ? (
        <>
          <img src={previewUrl} alt={title} className="absolute inset-0 w-full h-full object-cover rounded-lg z-0" />
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
            <span className="text-white text-lg font-semibold">Change Photo</span>
          </div>
        </>
      ) : (
        <div className="text-center p-4">
          <UploadIcon className="mx-auto h-12 w-12 text-slate-500 group-hover:text-teal-400 transition-colors" />
          <h3 className="mt-4 text-xl font-semibold text-slate-300">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
          <p className="mt-4 text-sm font-medium text-teal-400">Click or drag & drop to upload</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
