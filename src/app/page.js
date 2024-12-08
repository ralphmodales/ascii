'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [asciiArt, setAsciiArt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsLoading(true);
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const result = await response.json();
      setAsciiArt(result.asciiArt);
    } catch (error) {
      console.error('Conversion failed', error);
      alert('Failed to convert image');
    }
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(asciiArt);
    alert('ASCII Art Copied!');
  };

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Image to ASCII Art Converter
      </h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col items-center">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="mb-4 w-full max-w-md"
          />
          <button 
            type="submit" 
            disabled={!file || isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? 'Converting...' : 'Convert to ASCII'}
          </button>
        </div>
      </form>

      {asciiArt && (
        <div className="bg-gray-100 p-4 rounded">
          <pre className="overflow-x-auto text-xs whitespace-pre font-mono">
            {asciiArt}
          </pre>
          <div className="flex justify-center mt-4">
            <button 
              onClick={handleCopy}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Copy ASCII Art
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
