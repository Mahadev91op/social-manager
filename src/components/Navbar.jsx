import React from 'react';

const Navbar = () => {
  return (
    <nav className="w-full p-4 mb-8 border-b border-gray-800 bg-black/20 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          DevSamp <span className="text-sm font-light text-gray-400">Vault</span>
        </h1>
        <div className="text-xs text-gray-500 border border-gray-800 px-3 py-1 rounded-full">
          Secure. Encrypted. Private.
        </div>
      </div>
    </nav>
  );
};

export default Navbar;