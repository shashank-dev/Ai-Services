
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
    <div className="w-full max-w-4xl mx-auto bg-slate-800 rounded-lg shadow-2xl p-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
        Your Blended Photo
      </h2>
      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border-4 border-slate-700">
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
          className="w-full sm:w-auto px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-slate-600/50"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
