
import React from 'react';
import type { HistoryItem } from '../App';
import { DownloadIcon } from './icons/DownloadIcon';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (id: string) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear }) => {
  const resolutionLabels: { [key: string]: string } = {
    'standard': 'Standard',
    'hd': 'HD',
    'ultra_hd': 'Ultra HD',
  };

  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>, item: HistoryItem) => {
    e.stopPropagation(); // Prevent the onSelect from firing when only downloading
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${item.generatedImage}`;
    link.download = `blended-photo-${item.resolution}-${item.aspectRatio}-${item.id.slice(0, 4)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <aside className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0 bg-white dark:bg-zinc-900 rounded-lg p-4 lg:sticky lg:top-8 self-start shadow-xl">
      <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-zinc-700 pb-2">
        History
      </h2>
      <div className="overflow-y-auto pr-2" style={{maxHeight: 'calc(100vh - 210px)'}}>
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 pt-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
            <p className="mt-4">Your previous generations will appear here.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-3 lg:grid-cols-2 gap-3">
            {history.map(item => {
              const resolutionLabel = resolutionLabels[item.resolution] || item.resolution;
              return (
                <li 
                  key={item.id} 
                  onClick={() => onSelect(item.id)} 
                  className="relative cursor-pointer group transition-transform duration-200 ease-in-out hover:scale-105"
                  role="button"
                  aria-label={`Select generation with resolution ${resolutionLabel} and aspect ratio ${item.aspectRatio}`}
                >
                  <img 
                    src={`data:image/png;base64,${item.generatedImage}`} 
                    alt="A previously generated image" 
                    className="w-full aspect-square object-cover rounded-md border-2 border-gray-300 dark:border-zinc-700 group-hover:border-[#864ffe] transition-all duration-200 shadow-md"
                  />
                  <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex flex-col items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md">
                    <div className="text-center">
                      <span className="text-sm font-bold text-[#864ffe]">{resolutionLabel}</span>
                      <span className="text-xs text-gray-700 dark:text-gray-300 block mt-1">{item.aspectRatio}</span>
                    </div>
                    <button
                        onClick={(e) => handleDownload(e, item)}
                        className="absolute bottom-2 right-2 p-1.5 bg-gray-300/80 dark:bg-zinc-800/80 rounded-full hover:bg-[#864ffe] transition-colors duration-200"
                        aria-label="Download this image"
                        title="Download Image"
                    >
                        <DownloadIcon className="w-4 h-4 text-[#1a1a1c] dark:text-[#fcfcfc]" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {history.length > 0 && (
          <div className="mt-4 text-center border-t border-gray-200 dark:border-zinc-700 pt-4">
              <button
                  onClick={onClear}
                  className="w-full px-4 py-2 bg-[#e60080] text-white/90 font-semibold rounded-lg shadow-md hover:opacity-90 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-[#e60080]/50 text-sm"
              >
                  Clear History
              </button>
          </div>
      )}
    </aside>
  );
};

export default HistoryPanel;
