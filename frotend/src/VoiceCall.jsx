import { useState, useEffect, useRef, useCallback } from 'react';
import useChatStore from './app/usechat.store';

const VoiceCall = () => {
    const isSpeechSupported = typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
    const [isListening, setIsListening] = useState(false);
    const [isResponding, setIsResponding] = useState(false);
    const [chatStatus, setChatStatus] = useState(isSpeechSupported ? 'Click to start call' : 'Speech recognition not supported.');

    const recognitionRef = useRef(null);
    const isListeningRef = useRef(false);
    const isRespondingRef = useRef(false);
    const sentenceBufferRef = useRef('');
    const assistantMessageIndexRef = useRef(null);

    const addMessage = useCallback((message) => {
      let messageIndex = null;
      useChatStore.setState((state) => {
        const messages = [...state.messages, message];
        messageIndex = messages.length - 1;
        return { messages };
      });
      return messageIndex;
    }, []);

    const appendAssistantMessage = useCallback((chunk) => {
      useChatStore.setState((state) => {
        const messages = [...state.messages];
        const index = assistantMessageIndexRef.current;
        if (index === null || index < 0 || index >= messages.length) return state;
        const current = messages[index]?.content || '';
        messages[index] = { ...messages[index], content: current + chunk };
        return { messages };
      });
    }, []);

    const speakSentence = useCallback((text) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find((v) => v.name.includes('Google') || v.name.includes('Natural'));
        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onerror = (e) => console.error('❌ SpeechSynthesisUtterance error:', e);
        window.speechSynthesis.speak(utterance);
      }
    }, []);

    const handleStreamingTTS = useCallback((textChunk) => {
      sentenceBufferRef.current += textChunk;
      const sentenceEndings = /[.?!]/;
      if (sentenceEndings.test(textChunk)) {
        const sentence = sentenceBufferRef.current.trim();
        if (sentence) speakSentence(sentence);
        sentenceBufferRef.current = '';
      }
    }, [speakSentence]);

    const startListening = useCallback(() => {
      const listening = isListeningRef.current;
      const responding = isRespondingRef.current;
      console.log('🔍 startListening called', {
        recognitionReady: Boolean(recognitionRef.current),
        listening,
        responding,
        isSpeechSupported,
      });
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (!recognitionRef.current) {
        console.warn('⚠️ SpeechRecognition is not initialized yet.');
        setChatStatus('Voice recognition not initialized.');
        return;
      }
      if (!isSpeechSupported) {
        console.warn('⚠️ Browser does not support SpeechRecognition.');
        setChatStatus('Speech recognition unsupported in this browser.');
        return;
      }
      if (listening || responding) {
        console.log('⏳ Ignoring start request because voice is already active or responding.');
        return;
      }
      console.log('🎧 Starting SpeechRecognition with object:', recognitionRef.current);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('❌ Could not start speech recognition:', err);
        setChatStatus('Failed to start recording.');
      }
    }, [isSpeechSupported]);

    const sendToBackend = useCallback(async (text) => {
      isRespondingRef.current = true;
      setIsResponding(true);
      try {
        const response = await fetch('http://localhost:8000/api/ai/talk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcribedText: text }),
        });

        if (!response.ok) throw new Error(`Server returned status code ${response.status}`);
        if (!response.body) throw new Error('Response body is not readable/streamable.');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        sentenceBufferRef.current = '';

        setChatStatus('AI is speaking...');

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          appendAssistantMessage(chunk);
          handleStreamingTTS(chunk);
        }
      } catch (error) {
        console.error('❌ Frontend connection failed:', error);
        setChatStatus('Connection failed.');
      } finally {
        isRespondingRef.current = false;
        setIsResponding(false);
        setChatStatus('Call active. Speak again.');
        startListening();
      }
    }, [appendAssistantMessage, handleStreamingTTS, startListening]);

    useEffect(() => {
      const SpeechRecognition = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
      if (!SpeechRecognition) {
        console.warn('VoiceCall: SpeechRecognition not available in this browser.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('🎤 Speech recognition started event');
        isListeningRef.current = true;
        setIsListening(true);
        setChatStatus('Listening to you...');
      };

      recognition.onspeechstart = () => {
        console.log('🗣️ Speech detected');
      };

      recognition.onspeechend = () => {
        console.log('🛑 Speech ended');
      };

      recognition.onend = () => {
        console.log('🔚 Speech recognition ended.');
        isListeningRef.current = false;
        setIsListening(false);
        if (!isRespondingRef.current) {
          setChatStatus('Tap to speak again');
        }
      };

      recognition.onnomatch = () => {
        console.warn('Speech recognition returned no matching result.');
        setChatStatus('No speech detected. Try again.');
      };

      recognition.onaudioend = () => {
        console.log('🎧 Audio capture ended.');
      };

      recognition.onerror = (event) => {
        console.error('❌ Speech recognition error event:', event);
        setChatStatus(`Error: ${event.error || 'Recognition failed'}`);
        setIsListening(false);
      };

      recognition.onresult = async (event) => {
        console.log('📝 Speech recognition result event', event);
        try {
          const results = event.results;
          if (!results || results.length === 0) {
            console.warn('No speech recognition results available');
            setChatStatus('No speech captured. Try again.');
            return;
          }

          const transcript = Array.from(results)
            .map((result) => result[0]?.transcript)
            .filter(Boolean)
            .map((text) => text.trim())
            .join(' ')
            .trim();

          console.log('🗣️ Recognized transcript:', transcript);

          if (!transcript) {
            setChatStatus('No recognizable speech. Please try again.');
            return;
          }

          addMessage({ role: 'user', content: transcript });
          assistantMessageIndexRef.current = addMessage({ role: 'assistant', content: '...thinking' });
          setChatStatus('Thinking...');

          await sendToBackend(transcript);
        } catch (err) {
          console.error('Error handling recognition result:', err);
          setChatStatus('Recognition processing failed.');
        }
      };

      recognitionRef.current = recognition;
      console.log('✅ SpeechRecognition instance created', recognition);
      if ('speechSynthesis' in window) window.speechSynthesis.getVoices();

      return () => {
        if (recognition) {
          recognition.onresult = null;
          recognition.onstart = null;
          recognition.onend = null;
          recognition.onerror = null;
          recognition.onnomatch = null;
          recognition.onaudioend = null;
          recognition.stop?.();
        }
      };
    }, [addMessage, sendToBackend]);

    const stopCall = useCallback(() => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.warn('Unable to stop speech recognition:', err);
        }
      }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setChatStatus('Call ended.');
      setIsListening(false);
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.statusBox}>
                <div style={{ 
                    ...styles.indicator, 
                    backgroundColor: isListening ? '#22c55e' : isResponding ? '#3b82f6' : '#9ca3af' 
                }} />
                <span className="text-zinc-700 dark:text-zinc-300">{chatStatus}</span>
            </div>

            <div style={styles.buttonGroup}>
                <button 
                    onClick={startListening} 
                    disabled={isListening || isResponding}
                    style={{ ...styles.button, backgroundColor: '#3b82f6' }}
                >
                    Push to Talk
                </button>
                
                <button 
                    onClick={stopCall}
                    style={{ ...styles.button, backgroundColor: '#ef4444' }}
                >
                    End Call
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        borderRadius: '12px',
        maxWidth: '400px',
        margin: '10px auto'
    },
    statusBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px',
        fontFamily: 'sans-serif',
        fontWeight: '500'
    },
    indicator: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        transition: 'background-color 0.3s ease'
    },
    buttonGroup: {
        display: 'flex',
        gap: '12px'
    },
    button: {
        border: 'none',
        color: '#ffffff',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontFamily: 'sans-serif',
        transition: 'opacity 0.2s',
    }
};

export default VoiceCall;