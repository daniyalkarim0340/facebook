import { useState } from 'react';
import { Mic, StopCircle, Send, X, Play, Pause } from 'lucide-react';
import { useVoiceRecorder } from '../app/useVoiceRecorder';
import { transcribeAudio } from '../api/ai';

export default function VoiceRecorder({ onTranscribe, disabled = false }) {
  const {
    isRecording,
    audioURL,
    startRecording,
    stopRecording,
    getAudioBlob,
    resetRecording,
    setIsLoading,
  } = useVoiceRecorder();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartRecording = () => {
    setError(null);
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleSendAudio = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      setIsLoading(true);

      const audioBlob = getAudioBlob();
      if (!audioBlob || audioBlob.size === 0) {
        setError('No audio recorded');
        return;
      }

      const result = await transcribeAudio(audioBlob);
      
      if (result.success && result.text) {
        onTranscribe(result.text);
        resetRecording();
      } else {
        setError(result.message || 'Failed to transcribe audio');
      }
    } catch (err) {
      setError(err.message || 'Error processing audio');
      console.error('Transcribe error:', err);
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isRecording) {
      stopRecording();
    }
    resetRecording();
    setError(null);
  };

  return (
    <div className="voice-recorder">
      {!audioURL && !isRecording && (
        <button
          onClick={handleStartRecording}
          disabled={disabled || isProcessing}
          className="voice-button"
          title="Click to record voice message"
          aria-label="Start voice recording"
        >
          <Mic size={20} />
        </button>
      )}

      {isRecording && (
        <div className="recording-state">
          <button
            onClick={handleStopRecording}
            className="stop-recording-button"
            title="Click to stop recording"
            aria-label="Stop recording"
          >
            <StopCircle size={20} className="recording-pulse" />
            <span>Recording...</span>
          </button>
        </div>
      )}

      {audioURL && !isRecording && (
        <div className="audio-preview">
          <div className="audio-player">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="play-button"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <audio 
              src={audioURL} 
              className="audio-element" 
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
          <div className="audio-actions">
            <button
              onClick={handleSendAudio}
              disabled={isProcessing}
              className="send-button"
              title="Send audio for transcription"
              aria-label="Send audio"
            >
              <Send size={18} />
              {isProcessing ? 'Processing...' : 'Transcribe'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isProcessing}
              className="cancel-button"
              title="Delete and record again"
              aria-label="Cancel recording"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <style>{`
        .voice-recorder {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .voice-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 16px;
        }

        .voice-button:hover:not(:disabled) {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .voice-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .recording-state {
          display: flex;
          align-items: center;
          gap: 8px;
          animation: fadeIn 0.3s ease;
        }

        .stop-recording-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .stop-recording-button:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
        }

        .recording-pulse {
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .audio-preview {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 20px;
          animation: slideIn 0.3s ease;
        }

        .audio-player {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .play-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .play-button:hover {
          background: rgba(102, 126, 234, 0.3);
          transform: scale(1.1);
        }

        .audio-element {
          display: none;
        }

        .audio-actions {
          display: flex;
          gap: 6px;
        }

        .send-button,
        .cancel-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .send-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .send-button:hover:not(:disabled) {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .cancel-button {
          background: rgba(100, 100, 100, 0.2);
          color: #666;
        }

        .cancel-button:hover:not(:disabled) {
          background: rgba(100, 100, 100, 0.3);
        }

        .send-button:disabled,
        .cancel-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          padding: 8px 12px;
          background: rgba(220, 38, 38, 0.1);
          color: #dc2626;
          border-radius: 8px;
          font-size: 14px;
          animation: slideIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
