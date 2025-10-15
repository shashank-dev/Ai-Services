import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import ImageCropper from './ImageCropper';

interface ImageUploaderProps {
  id: string;
  title: string;
  description: string;
  onFileChange: (file: File) => void;
  previewUrl: string | null;
}

interface CropState {
  src: string;
  file: File;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, description, onFileChange, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [cropState, setCropState] = useState<CropState | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setUploadError(null);
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setCropState({ src: reader.result, file });
          }
        };
        reader.onerror = () => {
            setUploadError('Could not read the file. It may be corrupted.');
        };
        reader.readAsDataURL(file);
      } else {
        setUploadError('Please select a valid image file (e.g., PNG, JPEG).');
      }
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    onFileChange(croppedFile);
    setCropState(null); // Close the cropper
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const handleCropCancel = () => {
    setCropState(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    setUploadError(null);
    fileInputRef.current?.click();
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadError(null);
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
  const errorClasses = uploadError ? "border-red-500" : "";
  
  return (
    <>
      <div 
        className={`${baseClasses} ${hoverClasses} ${dragClasses} ${errorClasses}`}
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
            {uploadError ? (
                <p className="mt-4 text-sm font-medium text-red-400">{uploadError}</p>
            ) : (
                <p className="mt-4 text-sm font-medium text-teal-400">Click or drag & drop to upload</p>
            )}
          </div>
        )}
      </div>
      {cropState && (
        <ImageCropper
          src={cropState.src}
          originalFileName={cropState.file.name}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </>
  );
};

export default ImageUploader;