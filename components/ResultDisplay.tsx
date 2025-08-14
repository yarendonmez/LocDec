import React from 'react';
import type { AnalysisResult } from '../types';

interface ResultDisplayProps {
  imageUrl: string;
  result: AnalysisResult;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, result, onReset }) => {
  return (
    <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="p-6 md:p-8 flex flex-col justify-between order-2 md:order-1">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-2">
              Determined Location
            </h2>
            <p className="text-3xl lg:text-4xl font-bold text-white">
              {result.location}
            </p>
            
            <div className="my-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-1">
                  Confidence Score
                </h3>
                <p className="text-xl font-semibold text-white">{result.confidence}</p>
            </div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4">
              Justification & Evidence
            </h3>
            <div className="space-y-5">
              {Object.entries(result.justification).map(([category, reasons]) => (
                reasons.length > 0 && (
                  <div key={category}>
                    <h4 className="font-semibold text-slate-100 mb-2">{category}</h4>
                    <ul className="space-y-2 text-slate-300 list-disc list-inside pl-2">
                      {reasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )
              ))}
            </div>
            
            {result.sources && result.sources.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-700">
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                  Sources Used
                </h3>
                <ul className="space-y-3">
                  {result.sources.map((source, index) => (
                    <li key={index}>
                      <a
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group text-slate-300 transition-colors duration-200"
                        title={source.title}
                      >
                        <span className="font-semibold group-hover:text-indigo-400 group-hover:underline">{source.title || new URL(source.uri).hostname}</span>
                        <p className="text-xs text-slate-500 truncate group-hover:text-slate-400" title={source.uri}>{source.uri}</p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button
            onClick={onReset}
            className="mt-8 w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Analyze Another Image
          </button>
        </div>
        <div className="relative min-h-[300px] md:min-h-0 order-1 md:order-2">
          <img
            src={imageUrl}
            alt="Uploaded for analysis"
            className="absolute inset-0 w-full h-full object-cover"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-slate-800/50 to-transparent md:bg-gradient-to-r md:from-slate-800 md:via-slate-800/50 md:to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;