
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Spinner from './components/Spinner';
import { generateBlendedImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

// Define the structure of the image state
interface ImageState {
  file: File;
  base64: string;
}

const App: React.FC = () => {
  const [groupPhoto, setGroupPhoto] = useState<ImageState | null>(null);
  const [personPhoto, setPersonPhoto] = useState<ImageState | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGroupPhotoChange = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      setGroupPhoto({ file, base64 });
      setGeneratedImage(null); // Clear previous result
      setError(null);
    } catch (err) {
      setError('Failed to read group photo.');
      console.error(err);
    }
  };
  
  const handlePersonPhotoChange = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      setPersonPhoto({ file, base64 });
      setGeneratedImage(null); // Clear previous result
      setError(null);
    } catch (err) {
      setError('Failed to read person photo.');
      console.error(err);
    }
  };

  const handleGenerateClick = useCallback(async () => {
    if (!groupPhoto || !personPhoto) {
      setError('Please upload both a group photo and a person photo.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultBase64 = await generateBlendedImage(groupPhoto, personPhoto);
      setGeneratedImage(resultBase64);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate image: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [groupPhoto, personPhoto]);

  const canGenerate = groupPhoto && personPhoto && !isLoading;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUploader
            id="group-photo"
            title="Group Photo"
            description="Upload the main photo frame."
            onFileChange={handleGroupPhotoChange}
            previewUrl={groupPhoto?.base64 ?? null}
          />
          <ImageUploader
            id="person-photo"
            title="Person to Add"
            description="Upload the photo of the person."
            onFileChange={handlePersonPhotoChange}
            previewUrl={personPhoto?.base64 ?? null}
          />
        </div>
        <div className="text-center">
          <button
            onClick={handleGenerateClick}
            disabled={!canGenerate}
            className="px-8 py-3 bg-teal-500 text-white font-bold rounded-lg shadow-lg hover:bg-teal-600 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-teal-500/50"
          >
            {isLoading ? 'Blending...' : 'Generate Photo'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative text-center" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-lg">
            <Spinner />
            <p className="mt-4 text-lg text-slate-400">AI is working its magic... Please wait.</p>
          </div>
        )}

        {generatedImage && (
          <ResultDisplay
            image={generatedImage}
            onReset={() => {
              setGroupPhoto(null);
              setPersonPhoto(null);
              setGeneratedImage(null);
            }}
          />
        )}
      </main>
      <footer className="w-full max-w-6xl mx-auto text-center py-6 mt-8 border-t border-slate-700">
        <p className="text-slate-500">Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
