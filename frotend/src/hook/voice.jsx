import { useState, useEffect, useRef } from 'react';
import { Mic, Square } from 'lucide-react'; // Make sure you have lucide-react installed

// ==========================================
// 1. Named Export: useTextToSpeech Hook
// ==========================================
export function useTextToSpeech() {
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);
  const [voices, setVoices] = useState([]);
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;

      const updateVoices = () => {
        if (synthRef.current) {
          setVoices(synthRef.current.getVoices());
        }
      };

      updateVoices();

      // Handle async voice loading in modern browsers
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = updateVoices;
      }
    }

    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  const speak = (text, index) => {
    if (!synthRef.current) return;

    // Toggle stop if clicking the same button twice
    if (currentPlayingIndex === index) {
      synthRef.current.cancel();
      setCurrentPlayingIndex(null);
      return;
    }

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Select a premium sounding voice if available
    const premiumVoice = voices.find(
      (v) => (v.name.includes('Google') || v.name.includes('Natural')) && v.lang.startsWith('en')
    );
    if (premiumVoice) utterance.voice = premiumVoice;

    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onend = () => setCurrentPlayingIndex(null);
    utterance.onerror = () => setCurrentPlayingIndex(null);

    setCurrentPlayingIndex(index);
    synthRef.current.speak(utterance);
  };

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setCurrentPlayingIndex(null);
    }
  };

  return { speak, stop, currentPlayingIndex };
}

// ==========================================
// 2. Default Export: VoiceRecorder Component
// ==========================================
export default function VoiceRecorder({ onTranscribe, disabled }) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          if (onTranscribe) {
            onTranscribe(transcript);
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [onTranscribe]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Try Chrome or Safari.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  return (
    <button
      type="button"
      onClick={toggleRecording}
      disabled={disabled}
      className={`p-2 rounded-xl transition-all ${
        isRecording 
          ? 'text-red-500 bg-red-50 animate-pulse' 
          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isRecording ? 'Stop recording' : 'Record voice'}
    >
      {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  );
}