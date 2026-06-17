import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  MessageSquare, 
  Plus, 
  Menu, 
  X, 
  Trash2,
  LogOut,
  Settings,
  ChevronDown,
  Paperclip,
  ArrowUp,
  PenTool,
  Lightbulb,
  Copy,
  Check,
  Edit2,
  Volume2,   
  VolumeX,
  Download,
  Image as ImageIcon,
  Sun,
  Moon
} from 'lucide-react';
import useChatStore from '../app/usechat.store';
import useAuthStore from '../app/datastore';
import VoiceRecorder from '../hook/voice'; 
import { useTextToSpeech } from '../hook/voice';

export default function ChatDashboard() {
  // Theme and UI Management
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('scholarly-theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      console.error('Failed to parse initial theme state safely:', e);
      return false;
    }
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [codeCopiedIndex, setCodeCopiedIndex] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  // Message Editing States
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');

  // DOM References
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const modelSelectorRef = useRef(null);
  const editInputRef = useRef(null);

  // External hooks and stores
  const { speak, currentPlayingIndex } = useTextToSpeech();
  const { 
    history, 
    messages, 
    currentSessionId, 
    loading,
    selectedModel,
    availableModels,
    setSelectedModel,
    fetchHistoryList,
    fetchSessionMessages,
    handleNewChat,
    sendMessage,
    editMessage,
    deleteSession,
    generateAiImage 
  } = useChatStore();

  const { user, logout } = useAuthStore();

  // Optimized viewport adjustment tracking
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Sync structural theme classes to document element wrapper
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
      console.error('Theme synchronization visibility failure:', error);
    }
  }, [darkMode]);

  // Automatic positioning and layout scrolling
  const scrollToBottom = () => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.warn('Scroll execution failed target alignment:', err);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle focusing textarea on message edit initiation
  useEffect(() => {
    if (editingIndex !== null && editInputRef.current) {
      try {
        editInputRef.current.focus();
        editInputRef.current.style.height = 'auto';
        editInputRef.current.style.height = `${editInputRef.current.scrollHeight}px`;
        const length = editInputRef.current.value.length;
        editInputRef.current.setSelectionRange(length, length);
      } catch (err) {
        console.error('Focus matrix instantiation failure:', err);
      }
    }
  }, [editingIndex]);

  // Dropdown dismiss system
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modelSelectorRef.current && !modelSelectorRef.current.contains(e.target)) {
        setShowModelSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync internal datastores with remote collections
  useEffect(() => {
    try {
      fetchHistoryList();
    } catch (err) {
      console.error('History array data tracking resolution failure:', err);
    }
  }, []);

  useEffect(() => {
    if (currentSessionId) {
      try {
        fetchSessionMessages(currentSessionId);
      } catch (err) {
        console.error('Session metrics synchronization handling error:', err);
      }
    }
  }, [currentSessionId]);

  // Pipeline Routing Form Submissions
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    try {
      const cleanMessage = inputMessage.trim();
      if (cleanMessage.toLowerCase().startsWith('/image ')) {
        const imgPrompt = cleanMessage.substring(7);
        useChatStore.setState({
          messages: [...messages, { role: 'user', content: cleanMessage }]
        });
        generateAiImage(imgPrompt);
      } else {
        sendMessage(cleanMessage);
      }
      setInputMessage('');
    } catch (err) {
      console.error('Message operational router interception collapse:', err);
    }
  };

  const handleVoiceTranscribe = (transcribedText) => {
    try {
      if (transcribedText) setInputMessage(transcribedText);
    } catch (err) {
      console.error('Voice buffer ingestion pipeline failure:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  const handleCopyText = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('System device clipboard access refused:', err);
    }
  };

  const handleCopyCodeBlock = async (code, blockId) => {
    try {
      await navigator.clipboard.writeText(code);
      setCodeCopiedIndex(blockId);
      setTimeout(() => setCodeCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Code allocation structural parsing block failures:', err);
    }
  };

  const handleSaveEdit = (index) => {
    try {
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
    } catch (err) {
      console.error('Mutation array tracking verification breakdown:', err);
    }
  };

  const handleDownloadImage = (base64Url) => {
    try {
      const link = document.createElement('a');
      link.href = base64Url;
      link.download = `ai-generated-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Data image element generation download exception:', err);
    }
  };

  // Hardware-Optimized Animation Configurations (Uses transform/opacity only to prevent rendering layout shifts)
  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 400, damping: 38 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 400, damping: 38 } }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 350, damping: 28 } }
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans antialiased transition-colors duration-200 ${
      darkMode ? 'bg-[#0b0a0f] text-[#f3f1ea]' : 'bg-[#f9f8f4] text-[#1a1a1a]'
    }`}>
      
      {/* PERFORMANCE BUFFERED BACKGROUND ANIMATION ORBS (Will drop out dynamically via CSS layer optimization on old hardware) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-[#ebdcd3] to-transparent blur-[120px] animate-[pulse_8s_infinite_alternate]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-bl from-[#8a4b2d]/20 to-transparent blur-[140px] animate-[pulse_12s_infinite_alternate]" />
      </div>

      {/* SIDEBAR OVERLAY */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 dark:bg-black/50 z-30 md:hidden backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR CONTENT CONTAINER */}
      <motion.div 
        initial={false}
        animate={sidebarOpen || windowWidth >= 768 ? 'open' : 'closed'}
        variants={sidebarVariants}
        className={`fixed md:relative inset-y-0 left-0 z-40 w-68 border-r flex flex-col shadow-2xl md:shadow-none transition-colors duration-200 ${
          darkMode ? 'bg-[#121118] border-[#24222f]' : 'bg-[#f3f1ea] border-[#e4e1d3]'
        }`}
      >
        <div className={`h-14 flex items-center justify-between px-4 border-b ${darkMode ? 'border-[#24222f]' : 'border-[#e4e1d3]'}`}>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">History Vault</span>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(false)} 
            className={`p-1.5 rounded-lg md:hidden transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-[#e4e1d3] text-gray-600'}`}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="p-3">
          <motion.button 
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              handleNewChat();
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all shadow-xs ${
              darkMode 
                ? 'border-[#24222f] bg-[#1a1923] text-gray-200 hover:bg-[#21202c]' 
                : 'border-[#d3cebe] bg-[#f9f8f4] hover:bg-white text-gray-700'
            }`}
          >
            <Plus className="w-4 h-4 text-gray-400" />
            New deployment
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {history.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-gray-400 dark:text-gray-500 italic">
              No structural traces found
            </div>
          ) : (
            <div className="space-y-0.5">
              {history.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() => {
                    useChatStore.setState({ currentSessionId: chat._id });
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl group flex items-center justify-between text-sm truncate transition-colors ${
                    currentSessionId === chat._id 
                      ? (darkMode ? 'bg-[#21202c] text-white font-medium' : 'bg-[#e4e1d3] text-black font-medium') 
                      : (darkMode ? 'text-gray-400 hover:bg-[#1a1923]' : 'text-gray-600 hover:bg-[#e4e1d3]/60')
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MessageSquare className="w-4 h-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                    <span className="truncate text-xs">{chat.title || 'Untitled Stack'}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, color: '#dc2626' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(chat._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 flex-shrink-0 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={`border-t p-3 space-y-1 transition-colors duration-200 ${
          darkMode ? 'border-[#24222f] bg-[#0d0c12]' : 'border-[#e4e1d3] bg-[#edeae1]'
        }`}>
          <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors ${darkMode ? 'text-gray-400 hover:bg-[#1a1923]' : 'text-gray-600 hover:bg-[#e4e1d3]'}`}>
            <Settings className="w-3.5 h-3.5" />
            <span>Settings Configuration</span>
          </button>
          <button onClick={logout} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors ${darkMode ? 'text-gray-400 hover:bg-[#1a1923]' : 'text-gray-600 hover:bg-[#e4e1d3]'}`}>
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Authentication</span>
          </button>
          
          <div className={`mt-2 px-3 py-2.5 rounded-xl border transition-colors ${
            darkMode ? 'bg-[#121118] border-[#24222f]' : 'bg-[#f9f8f4]/80 border-[#e4e1d3]'
          }`}>
            <p className={`font-semibold text-xs truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user?.name || 'Daniyal'}</p>
            <p className="text-gray-400 dark:text-gray-500 text-[10px] truncate">{user?.email || 'daniyal@example.com'}</p>
          </div>
        </div>
      </motion.div>

      {/* CORE VIEWPORT CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        <header className="h-14 flex items-center px-4 md:px-6 flex-shrink-0 justify-between z-30">
          <div className="flex items-center gap-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 border rounded-xl transition-colors shadow-sm md:hidden ${
                darkMode ? 'bg-[#121118] border-[#24222f] hover:bg-[#1a1923]' : 'bg-white border-[#e4e1d3] hover:bg-[#f3f1ea]'
              }`}
            >
              <Menu className="w-4 h-4" />
            </motion.button>
            
            {/* INLINE CORE LIGHT / DARK CONTROLLER */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 border rounded-xl transition-colors shadow-xs flex items-center justify-center ${
                darkMode ? 'bg-[#121118] border-[#24222f] text-yellow-400 hover:bg-[#1a1923]' : 'bg-white border-[#e4e1d3] text-indigo-600 hover:bg-[#f3f1ea]'
              }`}
              title="Toggle systemic environmental theme profile"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
          </div>

          <div className="text-xs text-gray-400 dark:text-gray-500 font-medium italic">
            {loading && <span className="inline-block animate-pulse">Processing context query arrays...</span>}
          </div>
        </header>

        {/* MAXIMUM EXPANDED CONTENT LAYOUT WRAPPER (Fluid scale alignment across massive and small monitors) */}
        <main className="flex-1 overflow-y-auto w-full pb-36 px-4 sm:px-6 lg:px-12 flex justify-center">
          <div className="w-full max-w-5xl xl:max-w-6xl flex flex-col">
            <AnimatePresence mode="wait">
              {messages.length === 0 ? (
                
                <motion.div 
                  key="empty-state"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={containerVariants}
                  className="flex-1 flex flex-col items-center justify-center py-12"
                >
                  <div className="w-full text-center space-y-6">
                    <motion.div variants={itemVariants} className="flex justify-center">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-colors ${
                        darkMode ? 'bg-[#21202c]' : 'bg-[#ebdcd3]'
                      }`}>
                        <Lightbulb className={`w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-[#8a4b2d]'}`} />
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                      <h1 className={`text-3xl md:text-5xl font-bold font-serif tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Welcome Back, {user?.name?.split(' ')[0] || 'Daniyal'}
                      </h1>
                      <p className="text-gray-400 dark:text-gray-400 font-light text-sm md:text-base">
                        Issue a pipeline vector command or map asset parameters with <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200/80 text-[#8a4b2d]'}`}>/image [prompt]</code>
                      </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 max-w-3xl mx-auto w-full">
                      <motion.button
                        whileHover={{ scale: 1.015, y: -2 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => setInputMessage('/image A hyper-detailed structural circuit trace layout blueprint, glowing neon copper lines')}
                        className={`p-5 rounded-2xl border text-left flex flex-col space-y-2 group transition-all ${
                          darkMode ? 'border-[#24222f] bg-[#121118] hover:bg-[#1a1923]' : 'border-[#e4e1d3] bg-[#fdfdfb] hover:shadow-md'
                        }`}
                      >
                        <ImageIcon className="w-5 h-5 text-[#8a4b2d] dark:text-yellow-500 transition-transform group-hover:scale-110" />
                        <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Synthesize Visual Blueprints</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs leading-relaxed">Leverage core generative array elements to formulate visual matrix assets.</p>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.015, y: -2 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => setInputMessage('Draft an analytical breakdown of optimization paradigms for state managers in low-power rendering viewports.')}
                        className={`p-5 rounded-2xl border text-left flex flex-col space-y-2 group transition-all ${
                          darkMode ? 'border-[#24222f] bg-[#121118] hover:bg-[#1a1923]' : 'border-[#e4e1d3] bg-[#fdfdfb] hover:shadow-md'
                        }`}
                      >
                        <PenTool className="w-5 h-5 text-[#8a4b2d] dark:text-yellow-500" />
                        <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Deconstruct Code Logic</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs leading-relaxed">Map structural algorithmic constraints and draft baseline logic profiles.</p>
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>

              ) : (

                <motion.div key="message-stream" className="space-y-6 py-6 w-full" layout>
                  {messages.map((msg, idx) => {
                    const isUser = msg.role === 'user';
                    const isEditing = editingIndex === idx;

                    return (
                      <motion.div
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        layout
                        key={idx}
                        className={`flex gap-4 w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isUser && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gray-900 dark:bg-[#21202c] border border-gray-800 dark:border-[#323042] text-white flex items-center justify-center text-xs font-bold shadow-md mt-1">
                            AI
                          </div>
                        )}

                        <div className="flex flex-col max-w-[88%] group/msg min-w-0">
                          {isEditing ? (
                            <div className={`w-full border rounded-2xl p-4 shadow-inner flex flex-col gap-3 ${
                              darkMode ? 'bg-[#1a1923] border-[#323042]' : 'bg-[#f3f1ea] border-[#decbc0]'
                            }`}>
                              <textarea
                                ref={editInputRef}
                                value={editingText}
                                onChange={(e) => {
                                  setEditingText(e.target.value);
                                  e.target.style.height = 'auto';
                                  e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                                className={`w-full bg-transparent text-sm md:text-base resize-none focus:outline-none overflow-hidden leading-relaxed ${
                                  darkMode ? 'text-white' : 'text-gray-900'
                                }`}
                                rows="1"
                              />
                              <div className="flex justify-end gap-2 text-xs font-medium">
                                <button type="button" onClick={() => setEditingIndex(null)} className="px-4 py-1.5 rounded-full text-gray-400 hover:text-white transition-colors">Cancel</button>
                                <button type="button" onClick={() => handleSaveEdit(idx)} className="px-4 py-1.5 bg-[#8a4b2d] dark:bg-yellow-600 text-white rounded-full hover:opacity-90 transition-opacity">Update Node</button>
                              </div>
                            </div>
                          ) : (
                            <div className={`rounded-2xl px-5 py-3.5 text-sm md:text-base leading-relaxed transition-all w-full ${
                              isUser 
                                ? (darkMode ? 'bg-[#21202c] text-white border border-[#323042] rounded-tr-none' : 'bg-[#ebdcd3]/60 text-gray-900 border border-[#decbc0]/30 rounded-tr-none') 
                                : 'bg-transparent text-gray-800 dark:text-gray-100'
                            }`}>
                              {isUser ? (
                                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                              ) : (
                                <div className={`prose max-w-none text-gray-800 dark:text-gray-100 space-y-3 prose-pre:p-0 ${darkMode ? 'prose-invert' : ''}`}>
                                  <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                      img({ src, alt }) {
                                        return (
                                          <div className={`relative group/imgBlock my-4 max-w-xl overflow-hidden rounded-xl border shadow-md ${
                                            darkMode ? 'border-[#24222f] bg-[#121118]' : 'border-[#e4e1d3] bg-white'
                                          }`}>
                                            <img src={src} alt={alt || 'AI asset layout'} className="w-full h-auto object-cover max-h-[500px]" loading="lazy" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/imgBlock:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                              <button
                                                type="button"
                                                onClick={() => handleDownloadImage(src)}
                                                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 font-medium text-xs rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                                              >
                                                <Download className="w-3.5 h-3.5" />
                                                Download High-Res
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      },
                                      code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const language = match ? match[1] : '';
                                        const codeValue = String(children).replace(/\n$/, '');
                                        const blockId = `${idx}-${node.position?.start.offset || codeValue.substring(0, 10)}`;

                                        return !inline ? (
                                          <div className="my-4 overflow-hidden rounded-xl border border-gray-700 dark:border-gray-800 bg-[#1e1e1e] shadow-lg w-full">
                                            <div className="flex items-center justify-between bg-[#2d2d2d] px-4 py-2 text-xs text-gray-400 font-mono select-none border-b border-gray-800">
                                              <span>{language || 'system-source'}</span>
                                              <button
                                                type="button"
                                                onClick={() => handleCopyCodeBlock(codeValue, blockId)}
                                                className="hover:text-white transition-colors flex items-center gap-1.5 font-sans"
                                              >
                                                {codeCopiedIndex === blockId ? (
                                                  <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400 font-medium">Copied Structure!</span></>
                                                ) : (
                                                  <><Copy className="w-3 h-3" /><span>Copy String</span></>
                                                )}
                                              </button>
                                            </div>
                                            <SyntaxHighlighter
                                              style={vscDarkPlus}
                                              language={language || 'text'}
                                              PreTag="div"
                                              customStyle={{ margin: 0, padding: '1.25rem', background: 'transparent', fontSize: '0.875rem', overflowX: 'auto',   lineHeight: '1.6' }}
                                              {...props}
                                            >
                                              {codeValue}
                                            </SyntaxHighlighter>
                                          </div>
                                        ) : (
                                          <code className={`px-1.5 py-0.5 rounded font-mono text-xs md:text-sm ${
                                            darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200/70 text-[#8a4b2d]'
                                          }`} {...props}>
                                            {children}
                                          </code>
                                        );
                                      }
                                    }}
                                  >
                                    {msg.content}
                                  </ReactMarkdown>
                                </div>
                              )}
                            </div>
                          )}

                          {/* DYNAMIC ACTION PARAMETERS ROW */}
                          {!isEditing && (
                            <div className={`flex mt-1 items-center gap-1.5 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200 ${isUser ? 'justify-end pr-1' : 'justify-start pl-1'}`}>
                              <button
                                type="button"
                                onClick={() => handleCopyText(msg.content, idx)}
                                className="p-1.5 rounded-full hover:bg-gray-200/40 dark:hover:bg-gray-800 text-gray-400 transition-colors"
                                title="Copy textual contents"
                              >
                                {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>

                              {!isUser && !msg.content.includes('![Generated Image]') && (
                                <button
                                  type="button"
                                  onClick={() => speak(msg.content, idx)}
                                  className={`p-1.5 rounded-full hover:bg-gray-200/40 dark:hover:bg-gray-800 transition-colors ${
                                    currentPlayingIndex === idx ? 'text-yellow-500 bg-yellow-500/10' : 'text-gray-400'
                                  }`}
                                  title="Render audio readout structural framework"
                                >
                                  {currentPlayingIndex === idx ? <VolumeX className="w-3.5 h-3.5 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                                </button>
                              )}

                              {isUser && (
                                <button
                                  type="button"
                                  onClick={() => { setEditingIndex(idx); setEditingText(msg.content); }}
                                  className="p-1.5 rounded-full hover:bg-gray-200/40 dark:hover:bg-gray-800 text-gray-400 transition-colors"
                                  title="Mutate message parameters"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {isUser && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#8a4b2d] dark:bg-yellow-600 text-white flex items-center justify-center text-xs font-bold shadow-md mt-1">
                            {user?.name?.charAt(0) || 'D'}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}

                  {loading && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 justify-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gray-900 dark:bg-[#21202c] flex items-center justify-center text-white text-xs font-bold shadow-md">AI</div>
                      <div className="bg-transparent px-1 py-3 flex items-center gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.span 
                            key={i} 
                            animate={{ y: [0, -5, 0] }} 
                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.12 }} 
                            className="w-1.5 h-1.5 bg-[#8a4b2d] dark:bg-yellow-500 rounded-full" 
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* CONTROLS FLOATING DOCK */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex-shrink-0 z-20 bg-gradient-to-t via-90% to-transparent ${
          darkMode ? 'from-[#0b0a0f] via-[#0b0a0f]' : 'from-[#f9f8f4] via-[#f9f8f4]'
        }`}>
          <form onSubmit={handleFormSubmit} className="max-w-5xl xl:max-w-6xl mx-auto space-y-2.5">
            <div className={`rounded-2xl border shadow-xl p-3 flex flex-col gap-2 relative transition-colors ${
              darkMode ? 'bg-[#121118] border-[#24222f] shadow-black/40' : 'bg-white border-[#e4e1d3]'
            }`}>
              
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Scholarly AI pipeline system or trigger /image parameter parsing..."
                disabled={loading}
                rows="1"
                className={`w-full bg-transparent placeholder-gray-400 dark:placeholder-gray-500 text-sm md:text-base resize-none focus:outline-none max-h-36 pt-1 px-1 leading-relaxed ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              />
              
              <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800/40 pt-2 mt-1">
                <div className="flex items-center gap-2.5">
                  <motion.button whileHover={{ scale: 1.05 }} type="button" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                    <Paperclip className="w-4 h-4" />
                  </motion.button>

                  <VoiceRecorder onTranscribe={handleVoiceTranscribe} disabled={loading} />

                  {/* MODEL INLINE PICKER OVERLAY */}
                  <div className="relative" ref={modelSelectorRef}>
                    <button
                      type="button"
                      onClick={() => setShowModelSelector(!showModelSelector)}
                      className="flex items-center gap-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs font-medium transition-colors"
                    >
                      <span>{availableModels.find(m => m.id === selectedModel)?.name.split('(')[0].trim() || 'Sonnet 3.5'}</span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </button>

                    <AnimatePresence>
                      {showModelSelector && (
                        <motion.div 
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          className={`absolute bottom-full left-0 mb-2 w-56 border rounded-xl shadow-2xl z-50 p-1.5 space-y-0.5 ${
                            darkMode ? 'bg-[#1a1923] border-[#323042]' : 'bg-white border-[#e4e1d3]'
                          }`}
                        >
                          {availableModels.map(model => (
                            <button
                              key={model.id}
                              type="button"
                              onClick={() => {
                                setSelectedModel(model.id);
                                handleNewChat(); 
                                setShowModelSelector(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                                selectedModel === model.id 
                                  ? (darkMode ? 'bg-[#21202c] text-yellow-400 font-medium' : 'bg-[#ebdcd3] text-[#8a4b2d] font-medium') 
                                  : (darkMode ? 'text-gray-300 hover:bg-[#21202c]' : 'text-gray-600 hover:bg-[#f3f1ea]')
                              }`}
                            >
                              <div className="truncate">{model.name}</div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <motion.button
                  whileHover={inputMessage.trim() && !loading ? { scale: 1.05 } : {}}
                  whileTap={inputMessage.trim() && !loading ? { scale: 0.95 } : {}}
                  type="submit"
                  disabled={!inputMessage.trim() || loading}
                  className={`p-2 rounded-xl shadow-sm transition-all ${
                    inputMessage.trim() && !loading 
                      ? 'bg-[#8a4b2d] dark:bg-yellow-600 text-white hover:opacity-90' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </motion.button>
              </div>
            </div>
            
            <div className="text-center text-[10px] text-gray-400 dark:text-gray-500 tracking-wide">
              Scholarly Core Engine deployment arrays can output contextual data noise anomalies.
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}