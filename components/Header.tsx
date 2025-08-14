import React from 'react';
import LocDecLogo from './icons/LocDecLogo';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-4 mb-2">
        <LocDecLogo className="w-10 h-10 text-indigo-400" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          LocDec
        </h1>
      </div>
      <p className="max-w-2xl mx-auto text-lg text-slate-400">
        Upload an image, and our advanced AI will reveal where it was taken and why.
      </p>
    </header>
  );
};

export default Header;