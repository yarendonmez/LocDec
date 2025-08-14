import React, { useState, useCallback } from 'react';
import { analyzeImageForLocation } from './services/geminiService';
import type { AnalysisResult } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (file: File) => {
    if (isLoading) return;

    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
    setError(null);
    setIsLoading(true);

    try {
      const result = await analyzeImageForLocation(file);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleReset = useCallback(() => {
    setImageFile(null);
    setImageUrl(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
    if(imageUrl) {
        URL.revokeObjectURL(imageUrl);
    }
  }, [imageUrl]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          {!analysisResult && !isLoading && (
            <ImageUploader onImageSelect={handleImageSelect} isLoading={isLoading} />
          )}
          {isLoading && <Loader />}
          {error && !isLoading && (
            <div className="text-center p-8 bg-slate-800 rounded-lg shadow-xl">
              <h3 className="text-xl text-red-400 font-semibold">An Error Occurred</h3>
              <p className="mt-2 text-slate-400">{error}</p>
              <button
                onClick={handleReset}
                className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          {analysisResult && !isLoading && imageUrl && (
            <ResultDisplay
              imageUrl={imageUrl}
              result={analysisResult}
              onReset={handleReset}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;