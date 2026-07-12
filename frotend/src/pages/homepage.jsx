import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useChatStore from '../app/usechat.store';
import useAuthStore from '../app/datastore';
import { useAiStore } from '../app/useAiStore'; 
import { useTextToSpeech } from '../hook/voice';
import VoiceCall from '../VoiceCall';
import ChatBackground from '../componets/chat/ChatBackground';
import ChatSidebar from '../componets/chat/ChatSidebar';
import ChatHeader from '../componets/chat/ChatHeader';
import ChatEmptyState from '../componets/chat/ChatEmptyState';
import ChatMessageList from '../componets/chat/ChatMessageList';
import ChatInputBar from '../componets/chat/ChatInputBar';

export default function ChatDashboard() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================

  // Theme State: Initializes dark mode using a lazy initializer function.
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('scholarly-theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      console.error('Failed to parse initial theme state:', e);
      return false;
    }
  });

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceCallOpen, setVoiceCallOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [codeCopiedIndex, setCodeCopiedIndex] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');

  // ==========================================
  // REFERENCES (DOM elements)
  // ==========================================
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const modelSelectorRef = useRef(null);
  const editInputRef = useRef(null);

  // ==========================================
  // CUSTOM HOOKS & GLOBAL STORE EXTRACTIONS
  // ==========================================
  const { speak, currentPlayingIndex } = useTextToSpeech();
  
  const {
    history, messages, currentSessionId, loading, agentStatus,
    selectedModel, availableModels, setSelectedModel,
    selectedAgent, availableAgents, setSelectedAgent,
    fetchHistoryList, fetchSessionMessages, handleNewChat,
    sendMessage, editMessage, deleteSession, generateAiImage,
  } = useChatStore();

  const { user, logout } = useAuthStore();

  // Vision store selectors for analyzing images
  const understandImageAction = useAiStore((state) => state.understandImageAction);
  const isAnalyzing = useAiStore((state) => state.isAnalyzing);
  const uploadProgress = useAiStore((state) => state.uploadProgress);
  const uploadStatusText = useAiStore((state) => state.uploadStatusText);

  // Image upload count for the chat UI
  const uploadedImageCount = messages.filter((msg) => msg.isImage).length;

  const loadingStatusText = agentStatus && agentStatus !== 'Idle'
    ? agentStatus
    : 'Composing response...';

  // ==========================================
  // SIDE EFFECTS (useEffect)
  // ==========================================

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768 && sidebarOpen) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      if (darkMode) {
        root.classList.add('dark');
        localStorage.setItem('scholarly-theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('scholarly-theme', 'light');
      }
    } catch (error) {
      console.error('Theme synchronization failure:', error);
    }
  }, [darkMode]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 144)}px`;
    }
  }, [inputMessage]);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };
    scrollToBottom();
    const t = setTimeout(scrollToBottom, 150);
    return () => clearTimeout(t);
  }, [messages, loading]);

  useEffect(() => {
    if (editingIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.style.height = 'auto';
      editInputRef.current.style.height = `${editInputRef.current.scrollHeight}px`;
      const length = editInputRef.current.value.length;
      editInputRef.current.setSelectionRange(length, length);
    }
  }, [editingIndex]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modelSelectorRef.current && !modelSelectorRef.current.contains(e.target)) {
        setShowModelSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { fetchHistoryList(); }, []);
  useEffect(() => {
    useChatStore.getState().fetchAvailableAgents();
  }, []);
  
  useEffect(() => {
    if (currentSessionId) fetchSessionMessages(currentSessionId);
  }, [currentSessionId]);

  // ==========================================
  // EVENT HANDLERS
  // ==========================================

  // 🟩 UPDATED: Grabs the typed question, injects an image preview bubble, and appends the AI answer to your screen
  const handleImageUpload = async (file) => {
    try {
      const currentPrompt = inputMessage.trim();
      const localImageUrl = URL.createObjectURL(file);

      // 1. Instantly display your text prompt and the photo preview together on the screen
      useChatStore.setState({
        messages: [
          ...messages,
          ...(currentPrompt ? [{ role: 'user', content: currentPrompt }] : []),
          { role: 'user', content: localImageUrl, isImage: true }
        ]
      });

      // Clear the text bar right away for a fast UI response
      setInputMessage('');

      // 2. Fire the underlying vision pipeline request
      const result = await understandImageAction(file, currentPrompt); 
      console.log('Vision Analysis Successful:', result.description);

      // 3. Append the final text response generated by the AI model
      useChatStore.setState({
        messages: [
          ...useChatStore.getState().messages,
          { 
            role: 'assistant', 
            content: result.description,
            model: 'llama-4-vision'
          }
        ]
      });

    } catch (err) {
      console.error('Image routing system processing error:', err);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const cleanMessage = inputMessage.trim();
    
    if (cleanMessage.toLowerCase().startsWith('/image ')) {
      useChatStore.setState({
        messages: [...messages, { role: 'user', content: cleanMessage }],
      });
      generateAiImage(cleanMessage.substring(7));
    } else {
      sendMessage(cleanMessage);
    }
    
    setInputMessage('');
  };

  const handleCopyText = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Clipboard access refused:', err);
    }
  };

  const handleCopyCodeBlock = async (code, blockId) => {
    try {
      await navigator.clipboard.writeText(code);
      setCodeCopiedIndex(blockId);
      setTimeout(() => setCodeCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Code copy failed:', err);
    }
  };

  const handleSaveEdit = (index) => {
    if (!editingText.trim() || editingText.trim() === messages[index].content) {
      setEditingIndex(null);
      return;
    }
    
    if (editMessage) {
      editMessage(index, editingText.trim());
    } else {
      sendMessage(editingText.trim());
    }
    
    setEditingIndex(null);
  };

  const handleDownloadImage = (base64Url) => {
    const link = document.createElement('a');
    link.href = base64Url;
    link.download = `ai-asset-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectModel = (modelId) => {
    setSelectedModel(modelId);
    handleNewChat();
    setShowModelSelector(false);
  };

  // ==========================================
  // COMPONENT RENDERING
  // ==========================================

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans antialiased transition-colors duration-500 relative ${
      darkMode ? 'bg-[#09090b] text-zinc-100' : 'bg-[#f4f4f5] text-zinc-900'
    }`}>
      
      <ChatBackground darkMode={darkMode} />

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            onClick={() => setSidebarOpen(false)}
            className={`fixed inset-0 z-30 md:hidden backdrop-blur-xs ${
              darkMode ? 'bg-black/60' : 'bg-zinc-950/20'
            }`}
          />
        )}
      </AnimatePresence>

      <ChatSidebar
        darkMode={darkMode}
        sidebarOpen={sidebarOpen}
        windowWidth={windowWidth}
        history={history}
        currentSessionId={currentSessionId}
        user={user}
        onClose={() => setSidebarOpen(false)}
        onNewChat={() => { handleNewChat(); setSidebarOpen(false); }}
        onDeleteSession={deleteSession}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        <ChatHeader
          darkMode={darkMode}
          loading={loading}
          loadingStatusText={loadingStatusText}
          isAnalyzing={isAnalyzing}
          uploadProgress={uploadProgress}
          uploadStatusText={uploadStatusText}
          imageCount={uploadedImageCount}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleTheme={() => setDarkMode(!darkMode)}
          onToggleVoiceCall={() => setVoiceCallOpen((open) => !open)}
          voiceCallOpen={voiceCallOpen}
        />

        {voiceCallOpen && (
          <div className="px-4 sm:px-6 lg:px-8 xl:px-16 pb-4">
            <VoiceCall darkMode={darkMode} />
          </div>
        )}

        <main className="flex-1 min-h-0 overflow-y-auto w-full px-4 sm:px-6 lg:px-8 xl:px-16 flex justify-center scroll-smooth">
          <div className="w-full max-w-4xl xl:max-w-5xl flex flex-col">
            <AnimatePresence mode="wait">
              {messages.length === 0 ? (
                <ChatEmptyState
                  darkMode={darkMode}
                  user={user}
                  loading={loading}
                  loadingStatusText={loadingStatusText}
                  onSelectPrompt={setInputMessage}
                />
              ) : (
                <ChatMessageList
                  messages={messages}
                  darkMode={darkMode}
                  user={user}
                  loading={loading}
                  loadingStatusText={loadingStatusText}
                  editingIndex={editingIndex}
                  editingText={editingText}
                  editInputRef={editInputRef}
                  copiedIndex={copiedIndex}
                  codeCopiedIndex={codeCopiedIndex}
                  currentPlayingIndex={currentPlayingIndex}
                  messagesEndRef={messagesEndRef}
                  onEditTextChange={setEditingText}
                  onCancelEdit={() => setEditingIndex(null)}
                  onSaveEdit={handleSaveEdit}
                  onCopyText={handleCopyText}
                  onCopyCodeBlock={handleCopyCodeBlock}
                  onSpeak={speak}
                  onStartEdit={(idx, text) => { setEditingIndex(idx); setEditingText(text); }}
                  onDownloadImage={handleDownloadImage}
                />
              )}
            </AnimatePresence>
          </div>
        </main>

        <ChatInputBar
          darkMode={darkMode}
          loading={loading}
          isAnalyzing={isAnalyzing}
          onImageUpload={handleImageUpload}
          inputMessage={inputMessage}
          textareaRef={textareaRef}
          modelSelectorRef={modelSelectorRef}
          showModelSelector={showModelSelector}
          availableModels={availableModels}
          selectedModel={selectedModel}
          availableAgents={availableAgents}
          selectedAgent={selectedAgent}
          onSelectAgent={setSelectedAgent}
          onInputChange={(e) => setInputMessage(e.target.value)}
          
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleFormSubmit(e);
            }
          }}
          onSubmit={handleFormSubmit}
          onToggleModelSelector={() => setShowModelSelector(!showModelSelector)}
          onSelectModel={handleSelectModel}
          onVoiceTranscribe={(text) => text && setInputMessage(text)}
        />
      </div>
    </div>
  );
}