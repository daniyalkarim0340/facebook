import { useState, useRef } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, ArrowUp, ChevronDown, Loader2, X } from 'lucide-react'; 
import VoiceRecorder from '../../hook/voice';
import { fadeUp } from './chatAnimations';

export default function ChatInputBar({
  darkMode,
  loading,
  isAnalyzing,           
  onImageUpload,         
  inputMessage,
  textareaRef,
  modelSelectorRef,
  showModelSelector,
  availableModels,
  selectedModel,
  availableAgents = [],
  selectedAgent,
  onInputChange,
  onKeyDown,
  onSubmit,
  onToggleModelSelector,
  onSelectModel,
  onSelectAgent,
  onVoiceTranscribe,
}) {
  const selectedName = availableModels.find((m) => m.id === selectedModel)?.name.split('(')[0].trim() || 'Llama 3.3';
  
  const fileInputRef = useRef(null);

  // Local staging states
  const [stagedFile, setStagedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Intercept file picking
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]; 
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      setStagedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  // Cleanup staged asset routine
  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl); 
    setStagedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = ''; 
  };

 // Intercept form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (loading || isAnalyzing) return;

    if (stagedFile) {
      // 🟩 Pass BOTH the file and the current text prompt to the upload action
      onImageUpload?.(stagedFile, inputMessage); 
      handleRemoveImage();
      
      // Optionally clear the input message text if your parent handler doesn't do it
      if (onInputChange) {
        const dummyEvent = { target: { value: '' } };
        onInputChange(dummyEvent);
      }
    } else {
      onSubmit?.(e);
    }
  };

  return (
    <motion.div
      variants={fadeUp(0.2)}
      initial="hidden"
      animate="visible"
      className={`flex-shrink-0 p-4 sm:p-6 md:px-8 md:pb-6 md:pt-2 z-20 border-t ${
        darkMode
          ? 'bg-[#09090b]/95 border-zinc-800/80 backdrop-blur-md'
          : 'bg-[#f4f4f5]/95 border-zinc-200/80 backdrop-blur-md'
      }`}
    >
      <form onSubmit={handleFormSubmit} className="max-w-4xl xl:max-w-5xl mx-auto space-y-3">
        <motion.div
          animate={loading || isAnalyzing ? { borderColor: darkMode ? 'rgba(245,158,11,0.3)' : 'rgba(252,211,77,0.6)' } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`rounded-2xl border shadow-lg p-3 flex flex-col gap-2 relative transition-all duration-300 ${
            loading || isAnalyzing ? 'opacity-90' : ''
          } ${
            darkMode
              ? `bg-[#121215] border-zinc-800 shadow-black/30 ${!loading && 'focus-within:border-zinc-700'}`
              : `bg-white border-zinc-200 shadow-zinc-200/50 ${!loading && 'focus-within:border-zinc-400 focus-within:shadow-md'}`
          }`}
        >
          {/* HIDDEN FILE INPUT ELEMENT */}
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*" 
            className="hidden" 
            disabled={loading || isAnalyzing}
          />

          {/* VISUAL STAGING AREA PREVIEW DRAWER */}
          <AnimatePresence>
            {previewUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 4 }}
                className="relative self-start ml-1.5 mt-1 group"
              >
                <div className={`relative h-20 w-20 rounded-xl overflow-hidden border shadow-inner ${
                  darkMode ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-zinc-50'
                }`}>
                  <img src={previewUrl} alt="Staged pipeline attachment" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black text-white rounded-full transition-colors backdrop-blur-xs"
                    title="Remove attachment"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            placeholder="Submit pipeline request context or trigger graphic engine with /image..."
            disabled={loading || isAnalyzing}
            rows="1"
            className={`w-full bg-transparent text-sm md:text-base resize-none focus:outline-none max-h-36 pt-1 px-1.5 leading-relaxed overflow-y-auto ${
              darkMode ? 'text-white placeholder-zinc-500' : 'text-zinc-900 placeholder-zinc-400'
            }`}
          />

          <div className={`flex items-center justify-between border-t pt-2.5 mt-1 ${
            darkMode ? 'border-zinc-800/80' : 'border-zinc-100'
          }`}>
            <div className="flex items-center gap-2">
              
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => fileInputRef.current?.click()} 
                disabled={loading || isAnalyzing}
                className={`p-1.5 rounded-lg transition-colors relative ${
                  darkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-400 hover:text-zinc-600'
                } ${isAnalyzing ? 'animate-pulse text-amber-500' : ''}`}
              >
                {isAnalyzing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Paperclip className="w-4 h-4" />
                )}
              </motion.button>

              <VoiceRecorder onTranscribe={onVoiceTranscribe} disabled={loading || isAnalyzing} />

              {availableAgents.length > 0 && (
                <select
                  value={selectedAgent || ''}
                  onChange={(e) => onSelectAgent?.(e.target.value || null)}
                  disabled={loading || isAnalyzing}
                  className={`px-2 py-1 rounded-lg border text-[10px] font-semibold max-w-[110px] truncate ${
                    darkMode
                      ? 'border-zinc-800 bg-zinc-900 text-zinc-400'
                      : 'border-zinc-200 bg-white text-zinc-600'
                  }`}
                  title="Force a specialist agent (Auto = Router decides)"
                >
                  <option value="">🔀 Auto Agent</option>
                  {availableAgents.map((a) => (
                    <option key={a.id} value={a.id}>{a.icon} {a.name}</option>
                  ))}
                </select>
              )}

              <div className="relative ml-1" ref={modelSelectorRef}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  type="button"
                  onClick={onToggleModelSelector}
                  disabled={loading || isAnalyzing}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                    darkMode
                      ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                      : 'border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
                  }`}
                >
                  <span>{selectedName}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </motion.button>

                <AnimatePresence>
                  {showModelSelector && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ delay: 0.05 }}
                      className={`absolute bottom-full left-0 mb-2 w-56 border rounded-xl shadow-xl z-50 p-1.5 space-y-0.5 ${
                        darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
                      }`}
                    >
                      {availableModels.map((model, i) => (
                        <motion.button
                          key={model.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.08 + i * 0.05 }}
                          type="button"
                          onClick={() => onSelectModel(model.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            selectedModel === model.id
                              ? (darkMode ? 'bg-zinc-800 text-amber-400' : 'bg-zinc-100 text-zinc-950 font-semibold')
                              : (darkMode ? 'text-zinc-400 hover:bg-zinc-800/50' : 'text-zinc-600 hover:bg-zinc-50')
                          }`}
                        >
                          <div className="truncate">{model.name}</div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.button
              whileHover={(inputMessage.trim() || stagedFile) && !loading && !isAnalyzing ? { scale: 1.08 } : {}}
              whileTap={(inputMessage.trim() || stagedFile) && !loading && !isAnalyzing ? { scale: 0.92 } : {}}
              type="submit"
              disabled={(!inputMessage.trim() && !stagedFile) || loading || isAnalyzing}
              className={`p-2 rounded-xl transition-all shadow-xs min-w-[36px] min-h-[36px] flex items-center justify-center ${
                loading || isAnalyzing
                  ? (darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600')
                  : (inputMessage.trim() || stagedFile)
                  ? (darkMode ? 'bg-zinc-100 text-zinc-950 hover:opacity-90' : 'bg-zinc-950 text-white hover:opacity-90')
                  : (darkMode ? 'bg-zinc-800/80 text-zinc-600 cursor-not-allowed' : 'bg-zinc-100 text-zinc-300 cursor-not-allowed')
              }`}
            >
              {loading || isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" style={{ animationDelay: '0.1s' }} />
              ) : (
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              )}
            </motion.button>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className={`text-center text-[10px] tracking-wider font-medium select-none ${
            darkMode ? 'text-zinc-500' : 'text-zinc-400'
          }`}
        >
          Scholarly AI can output architectural variations. Verify critical framework variables.
        </motion.p>
      </form>
    </motion.div>
  );
}