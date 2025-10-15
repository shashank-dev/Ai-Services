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
    <aside className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0 bg-slate-800 rounded-lg p-4 lg:sticky lg:top-8 self-start">
      <h2 className="text-xl font-bold text-center text-slate-300 mb-4 border-b border-slate-700 pb-2">
        History
      </h2>
      <div className="overflow-y-auto pr-2" style={{maxHeight: 'calc(100vh - 210px)'}}>
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-slate-500 pt-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
            <p className="mt-4">Your previous generations will appear here.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3">
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
                    className="w-full aspect-square object-cover rounded-md border-2 border-slate-600 group-hover:border-teal-400 transition-all duration-200 shadow-md"
                  />
                  <div className="absolute inset-0 bg-slate-900/70 flex flex-col items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md">
                    <div className="text-center">
                      <span className="text-sm font-bold text-teal-400">{resolutionLabel}</span>
                      <span className="text-xs text-slate-300 block mt-1">{item.aspectRatio}</span>
                    </div>
                    <button
                        onClick={(e) => handleDownload(e, item)}
                        className="absolute bottom-2 right-2 p-1.5 bg-slate-700/80 rounded-full hover:bg-teal-500 transition-colors duration-200"
                        aria-label="Download this image"
                        title="Download Image"
                    >
                        <DownloadIcon className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {history.length > 0 && (
          <div className="mt-4 text-center border-t border-slate-700 pt-4">
              <button
                  onClick={onClear}
                  className="w-full px-4 py-2 bg-red-800 text-white/90 font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-red-800/50 text-sm"
              >
                  Clear History
              </button>
          </div>
      )}
    </aside>
  );
};

export default HistoryPanel;