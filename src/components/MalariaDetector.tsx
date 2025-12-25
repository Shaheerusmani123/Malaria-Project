// src/components/MalariaDetector.tsx
import React, { useState } from 'react';

interface PredictionResult {
  success: boolean;
  prediction: string;
  confidence: string;
  probability: string;
}

export default function MalariaDetector() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // IMPORTANT: Change this to your Render.com URL after deployment
  const API_URL = 'http://localhost:5000/api/predict';
  // After deploying to Render, change to:
  // const API_URL = 'https://your-app-name.onrender.com/api/predict';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setResult(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data: PredictionResult = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Error making prediction. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🔬 Malaria Cell Detector
            </h1>
            <p className="text-gray-600">
              Upload a microscopic blood cell image for AI-powered analysis
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors bg-gray-50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="space-y-3">
                  <svg
                    className="mx-auto h-16 w-16 text-blue-500"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      Click to upload image
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG, JPEG (Max 10MB)
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {preview && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full h-auto rounded-lg shadow-md mx-auto border-2 border-gray-200"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedFile || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Analyzing Cell...
                </span>
              ) : (
                '🔍 Analyze Cell'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-red-800">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-6 p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border-2 border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="text-2xl mr-2">📊</span>
                Analysis Results
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                  <span className="font-semibold text-gray-700">Diagnosis:</span>
                  <span
                    className={`px-5 py-2 rounded-full font-bold text-sm shadow-md ${
                      result.prediction === 'Parasitized'
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                    }`}
                  >
                    {result.prediction}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                  <span className="font-semibold text-gray-700">Confidence:</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {result.confidence}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      result.prediction === 'Parasitized'
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : 'bg-gradient-to-r from-green-500 to-green-600'
                    }`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>

                {result.prediction === 'Parasitized' ? (
                  <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                    <p className="font-semibold text-yellow-800 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      ⚠️ Medical Attention Required
                    </p>
                    <p className="text-sm text-yellow-800 mt-2">
                      This cell shows signs of malaria parasite infection. Please seek immediate medical consultation for proper diagnosis and treatment.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
                    <p className="font-semibold text-green-800 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      ✓ No Parasites Detected
                    </p>
                    <p className="text-sm text-green-800 mt-2">
                      The analysis indicates no malaria parasites in this cell sample.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>⚕️ Medical Disclaimer:</strong> This AI tool is designed for educational and research purposes only. It should not be used as a substitute for professional medical diagnosis, advice, or treatment. Always consult qualified healthcare providers for medical concerns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
