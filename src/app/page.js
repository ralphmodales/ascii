'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [asciiArt, setAsciiArt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('width', width);
    formData.append('height', height);

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
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Image to ASCII Art Converter
      </h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full max-w-md"
          />

          <div className="flex space-x-4">
            <div className="flex flex-col">
              <label htmlFor="width" className="mb-2">Width (1-1000):</label>
              <input
                type="number"
                id="width"
                min="1"
                max="1000"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
                className="border rounded bg-white text-black p-2 w-24"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="height" className="mb-2">Height (1-1000):</label>
              <input
                type="number"
                id="height"
                min="1"
                max="1000"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="border rounded bg-white text-black p-2 w-24"
              />
            </div>
          </div>

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
        <div className="bg-black text-white rounded">
          <pre className="text-xs whitespace-pre font-mono">
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
