
import React from 'react';

interface ResultDisplayProps {
  image: string;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ image, onReset }) => {
  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${image}`;
    link.download = 'blended-photo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-2xl p-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#864ffe] to-[#e60080]">
        Your Blended Photo
      </h2>
      <div className="rounded-lg overflow-hidden border-4 border-gray-200 dark:border-zinc-700">
        <img src={`data:image/png;base64,${image}`} alt="Generated result" className="object-contain w-full h-full" />
      </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={downloadImage}
          className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-green-600/50"
        >
          Download Image
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 dark:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/50 dark:focus:ring-zinc-600/50"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
