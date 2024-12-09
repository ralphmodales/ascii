'use client';

import { useState } from 'react';
import { Copy, Upload, Wand2 } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [asciiArt, setAsciiArt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
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
    <div className="min-h-screen bg-black text-white py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-white">
          Image to ASCII Art Converter
        </h1>

        <div className="bg-[#212121] rounded-xl shadow-2xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full max-w-md">
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:bg-black transition"
                >
                  <Upload className="mr-2 text-white" />
                  <span className="text-white">
                    {file ? file.name : 'Choose an image to convert'}
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex space-x-4">
                <div className="flex flex-col">
                  <label htmlFor="width" className="mb-2 text-white">Width (1-1000):</label>
                  <input
                    type="number"
                    id="width"
                    min="1"
                    max="1000"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value))}
                    className="border border-black rounded bg-[#121212] text-white p-2 w-24 focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="height" className="mb-2 text-gray-300">Height (1-1000):</label>
                  <input
                    type="number"
                    id="height"
                    min="1"
                    max="1000"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    className="border border-black rounded bg-[#121212] text-white p-2 w-24 focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!file || isLoading}
                className="flex items-center justify-center bg-black text-white px-6 py-2 rounded hover:bg-white hover:text-black disabled:bg-[#212121] transition"
              >
                {isLoading ? (
                  <>
                    <Wand2 className="mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2" />
                    Convert to ASCII
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {asciiArt && (
          <div className="bg-[#121212] rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 bg-[#121212]">
              <h2 className="text-xl font-semibold text-white">Generated ASCII Art</h2>
            </div>
            <pre
              className="p-4 text-xs whitespace-pre overflow-x-auto font-mono text-white bg-[#121212] max-h-[600px]"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(55,65,81,1) rgba(17,24,39,1)' }}
            >
              {asciiArt}
            </pre>
            <div className="flex justify-center p-4">
              <button
                onClick={handleCopy}
                className="flex items-center bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                <Copy className="mr-2" />
                Copy ASCII Art
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
