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
  FileText,
  PenTool,
  Lightbulb,
  Copy,
  Check,
  Edit2,
  Volume2,   
  VolumeX,
  Download,
  Image as ImageIcon
} from 'lucide-react';
import useChatStore from '../app/usechat.store';
import useAuthStore from '../app/datastore';
import VoiceRecorder from '../hook/voice'; 
import { useTextToSpeech } from '../hook/voice';

export default function ChatDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [codeCopiedIndex, setCodeCopiedIndex] = useState(null);
  
  // State for message editing
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const modelSelectorRef = useRef(null);
  const editInputRef = useRef(null);

  // Initializing Text-to-Speech Hook controls
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
    generateAiImage // Grab your newly created image handler from store
  } = useChatStore();

  const { user, logout } = useAuthStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
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

  useEffect(() => {
    fetchHistoryList();
  }, []);

  useEffect(() => {
    if (currentSessionId) {
      fetchSessionMessages(currentSessionId);
    }
  }, [currentSessionId]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    // Smart Router Checklist: If prompt starts with /image, route it to Hugging Face pipeline
    if (inputMessage.trim().toLowerCase().startsWith('/image ')) {
      const imgPrompt = inputMessage.trim().substring(7);
      // Log user message locally to streaming view history array
      useChatStore.setState({
        messages: [...messages, { role: 'user', content: inputMessage.trim() }]
      });
      generateAiImage(imgPrompt);
    } else {
      sendMessage(inputMessage.trim());
    }
    
    setInputMessage('');
  };

  const handleVoiceTranscribe = (transcribedText) => {
    setInputMessage(transcribedText);
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
      console.error('Failed to copy text: ', err);
    }
  };

  const handleCopyCodeBlock = async (code, blockId) => {
    try {
      await navigator.clipboard.writeText(code);
      setCodeCopiedIndex(blockId);
      setTimeout(() => setCodeCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
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
    link.download = `ai-generated-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Animation configurations
  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 350, damping: 25 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex h-screen w-screen bg-[#f9f8f4] text-[#1a1a1a] overflow-hidden font-sans antialiased">
      
      {/* SIDEBAR OVERLAY */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/10 z-30 md:hidden backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.div 
        initial={false}
        animate={sidebarOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed inset-y-0 left-0 z-40 w-64 bg-[#f3f1ea] border-r border-[#e4e1d3] flex flex-col shadow-2xl"
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-[#e4e1d3]">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">History</span>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(false)} 
            className="p-1.5 hover:bg-[#e4e1d3] rounded-lg transition-colors text-gray-600"
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
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#d3cebe] bg-[#f9f8f4] hover:bg-white text-gray-700 text-sm font-medium transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-gray-500" />
            New chat
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {history.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-gray-400 italic">
              No conversations yet
            </div>
          ) : (
            <div className="space-y-1">
              {history.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() => {
                    useChatStore.setState({ currentSessionId: chat._id });
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg group flex items-center justify-between text-sm truncate ${
                    currentSessionId === chat._id ? 'bg-[#e4e1d3] text-black font-medium' : 'text-gray-600 hover:bg-[#e4e1d3]/60'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MessageSquare className="w-4 h-4 flex-shrink-0 text-gray-400" />
                    <span className="truncate text-xs">{chat.title || 'Untitled'}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, color: '#dc2626' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(chat._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 flex-shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </motion.button>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-[#e4e1d3] p-3 space-y-1 bg-[#edeae1]">
          <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-[#e4e1d3] text-xs transition-colors">
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-[#e4e1d3] text-xs transition-colors">
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
          <div className="mt-2 px-3 py-2 text-xs bg-[#f9f8f4]/80 rounded-lg border border-[#e4e1d3]">
            <p className="font-medium text-gray-800">{user?.name || 'Daniyal'}</p>
            <p className="text-gray-400 text-[10px] truncate">{user?.email || 'daniyal@example.com'}</p>
          </div>
        </div>
      </motion.div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        <header className="h-14 flex items-center px-4 flex-shrink-0 justify-between z-30">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-white hover:bg-[#f3f1ea] border border-[#e4e1d3] rounded-lg transition-colors shadow-sm"
          >
            <Menu className="w-4 h-4 text-gray-700" />
          </motion.button>
          <div className="text-xs text-gray-400 font-medium italic">
            {loading && <span className="inline-block animate-pulse">Running image engine pipeline...</span>}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto w-full pb-36 px-4 md:px-8">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              
              <motion.div 
                key="empty-state"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={containerVariants}
                className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto"
              >
                <div className="w-full text-center space-y-6">
                  <motion.div variants={itemVariants} className="flex justify-center">
                    <div className="w-14 h-14 rounded-xl bg-[#ebdcd3] flex items-center justify-center shadow-sm">
                      <Lightbulb className="w-6 h-6 text-[#8a4b2d]" />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900">
                      Good afternoon, {user?.name?.split(' ')[0] || 'Daniyal'}
                    </h1>
                    <p className="text-gray-500 font-light text-sm md:text-base">
                      Type <code className="bg-gray-200/80 px-1 py-0.5 rounded text-xs text-[#8a4b2d] font-mono">/image [prompt]</code> to generate custom assets!
                    </p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 max-w-2xl mx-auto">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setInputMessage('/image A cinematic view of a futuristic research library')}
                      className="p-5 rounded-xl border border-[#e4e1d3] bg-[#fdfdfb] text-center flex flex-col items-center justify-center space-y-2 group"
                    >
                      <ImageIcon className="w-5 h-5 text-[#8a4b2d] transition-transform group-hover:scale-110" />
                      <p className="text-gray-900 font-medium text-sm">Generate Artwork</p>
                      <p className="text-gray-400 text-xs">Use Flux AI to engineer high-fidelity visual assets</p>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setInputMessage('Draft a literature review')}
                      className="p-5 rounded-xl border border-[#e4e1d3] bg-[#fdfdfb] text-center flex flex-col items-center justify-center space-y-2 group"
                    >
                      <PenTool className="w-5 h-5 text-[#8a4b2d]" />
                      <p className="text-gray-900 font-medium text-sm">Draft a literature review</p>
                      <p className="text-gray-400 text-xs">Synthesize multiple sources</p>
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>

            ) : (

              <motion.div key="message-stream" className="max-w-3xl mx-auto space-y-6 py-6" layout>
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
                      className={`flex gap-3 w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-800 text-white flex items-center justify-center text-xs font-semibold shadow-xs mt-1">
                          AI
                        </div>
                      )}

                      <div className="flex flex-col max-w-[85%] group/msg w-full min-w-0">
                        {isEditing ? (
                          <div className="w-full bg-[#f3f1ea] border border-[#decbc0] rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                            <textarea
                              ref={editInputRef}
                              value={editingText}
                              onChange={(e) => {
                                setEditingText(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                              }}
                              className="w-full bg-transparent text-gray-900 text-sm md:text-base resize-none focus:outline-none overflow-hidden leading-7"
                              rows="1"
                            />
                            <div className="flex justify-end gap-2 text-xs font-medium">
                              <button type="button" onClick={() => setEditingIndex(null)} className="px-4 py-1.5 rounded-full text-gray-500 hover:bg-gray-200/60">Cancel</button>
                              <button type="button" onClick={() => handleSaveEdit(idx)} className="px-4 py-1.5 bg-[#8a4b2d] text-white rounded-full">Update</button>
                            </div>
                          </div>
                        ) : (
                          <div className={`rounded-2xl px-4 py-2.5 text-sm md:text-base leading-7 w-full ${isUser ? 'bg-[#ebdcd3]/50 text-gray-900 border border-[#decbc0]/30 rounded-tr-none ml-auto text-left' : 'bg-transparent text-gray-800 mr-auto'}`}>
                            {isUser ? (
                              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                            ) : (
                              <div className="prose max-w-none text-gray-800 space-y-3 prose-p:leading-7 prose-pre:p-0">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    // ✨ NEW CUSTOM ELEMENT PARSER RULE FOR IMAGES DETECTED IN MARKDOWN DATA
                                    img({ src, alt }) {
                                      return (
                                        <div className="relative group/imgBlock my-4 max-w-md overflow-hidden rounded-xl border border-[#e4e1d3] bg-white shadow-md">
                                          <img src={src} alt={alt || 'AI generated asset'} className="w-full h-auto object-cover max-h-[450px]" loading="lazy" />
                                          {/* Hover Utility Action Overlay Bar */}
                                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/imgBlock:opacity-100 transition-opacity duration-200 flex items-center justify-center">
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
                                        <div className="my-4 overflow-hidden rounded-xl border border-gray-700 bg-[#1e1e1e] shadow-md w-full">
                                          <div className="flex items-center justify-between bg-[#2d2d2d] px-4 py-1.5 text-xs text-gray-400 font-mono select-none border-b border-gray-800">
                                            <span>{language || 'code'}</span>
                                            <button
                                              type="button"
                                              onClick={() => handleCopyCodeBlock(codeValue, blockId)}
                                              className="hover:text-white transition-colors flex items-center gap-1.5 font-sans"
                                            >
                                              {codeCopiedIndex === blockId ? (
                                                <><Check className="w-3 h-3 text-green-500" /><span className="text-green-500 font-medium">Copied!</span></>
                                              ) : (
                                                <><Copy className="w-3 h-3" /><span>Copy</span></>
                                              )}
                                            </button>
                                          </div>
                                          <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={language || 'text'}
                                            PreTag="div"
                                            customStyle={{ margin: 0, padding: '1rem', background: 'transparent', fontSize: '0.875rem', overflowX: 'auto' }}
                                            {...props}
                                          >
                                            {codeValue}
                                          </SyntaxHighlighter>
                                        </div>
                                      ) : (
                                        <code className="bg-gray-200/70 text-[#8a4b2d] px-1.5 py-0.5 rounded font-mono text-xs md:text-sm" {...props}>
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

                        {/* GENERAL ACTION OPTIONS BAR */}
                        {!isEditing && (
                          <div className={`flex mt-0.5 items-center gap-1 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200 ${isUser ? 'justify-end pr-2' : 'justify-start pl-2'}`}>
                            <button
                              type="button"
                              onClick={() => handleCopyText(msg.content, idx)}
                              className="p-1.5 rounded-full hover:bg-gray-200/50 text-gray-400 hover:text-gray-700"
                            >
                              {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            {/* Check to ensure voice engine doesn't read out raw base64 source string characters */}
                            {!isUser && !msg.content.includes('![Generated Image]') && (
                              <button
                                type="button"
                                onClick={() => speak(msg.content, idx)}
                                className={`p-1.5 rounded-full hover:bg-gray-200/50 ${currentPlayingIndex === idx ? 'text-[#8a4b2d] bg-[#ebdcd3]/40' : 'text-gray-400'}`}
                              >
                                {currentPlayingIndex === idx ? <VolumeX className="w-3.5 h-3.5 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                              </button>
                            )}

                            {isUser && (
                              <button
                                type="button"
                                onClick={() => { setEditingIndex(idx); setEditingText(msg.content); }}
                                className="p-1.5 rounded-full hover:bg-gray-200/50 text-gray-400 hover:text-gray-700"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#8a4b2d] text-white flex items-center justify-center text-xs font-semibold shadow-xs mt-1">
                          {user?.name?.charAt(0) || 'D'}
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {loading && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 justify-start">
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center text-white text-xs font-semibold shadow-xs">AI</div>
                    <div className="bg-transparent px-2 py-3 flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span key={i} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }} className="w-1.5 h-1.5 bg-[#8a4b2d] rounded-full" />
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* INPUT DOCK */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#f9f8f4] via-[#f9f8f4] to-transparent p-4 flex-shrink-0 z-20">
          <form onSubmit={handleFormSubmit} className="max-w-3xl mx-auto space-y-2">
            <div className="bg-white rounded-2xl border border-[#e4e1d3] shadow-lg p-3 flex flex-col gap-2 relative">
              
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Scholarly AI or type /image to generate..."
                disabled={loading}
                rows="1"
                className="w-full bg-transparent text-gray-900 placeholder-gray-400 text-sm md:text-base resize-none focus:outline-none max-h-36 pt-1 px-1"
              />
              
              <div className="flex items-center justify-between border-t border-gray-50 pt-2 mt-1">
                <div className="flex items-center gap-3">
                  <motion.button whileHover={{ scale: 1.1 }} type="button" className="text-gray-400 hover:text-gray-600">
                    <Paperclip className="w-4 h-4" />
                  </motion.button>

                  <VoiceRecorder onTranscribe={handleVoiceTranscribe} disabled={loading} />

                  {/* MODEL SELECTOR */}
                  <div className="relative" ref={modelSelectorRef}>
                    <button
                      type="button"
                      onClick={() => setShowModelSelector(!showModelSelector)}
                      className="flex items-center gap-1 text-gray-500 hover:text-gray-800 text-xs font-medium transition-colors"
                    >
                      <span>{availableModels.find(m => m.id === selectedModel)?.name.split('(')[0].trim() || 'Sonnet 3.5'}</span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </button>

                    <AnimatePresence>
                      {showModelSelector && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full left-0 mb-2 w-52 bg-white border border-[#e4e1d3] rounded-xl shadow-xl z-50 p-1.5 space-y-0.5"
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
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs ${selectedModel === model.id ? 'bg-[#ebdcd3] text-[#8a4b2d] font-medium' : 'text-gray-600 hover:bg-[#f3f1ea]'}`}
                            >
                              <div>{model.name}</div>
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
                  className={`p-2 rounded-xl shadow-xs ${inputMessage.trim() && !loading ? 'bg-[#8a4b2d] text-white' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </motion.button>
              </div>
            </div>
            <div className="text-center text-[10px] text-gray-400 px-1">
              Scholarly AI may produce inaccurate information about people, places, or facts.
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}