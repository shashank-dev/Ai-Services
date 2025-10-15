import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Spinner from './components/Spinner';
import HistoryPanel from './components/HistoryPanel';
import ConfirmationModal from './components/ConfirmationModal';
import AuthModal from './components/AuthModal';
import { generateBlendedImage } from './services/geminiService';
import * as authService from './services/authService';
import { fileToBase64 } from './utils/fileUtils';
import { User } from './services/authService';

// State for an uploaded image
interface ImageState {
  file: File;
  dataUrl: string;
}

// Structure for a history item
export interface HistoryItem {
  id: string;
  groupPhoto: ImageState;
  personPhoto: ImageState;
  resolution: string;
  aspectRatio: string;
  generatedImage: string; // base64 string of the result
}

const resolutionOptions = [
    { id: 'standard', label: 'Standard', tooltip: 'Fastest | Good for web & social media.' },
    { id: 'hd', label: 'HD', tooltip: 'High Quality | Good for viewing & small prints.' },
    { id: 'ultra_hd', label: 'Ultra HD', tooltip: 'Best Quality | Slower | For large prints.' },
];

const aspectRatioOptions = [
    { id: 'Auto', label: 'Auto', tooltip: 'AI chooses the best fit for your photo.' },
    { id: 'Square', label: 'Square', tooltip: '1:1 | Perfect for Instagram posts.' },
    { id: 'Portrait', label: 'Portrait', tooltip: '3:4 | Ideal for stories & mobile wallpapers.' },
    { id: 'Landscape', label: 'Landscape', tooltip: '4:3 | Great for standard frames & screens.' },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [groupPhoto, setGroupPhoto] = useState<ImageState | null>(null);
  const [personPhoto, setPersonPhoto] = useState<ImageState | null>(null);
  const [resolution, setResolution] = useState<string>('standard');
  const [aspectRatio, setAspectRatio] = useState<string>('Auto');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  // Check for logged-in user on initial render
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);
  
  // Load user-specific history when user logs in
  useEffect(() => {
    if (currentUser) {
      const userHistory = authService.getUserHistory(currentUser.username);
      setHistory(userHistory);
    } else {
      setHistory([]); // Clear history on logout
    }
  }, [currentUser]);

  // Save history whenever it changes for the current user
  useEffect(() => {
    if (currentUser) {
      authService.saveUserHistory(currentUser.username, history);
    }
  }, [history, currentUser]);

  const handleFileChange = async (file: File, type: 'group' | 'person') => {
    try {
      const dataUrl = await fileToBase64(file);
      const newState = { file, dataUrl };
      if (type === 'group') {
        setGroupPhoto(newState);
      } else {
        setPersonPhoto(newState);
      }
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while processing the file.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!groupPhoto || !personPhoto) {
      setError('Please upload both a group photo and a photo of the person to add.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const resultBase64 = await generateBlendedImage(
        { file: groupPhoto.file, base64: groupPhoto.dataUrl },
        { file: personPhoto.file, base64: personPhoto.dataUrl },
        resolution,
        aspectRatio
      );
      setGeneratedImage(resultBase64);

      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        groupPhoto,
        personPhoto,
        resolution,
        aspectRatio,
        generatedImage: resultBase64,
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 19)]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during image generation.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setGroupPhoto(null);
    setPersonPhoto(null);
    setError(null);
    setIsLoading(false);
  };
  
  const handleSelectHistoryItem = useCallback((id: string) => {
    const item = history.find(h => h.id === id);
    if (item) {
      setGroupPhoto(item.groupPhoto);
      setPersonPhoto(item.personPhoto);
      setResolution(item.resolution);
      setAspectRatio(item.aspectRatio);
      setGeneratedImage(item.generatedImage);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [history]);

  const handleClearHistory = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmClearHistory = () => {
    setHistory([]);
    setIsConfirmModalOpen(false);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    handleReset(); // Also reset the form
  };

  const renderMainContent = () => {
    if (!currentUser) {
      return (
        <div className="text-center p-8 bg-slate-800/50 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-100">Welcome to the AI Photo Blender</h2>
            <p className="mt-4 text-slate-400">Please log in or register to begin creating and saving your blended photos. Your personal gallery awaits.</p>
            <button
                onClick={() => setIsAuthModalOpen(true)}
                className="mt-8 px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg shadow-lg hover:from-teal-600 hover:to-cyan-700 transition-all duration-300"
            >
                Login / Register
            </button>
        </div>
      );
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto bg-slate-800 rounded-lg shadow-2xl p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <ImageUploader
                    id="group-photo"
                    title="1. Upload Group Photo"
                    description="The main photo where you want to add someone."
                    onFileChange={(file) => handleFileChange(file, 'group')}
                    previewUrl={groupPhoto?.dataUrl || null}
                />
                <ImageUploader
                    id="person-photo"
                    title="2. Upload Person's Photo"
                    description="A clear photo of the person you want to add."
                    onFileChange={(file) => handleFileChange(file, 'person')}
                    previewUrl={personPhoto?.dataUrl || null}
                />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Output Resolution</label>
                        <div className="flex rounded-md shadow-sm">
                            {resolutionOptions.map((option, index) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setResolution(option.id)}
                                    className={`relative -ml-px inline-flex items-center justify-center w-full px-4 py-2 border text-sm font-medium transition-colors focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500
                                    ${resolution === option.id ? 'bg-teal-600 text-white border-teal-500 z-10' : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'}
                                    ${index === 0 ? 'rounded-l-md' : ''}
                                    ${index === resolutionOptions.length - 1 ? 'rounded-r-md' : ''}`}
                                    title={option.tooltip}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
                         <div className="flex rounded-md shadow-sm">
                            {aspectRatioOptions.map((option, index) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setAspectRatio(option.id)}
                                    className={`relative -ml-px inline-flex items-center justify-center w-full px-4 py-2 border text-sm font-medium transition-colors focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500
                                    ${aspectRatio === option.id ? 'bg-teal-600 text-white border-teal-500 z-10' : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'}
                                    ${index === 0 ? 'rounded-l-md' : ''}
                                    ${index === aspectRatioOptions.length - 1 ? 'rounded-r-md' : ''}`}
                                    title={option.tooltip}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {error && (
                <div className="my-4 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-md text-center">
                    {error}
                </div>
                )}

                <button
                    type="submit"
                    disabled={!groupPhoto || !personPhoto || isLoading}
                    className="w-full py-4 text-lg font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg shadow-lg hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700"
                >
                    {isLoading ? 'Generating...' : 'Blend Photos'}
                </button>
            </form>

            <div className="mt-8 w-full max-w-4xl mx-auto">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-800 rounded-lg">
                        <Spinner />
                        <p className="mt-4 text-lg text-slate-300 font-semibold animate-pulse">
                            AI is blending your photos...
                        </p>
                        <p className="mt-2 text-sm text-slate-400">
                            This can take a moment. Please wait.
                        </p>
                    </div>
                )}

                {generatedImage && !isLoading && (
                    <ResultDisplay image={generatedImage} onReset={handleReset} />
                )}
            </div>
        </>
    );
  };

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans p-4 sm:p-8">
      <div className="container mx-auto">
        <Header 
          user={currentUser}
          onLoginClick={() => setIsAuthModalOpen(true)}
          onLogoutClick={handleLogout}
        />
        <main className="mt-8 flex flex-col lg:flex-row gap-8">
          <div className="flex-grow">
            {renderMainContent()}
          </div>
          {currentUser && <HistoryPanel history={history} onSelect={handleSelectHistoryItem} onClear={handleClearHistory} />}
        </main>
      </div>
      {isAuthModalOpen && (
          <AuthModal
              onClose={() => setIsAuthModalOpen(false)}
              onLoginSuccess={handleLoginSuccess}
          />
      )}
      <ConfirmationModal 
        isOpen={isConfirmModalOpen}
        onConfirm={handleConfirmClearHistory}
        onCancel={() => setIsConfirmModalOpen(false)}
        title="Clear History?"
        message="Are you sure you want to delete all your generated images? This action cannot be undone."
      />
    </div>
  );
};

export default App;