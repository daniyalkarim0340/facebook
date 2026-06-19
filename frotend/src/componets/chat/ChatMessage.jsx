import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Edit2, Volume2, VolumeX, Download } from 'lucide-react';
import { messageVariants } from './chatAnimations';

export default function ChatMessage({
  msg,
  idx,
  darkMode,
  user,
  isEditing,
  editingText,
  editInputRef,
  copiedIndex,
  codeCopiedIndex,
  currentPlayingIndex,
  onEditTextChange,
  onCancelEdit,
  onSaveEdit,
  onCopyText,
  onCopyCodeBlock,
  onSpeak,
  onStartEdit,
  onDownloadImage,
}) {
  // Flag to adjust alignments, colors, and capabilities depending on the message origin
  const isUser = msg.role === 'user';

  return (
    // 1. Main Motion Wrapper
    // Uses structural properties (like 'justify-end' vs 'justify-start') to anchor bubbles left or right.
    <motion.div
      custom={{ isUser, index: idx }}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      layout // Ensures other messages animate smoothly into position when a bubble changes size (e.g. editing)
      key={`${idx}-${msg.content?.slice(0, 24)}`}
      className={`flex gap-4 w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      
      {/* 2. Left Side AI Avatar (Rendered only on AI responses) */}
      {!isUser && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22, delay: idx * 0.06 + 0.1 }}
          className={`flex-shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center text-xs font-bold shadow-xs mt-1 ${
            darkMode ? 'bg-zinc-900 border-zinc-800 text-amber-400' : 'bg-white border-zinc-200 text-zinc-900'
          }`}
        >
          AI
        </motion.div>
      )}

      {/* 3. Core Bubble Content Stream 
          Uses 'group/msg' so child action panels can detect mouse hovering anywhere on this message.
      */}
      <div className="flex flex-col max-w-[85%] group/msg min-w-0">
        
        {/* BRANCH A: Inside Inline Text Editor Workspace */}
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 }}
            className={`w-full border rounded-2xl p-4 shadow-sm flex flex-col gap-3 ${
              darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
            }`}
          >
            <textarea
              ref={editInputRef}
              value={editingText}
              onChange={(e) => {
                onEditTextChange(e.target.value);
                // Dynamic auto-resizing script specifically for the editing panel container
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              className={`w-full bg-transparent text-sm md:text-base resize-none focus:outline-none overflow-hidden leading-relaxed ${
                darkMode ? 'text-white' : 'text-zinc-900'
              }`}
              rows="1"
            />
            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button type="button" onClick={onCancelEdit} className="px-4 py-2 rounded-xl text-zinc-400 hover:text-zinc-600 transition-colors">
                Cancel
              </button>
              <button type="button" onClick={() => onSaveEdit(idx)} className={`px-4 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-xs ${
                darkMode ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-white'
              }`}>
                Apply Sync
              </button>
            </div>
          </motion.div>
        ) : (
          
          // BRANCH B: Standard Static Message Render Block
          <motion.div
            whileHover={{ scale: 1.005 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35, delay: 0.05 }}
            className={`rounded-2xl px-5 py-4 text-sm md:text-base leading-relaxed w-full transition-colors duration-300 ${
              isUser
                ? (darkMode
                    ? 'bg-zinc-800 text-zinc-50 border border-zinc-700 rounded-tr-sm shadow-sm'
                    : 'bg-zinc-900 text-white border border-zinc-800 shadow-md rounded-tr-sm')
                : (darkMode
                    ? 'bg-zinc-900/70 text-zinc-100 border border-zinc-800/80 rounded-tl-sm backdrop-blur-sm'
                    : 'bg-white text-zinc-800 border border-zinc-200/90 shadow-sm rounded-tl-sm')
            }`}
          >
            {/* User Side: Render either the uploaded file layout asset or clean textual text inputs */}
            {isUser ? (
              msg.isImage ? (
                <div className="my-1 max-w-xs sm:max-w-sm overflow-hidden rounded-xl border border-zinc-700/50 shadow-md">
                  <img 
                    src={msg.content} 
                    alt="User uploaded file pipeline preview" 
                    className="w-full h-auto object-cover max-h-[320px]" 
                    loading="lazy"
                  />
                </div>
              ) : (
                <p className="whitespace-pre-wrap break-words font-medium">{msg.content}</p>
              )
            ) : (
              
              /* AI Side: Render rich Markdown data configurations and custom element rules */
              <div className={`prose max-w-none space-y-3 prose-pre:p-0 prose-p:leading-relaxed ${
                darkMode
                  ? 'prose-invert prose-p:text-zinc-100 prose-headings:text-zinc-50 prose-strong:text-zinc-100 prose-li:text-zinc-200'
                  : 'prose-zinc prose-p:text-zinc-700 prose-headings:text-zinc-900 prose-strong:text-zinc-800'
              }`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]} // Adds structural support for lists, tables, and checkboxes
                  components={{
                    
                    // FIX: Map paragraphs directly to block-level layout structures.
                    // This completely avoids throwing hydration/nesting alerts when code blocks append structural sub-divs.
                    p({ children }) {
                      return <div className="leading-relaxed mb-3 last:mb-0">{children}</div>;
                    },

                    // CUSTOM ELEMENT OVERRIDE 1: Markdown Image Nodes (`![]()`)
                    img({ src, alt }) {
                      return (
                        <div className={`relative group/imgBlock my-5 max-w-xl overflow-hidden rounded-xl border shadow-sm ${
                          darkMode ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-zinc-50'
                        }`}>
                          <img src={src} alt={alt || 'AI generated asset'} className="w-full h-auto object-cover max-h-[480px]" loading="lazy" />
                          
                          {/* Image Action Overlay: Fades in on hover to present download buttons */}
                          <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover/imgBlock:opacity-100 transition-opacity duration-300 delay-75 flex items-center justify-center backdrop-blur-xs">
                            <button
                              type="button"
                              onClick={() => onDownloadImage(src)}
                              className="flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-900 font-semibold text-xs rounded-xl shadow-md hover:bg-zinc-100 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Download High-Res Asset
                            </button>
                          </div>
                        </div>
                      );
                    },
                    
                    // CUSTOM ELEMENT OVERRIDE 2: Markdown Code Nodes (```blocks``` vs `inline`)
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      const language = match ? match[1] : '';
                      const codeValue = String(children).replace(/\n$/, '');
                      
                      // Generates an explicit identifier so copy events target this code block exclusively
                      const blockId = `${idx}-${node.position?.start.offset || codeValue.substring(0, 10)}`;

                      return !inline ? (
                        /* MULTI-LINE CODE BLOCK SETUP */
                        <div className={`my-5 overflow-hidden rounded-xl border shadow-md w-full ${
                          darkMode ? 'border-zinc-800 bg-[#1e1e1e]' : 'border-zinc-200 bg-zinc-50'
                        }`}>
                          {/* Header window control panel bar */}
                          <div className={`flex items-center justify-between px-4 py-2.5 text-xs font-mono select-none border-b ${
                            darkMode ? 'bg-[#252526] text-zinc-400 border-zinc-800/80' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                          }`}>
                            <span className="font-semibold uppercase tracking-wider">{language || 'terminal-buffer'}</span>
                            
                            {/* Copy button tracking structural clipboards */}
                            <button
                              type="button"
                              onClick={() => onCopyCodeBlock(codeValue, blockId)}
                              className="hover:text-zinc-200 transition-colors flex items-center gap-1.5 font-sans"
                            >
                              {codeCopiedIndex === blockId ? (
                                <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400 font-semibold">Copied!</span></>
                              ) : (
                                <><Copy className="w-3.5 h-3.5" /><span>Copy Script</span></>
                              )}
                            </button>
                          </div>
                          
                          {/* Formal Syntax Highlighter Engine Layer */}
                          <SyntaxHighlighter
                            style={darkMode ? vscDarkPlus : vs}
                            language={language || 'text'}
                            PreTag="div"
                            customStyle={{
                              margin: 0,
                              padding: '1.25rem',
                              background: darkMode ? '#1e1e1e' : '#f9f9f9',
                              fontSize: '0.875rem',
                              overflowX: 'auto',
                              lineHeight: '1.6',
                            }}
                            {...props}
                          >
                            {codeValue}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        /* SINGLE INLINE CODE SEGMENT RENDER STYLE */
                        <code className={`px-1.5 py-0.5 rounded font-mono text-xs md:text-sm font-semibold tracking-wide ${
                          darkMode ? 'bg-zinc-800 text-amber-400' : 'bg-zinc-200/60 text-amber-800'
                        }`} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            )}
          </motion.div>
        )}

        {/* 4. Secondary Message Action Row (Reveals dynamically when user hovers over group/msg) */}
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 + 0.2 }}
            className={`flex mt-1.5 items-center gap-1 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-300 delay-100 ${
              isUser ? 'justify-end pr-1' : 'justify-start pl-1'
            }`}
          >
            {/* Global Text Copy Trigger Button - Hide if message is purely an image asset */}
            {(!isUser || !msg.isImage) && (
              <button
                type="button"
                onClick={() => onCopyText(msg.content, idx)}
                className={`p-1.5 rounded-lg text-zinc-400 transition-colors ${
                  darkMode ? 'hover:bg-zinc-800 hover:text-zinc-200' : 'hover:bg-zinc-200/60 hover:text-zinc-700'
                }`}
                title="Copy Text Content"
              >
                {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* TTS Audio stream trigger (Hidden for standard user text or plain image outputs) */}
            {!isUser && !msg.content.includes('![Generated Image]') && (
              <button
                type="button"
                onClick={() => onSpeak(msg.content, idx)}
                className={`p-1.5 rounded-lg transition-colors ${
                  currentPlayingIndex === idx
                    ? 'text-amber-500 bg-amber-500/10'
                    : (darkMode ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700')
                }`}
                title="Voice Stream Playback"
              >
                {currentPlayingIndex === idx ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Direct Inline Editor Activation Switcher (Available to standard text user content bubbles only) */}
            {isUser && !msg.isImage && (
              <button
                type="button"
                onClick={() => onStartEdit(idx, msg.content)}
                className={`p-1.5 rounded-lg text-zinc-400 transition-colors ${
                  darkMode ? 'hover:bg-zinc-800 hover:text-zinc-200' : 'hover:bg-zinc-200/60 hover:text-zinc-700'
                }`}
                title="Edit Message"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* 5. Right Side User Avatar (Rendered only on User responses) */}
      {isUser && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22, delay: idx * 0.06 + 0.15 }}
          className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shadow-xs mt-1 ${
            darkMode
              ? 'bg-zinc-100 text-zinc-900 border border-zinc-200'
              : 'bg-zinc-900 text-white border border-zinc-800'
          }`}
        >
          {user?.name?.charAt(0) || 'D'}
        </motion.div>
      )}
    </motion.div>
  );
}