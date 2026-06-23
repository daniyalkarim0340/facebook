import  { useState, useEffect, useRef } from 'react';

const VoiceCall = ({ darkMode }) => {
    const [isListening, setIsListening] = useState(false);
    const [isResponding, setIsResponding] = useState(false);
    const [chatStatus, setChatStatus] = useState("Click to start call");
    
    const recognitionRef = useRef(null);
    const sentenceBufferRef = useRef("");

    useEffect(() => {
        // Initialize browser speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false; 
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                console.log("🎤 Microphone is live. Speak now...");
                setIsListening(true);
                setChatStatus("Listening to you...");
            };

            recognition.onend = () => {
                console.log("🎤 Microphone turned off.");
                setIsListening(false);
            };

            recognition.onerror = (event) => {
                console.error("❌ Speech recognition error:", event.error);
                setChatStatus(`Error: ${event.error}`);
                setIsListening(false);
            };

            recognition.onresult = async (event) => {
                const transcript = event.results[0][0].transcript;
                console.log(`🗣️ User said: "${transcript}"`);
                if (transcript.trim()) {
                    setChatStatus("Thinking...");
                    await sendToBackend(transcript);
                }
            };

            recognitionRef.current = recognition;
        } else {
            console.error("❌ Web Speech API is not supported in this browser.");
            setChatStatus("Speech recognition not supported.");
        }

        // Pre-load voices to prevent asynchronous lag in Chrome/Safari
        if ('speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
        }
    }, []);

    const sendToBackend = async (text) => {
        setIsResponding(true);
        console.log("🚀 Sending text to backend voice route...");
        
        try {
            // Updated to target your nested AI router path
            const response = await fetch('http://localhost:3000/api/ai/talk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcribedText: text }),
            });

            if (!response.ok) {
                throw new Error(`Server returned status code ${response.status}`);
            }

            if (!response.body) {
                throw new Error("Response body is not readable/streamable.");
            }

            console.log("📡 Connected to backend stream. Receiving chunks...");
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            sentenceBufferRef.current = "";

            setChatStatus("AI is speaking...");

            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    console.log("🏁 Streaming complete.");
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                console.log(`🧩 Received chunk: [${chunk}]`);
                handleStreamingTTS(chunk);
            }

        } catch (error) {
            console.error("❌ Frontend connection failed:", error);
            setChatStatus("Connection failed.");
        } finally {
            setIsResponding(false);
            setChatStatus("Call active. Speak again.");
            startListening(); // Automatically listen for your next sentence
        }
    };

    const handleStreamingTTS = (textChunk) => {
        sentenceBufferRef.current += textChunk;

        // Trigger speech when hitting a natural sentence boundary (. ? !)
        const sentenceEndings = /[.?!]/;
        if (sentenceEndings.test(textChunk)) {
            const sentence = sentenceBufferRef.current.trim();
            if (sentence) {
                speakSentence(sentence);
            }
            sentenceBufferRef.current = ""; // Clear buffer for next line
        }
    };

    const speakSentence = (text) => {
        if ('speechSynthesis' in window) {
            console.log(`🔊 Speaking sentence: "${text}"`);
            const utterance = new SpeechSynthesisUtterance(text);
            
            const voices = window.speechSynthesis.getVoices();
            // Look for a high quality built-in voice
            const preferredVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Natural"));
            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.rate = 1.0; 
            utterance.pitch = 1.0; 

            utterance.onerror = (e) => console.error("❌ SpeechSynthesisUtterance error:", e);
            utterance.onstart = () => console.log("▶️ Audio playback started");
            utterance.onend = () => console.log("⏸️ Audio playback finished");

            window.speechSynthesis.speak(utterance);
        } else {
            console.error("❌ Browser does not support Text-to-Speech execution.");
        }
    };

    const startListening = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel(); // Stop AI speaking if user interrupts
        }
        if (recognitionRef.current && !isListening && !isResponding) {
            recognitionRef.current.start();
        }
    };

    const stopCall = () => {
        console.log("🔌 Manual call termination.");
        if (recognitionRef.current) recognitionRef.current.stop();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        setChatStatus("Call ended.");
    };

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