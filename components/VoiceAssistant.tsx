
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage, LanguageCode } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import MicrophoneIcon from './icons/MicrophoneIcon';
import SpeakerIcon from './icons/SpeakerIcon';
import { useLanguage } from '../hooks/useLanguage';

// Per-language welcome messages
const WELCOME_MSG: Record<string, string> = {
  'en-US': "🌱 Hello! I'm your AI farming assistant. Ask me anything about crops, diseases, weather, soil, or farming techniques!",
  'hi-IN': "🌱 नमस्ते! मैं आपका AI कृषि सहायक हूँ। फसल, रोग, मिट्टी, या खेती की किसी भी समस्या के बारे में पूछें!",
  'te-IN': "🌱 నమస్కారం! నేను మీ AI వ్యవసాయ సహాయకుడిని. పంటలు, వ్యాధులు, నేల, లేదా వ్యవసాయ పద్ధతుల గురించి ఏదైనా అడగండి!",
  'ml-IN': "🌱 നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI കൃഷി അസിസ്റ്റന്റ് ആണ്. വിള, രോഗം, മണ്ണ്, അല്ലെങ്കിൽ കൃഷി ടെക്നിക്കുകൾ എന്തും ചോദിക്കൂ!",
};

const makeWelcome = (lang: string): ChatMessage => ({
  id: 'welcome-' + lang,
  text: WELCOME_MSG[lang] ?? WELCOME_MSG['en-US'],
  sender: 'ai',
});

const VoiceAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([makeWelcome('en-US')]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();

  // Reset chat with translated welcome when language changes
  useEffect(() => {
    setMessages([makeWelcome(language)]);
    setInput('');
  }, [language]);

  const handleTranscript = (transcript: string) => {
    setInput(transcript);
    handleSubmit(transcript);
  };

  const { isListening, startListening, stopListening, isSpeaking, speak, cancelSpeech, supported } = useSpeech({
    onTranscript: handleTranscript,
    lang: language,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (query?: string) => {
    const text = (typeof query === 'string' ? query : input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const aiText = await getChatResponse(messages, text, language);
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), text: aiText, sender: 'ai' };
      setMessages(prev => [...prev, aiMsg]);
      speak(aiText);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: t('voiceAssistant.errorResponse'),
        sender: 'ai',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'linear-gradient(160deg,#f0fdf4 0%,#e0f2fe 100%)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/60 backdrop-blur-sm border-b border-white/70">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <div>
            <p className="text-sm font-bold text-gray-800">AI Farming Assistant</p>
            <p className="text-xs text-green-600 font-medium">● Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500">{t('voiceAssistant.language')}</label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value as LanguageCode)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value={LanguageCode.ENGLISH}>{t('languages.en-US')}</option>
            <option value={LanguageCode.HINDI}>{t('languages.hi-IN')}</option>
            <option value={LanguageCode.TELUGU}>{t('languages.te-IN')}</option>
            <option value={LanguageCode.MALAYALAM}>{t('languages.ml-IN')}</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {/* min-h-full + justify-center: centers messages when few, scrolls when many */}
        <div className="min-h-full flex flex-col justify-center gap-3">
          {messages.map((msg, idx) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-sm shadow flex-shrink-0">
                  🌱
                </div>
              )}
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                  ? 'bg-green-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                  }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'ai' && idx === messages.length - 1 && (
                <button
                  onClick={() => (isSpeaking ? cancelSpeech() : speak(msg.text))}
                  className={`p-1.5 rounded-full transition-all active:scale-90 ${isSpeaking ? 'bg-red-500 text-white' : 'bg-white text-gray-500 hover:text-green-700 shadow'}`}
                >
                  <SpeakerIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-sm shadow">
                🌱
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 flex items-center gap-1">
                <span className="dot-bounce w-2 h-2 bg-green-400 rounded-full inline-block" />
                <span className="dot-bounce w-2 h-2 bg-green-400 rounded-full inline-block" />
                <span className="dot-bounce w-2 h-2 bg-green-400 rounded-full inline-block" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>{/* end space-y-3 */}
      </div>{/* end messages outer */}

      {/* Input bar */}
      <div className="flex-shrink-0 px-4 py-3 bg-white/80 backdrop-blur-md border-t border-white/70">
        {!supported && (
          <p className="text-xs text-red-500 text-center mb-2">{t('voiceAssistant.unsupported')}</p>
        )}
        <div className="flex items-center gap-2 bg-white rounded-2xl shadow px-3 py-2 border border-gray-100">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder={t('voiceAssistant.placeholder')}
            disabled={isLoading}
            className="flex-1 text-sm bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
          />
          {/* Mic button */}
          <button
            onClick={() => isListening ? stopListening() : startListening()}
            disabled={!supported || isLoading}
            className={`p-2.5 rounded-xl text-white transition-all active:scale-90 ${isListening ? 'bg-red-500 mic-ring' : 'bg-blue-500 hover:bg-blue-600'
              } disabled:bg-gray-300`}
          >
            <MicrophoneIcon className="w-5 h-5" />
          </button>
          {/* Send button */}
          <button
            onClick={() => handleSubmit()}
            disabled={isLoading || !input.trim()}
            className="btn-primary px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t('voiceAssistant.send')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;