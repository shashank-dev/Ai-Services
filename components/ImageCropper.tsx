import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';

interface ImageCropperProps {
  src: string;
  originalFileName: string;
  onCropComplete: (file: File) => void;
  onCancel: () => void;
}

function dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    if (arr.length < 2) {
        throw new Error('Invalid data URL');
    }
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
        throw new Error('Could not parse mime type from data URL');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

const ImageCropper: React.FC<ImageCropperProps> = ({ src, originalFileName, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [cropError, setCropError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1, // Set aspect ratio to 1 for a square, or pass width / height for free aspect
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  }
  
  const handleCropConfirm = async () => {
    const image = imgRef.current;
    if (!image || !completedCrop || completedCrop.width === 0 || completedCrop.height === 0) {
      setCropError('Please select an area to crop before confirming.');
      return;
    }
    setCropError(null);

    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    const base64Image = canvas.toDataURL('image/png');
    const croppedFile = dataURLtoFile(base64Image, originalFileName);
    onCropComplete(croppedFile);
  };


  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl p-4 sm:p-6 w-full max-w-4xl flex flex-col">
        <h2 className="text-2xl font-bold text-center mb-4 text-slate-200">Crop Your Image</h2>
        <div className="flex justify-center items-center bg-black/50 rounded-md overflow-hidden flex-grow" style={{ minHeight: '50vh'}}>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => {
              setCropError(null); // Clear error when user interacts
              setCrop(percentCrop);
            }}
            onComplete={(c) => setCompletedCrop(c)}
          >
            <img 
              ref={imgRef}
              src={src}
              onLoad={onImageLoad}
              alt="Crop preview"
              style={{ maxHeight: '70vh', objectFit: 'contain' }}
            />
          </ReactCrop>
        </div>
        {cropError && <p className="text-center text-red-400 mt-4">{cropError}</p>}
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={handleCropConfirm}
            className="w-full sm:w-auto px-6 py-3 bg-teal-500 text-white font-bold rounded-lg shadow-lg hover:bg-teal-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-500/50"
          >
            Confirm Crop
          </button>
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-slate-600/50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;