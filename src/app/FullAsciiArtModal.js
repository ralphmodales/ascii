'use client';

import { useState } from 'react';
import { Maximize2, X } from 'lucide-react';

export default function FullAsciiArtModal({ asciiArt, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative bg-[#121212] rounded-xl shadow-2xl w-11/12 max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-[#212121] border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Full ASCII Art View</h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-300 transition"
          >
            <X size={24} />
          </button>
        </div>
        <pre 
          className="p-6 text-xs whitespace-pre overflow-auto font-mono text-white bg-[#121212] max-h-[75vh]" 
          style={{ 
            scrollbarWidth: 'thin', 
            scrollbarColor: 'rgba(55,65,81,1) rgba(17,24,39,1)' 
          }}
        >
          {asciiArt}
        </pre>
      </div>
    </div>
  );
}
