import { useState, useRef, useCallback, useEffect } from 'react';

// Note: The 'SpeechRecognition' and 'webkitSpeechRecognition' are globals provided by the browser.
// We declare them here to satisfy TypeScript.
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;

  }
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition: any = null;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
}

interface UseSpeechOptions {
  onTranscript: (transcript: string) => void;
  lang?: string;
}

export const useSpeech = ({ onTranscript, lang = 'en-US' }: UseSpeechOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(!!SpeechRecognition && !!window.speechSynthesis);

  useEffect(() => {
    if(recognition) {
        recognition.lang = lang;
    }
  }, [lang]);

  const stopListening = useCallback(() => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const startListening = useCallback(() => {
    if (isListening || !recognition) {
      return;
    }
    try {
      recognition.start();
      setIsListening(true);
    } catch(e) {
      console.error("Speech recognition could not start.", e);
      setIsListening(false);
    }
  }, [isListening]);

  useEffect(() => {
    if (!recognition) return;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    return () => {
        if(recognition){
            recognition.onstart = null;
            recognition.onend = null;
            recognition.onerror = null;
            recognition.onresult = null;
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onTranscript]);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis || isSpeaking) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
        console.error("Speech synthesis error:", e.error);
        setIsSpeaking(false);
    };
    window.speechSynthesis.speak(utterance);
  }, [isSpeaking, lang]);

  const cancelSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { isListening, isSpeaking, supported, startListening, stopListening, speak, cancelSpeech };
};
