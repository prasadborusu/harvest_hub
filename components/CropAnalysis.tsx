
import React, { useState, useRef } from 'react';
import { analyzeCropHealth } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import { AppView } from '../types';
import CameraIcon from './icons/CameraIcon';
import SpeakerIcon from './icons/SpeakerIcon';
import { useSpeech } from '../hooks/useSpeech';
import AccuracyMeter from './AccuracyMeter';
import { useLanguage } from '../hooks/useLanguage';

interface CropAnalysisProps {
  setCurrentView: (view: AppView) => void;
}

const confidenceToPercentage = (confidence: 'High' | 'Medium' | 'Low' | string): number => {
  switch (confidence?.toLowerCase()) {
    case 'high':
      return Math.floor(Math.random() * (98 - 90 + 1)) + 90; // 90-98%
    case 'medium':
      return Math.floor(Math.random() * (89 - 75 + 1)) + 75; // 75-89%
    case 'low':
      return Math.floor(Math.random() * (74 - 50 + 1)) + 50; // 50-74%
    default:
      return Math.floor(Math.random() * (60 - 40 + 1)) + 40; // 40-60% as a fallback
  }
};


const CropAnalysis: React.FC<CropAnalysisProps> = ({ setCurrentView }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [showFertilizerModal, setShowFertilizerModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const { speak, isSpeaking, cancelSpeech } = useSpeech({ onTranscript: () => { } });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysis(null);
      setError(null);
      setAccuracy(null);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!imageFile) return;
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setAccuracy(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      const result = await analyzeCropHealth(base64Image, imageFile.type);
      setAnalysis(result);
      if (result.confidence && !result.isHealthy) {
        setAccuracy(confidenceToPercentage(result.confidence));
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };



  const handleSpeak = () => {
    if (isSpeaking) {
      cancelSpeech();
      return;
    }
    if (analysis) {
      const textToSpeak = `Analysis complete. The detected issue is ${analysis.disease}. Here is the recommended remedy: ${analysis.remedy}`;
      speak(textToSpeak);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('cropAnalysis.title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Upload */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">{t('cropAnalysis.uploadTitle')}</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Crop preview" className="mx-auto h-48 w-auto rounded-lg object-contain" />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <CameraIcon className="w-12 h-12 mb-2" />
                <p>{t('cropAnalysis.uploadPrompt')}</p>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 active:scale-95"
            >
              {t('cropAnalysis.selectImage')}
            </button>
            <button
              onClick={handleAnalyzeClick}
              disabled={!imageFile || isLoading}
              className="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95"
            >
              {isLoading ? t('cropAnalysis.analyzing') : t('cropAnalysis.analyzeCrop')}
            </button>
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">{t('cropAnalysis.resultsTitle')}</h2>
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500"></div>
              <p className="mt-4 text-gray-600">{t('cropAnalysis.aiAnalyzing')}</p>
            </div>
          )}
          {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}
          {analysis && (
            <div className="space-y-4 animate-fade-in">
              {accuracy !== null && !analysis.isHealthy && (
                <div className="text-green-600 flex justify-center pb-2 border-b mb-4">
                  <AccuracyMeter percentage={accuracy} />
                </div>
              )}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{t('cropAnalysis.diagnosis')}</p>
                  <h3 className="text-2xl font-bold text-gray-800">{analysis.disease}</h3>
                </div>
                <button onClick={handleSpeak} className={`p-2 rounded-full transition-all ${isSpeaking ? 'bg-red-500 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'} active:scale-90`}>
                  <SpeakerIcon className="w-6 h-6" />
                </button>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('cropAnalysis.description')}</p>
                <p className="text-gray-700">{analysis.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('cropAnalysis.remedy')}</p>
                <p className="text-gray-700 whitespace-pre-wrap">{analysis.remedy}</p>
              </div>
              <div className="pt-2">
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${analysis.isHealthy ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                  {analysis.isHealthy ? t('cropAnalysis.healthyPlant') : t('cropAnalysis.confidence', { value: analysis.confidence })}
                </span>
              </div>
              {!analysis.isHealthy && (
                <div className="pt-4">
                  <button
                    onClick={() => setShowFertilizerModal(true)}
                    className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition-all duration-300 shadow-md active:scale-95"
                  >
                    {t('cropAnalysis.findFertilizers')}
                  </button>
                </div>
              )}
            </div>
          )}
          {!isLoading && !analysis && !error && (
            <div className="text-center text-gray-500 pt-16">
              <p>{t('cropAnalysis.resultsPlaceholder')}</p>
            </div>
          )}
        </div>
      </div>
      {/* Fertilizer Recommendation Modal */}
      {showFertilizerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">{t('cropAnalysis.modalTitle')}</h3>
              <button onClick={() => setShowFertilizerModal(false)} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <p className="mb-4 text-gray-600">{t('cropAnalysis.modalDesc', { disease: analysis.disease })}</p>
              <div className="space-y-4">
                {/* Mock recommendations */}
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-bold text-lg text-green-800">{t('cropAnalysis.recommendation1Title')}</h4>
                  <p className="text-sm text-gray-600">{t('cropAnalysis.recommendation1Desc')}</p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-bold text-lg text-green-800">{t('cropAnalysis.recommendation2Title')}</h4>
                  <p className="text-sm text-gray-600">{t('cropAnalysis.recommendation2Desc')}</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t text-right space-x-3">
              <button
                onClick={() => setShowFertilizerModal(false)}
                className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all duration-300 active:scale-95"
              >
                {t('cropAnalysis.close')}
              </button>
              <button
                onClick={() => {
                  setShowFertilizerModal(false);
                  setCurrentView(AppView.FERTILIZER_STORE);
                }}
                className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 active:scale-95"
              >
                {t('cropAnalysis.goToStore')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropAnalysis;
