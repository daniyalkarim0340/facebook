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
  const isUser = msg.role === 'user';

  // 🟩 IMAGE DETECTION LOGIC
  // Detects if the message is an AI-generated image containing a Cloudinary URL
  const isImageResponse = !isUser && typeof msg.content === 'string' && msg.content.includes('cloudinary.com');
  // Cleans the string by removing the "DAI" prefix to get the raw URL
  const imageUrl = isImageResponse ? msg.content.replace('DAI', '').trim() : null;

  return (
    <motion.div
      custom={{ isUser, index: idx }}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      layout
      key={`${idx}-${msg.content?.slice(0, 24)}`}
      className={`flex gap-4 w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
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

      <div className="flex flex-col max-w-[85%] group/msg min-w-0">
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
          <motion.div
            whileHover={{ scale: 1.005 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35, delay: 0.05 }}
            className={`rounded-2xl px-5 py-4 text-sm md:text-base leading-relaxed w-full transition-colors duration-300 ${
              isUser
                ? (darkMode ? 'bg-zinc-800 text-zinc-50 border border-zinc-700 rounded-tr-sm shadow-sm' : 'bg-zinc-900 text-white border border-zinc-800 shadow-md rounded-tr-sm')
                : (darkMode ? 'bg-zinc-900/70 text-zinc-100 border border-zinc-800/80 rounded-tl-sm backdrop-blur-sm' : 'bg-white text-zinc-800 border border-zinc-200/90 shadow-sm rounded-tl-sm')
            }`}
          >
            {isUser ? (
              msg.isImage ? (
                <div className="my-1 max-w-xs sm:max-w-sm overflow-hidden rounded-xl border border-zinc-700/50 shadow-md">
                  <img src={msg.content} alt="User upload" className="w-full h-auto object-cover max-h-[320px]" loading="lazy" />
                </div>
              ) : (
                <p className="whitespace-pre-wrap break-words font-medium">{msg.content}</p>
              )
            ) : isImageResponse ? (
              // 🟩 RENDER IMAGE BLOCK
              <div className="my-2 overflow-hidden rounded-xl border border-zinc-700/50 shadow-md">
                <img src={imageUrl} alt="AI Generated Asset" className="w-full h-auto object-cover max-h-[480px]" loading="lazy" />
                <button
                  type="button"
                  onClick={() => onDownloadImage(imageUrl)}
                  className="flex w-full items-center justify-center gap-2 py-2.5 bg-zinc-900/5 text-white font-semibold text-xs hover:bg-zinc-900/10 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download Asset
                </button>
              </div>
            ) : (
              // 🟩 RENDER MARKDOWN BLOCK
              <div className={`prose max-w-none space-y-3 ${darkMode ? 'prose-invert' : 'prose-zinc'}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                  p: ({ children }) => <div className="leading-relaxed mb-3">{children}</div>,
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : '';
                    const codeValue = String(children).replace(/\n$/, '');
                    const blockId = `${idx}-${node.position?.start.offset || codeValue.substring(0, 10)}`;

                    return !inline ? (
                      <div className={`my-5 rounded-xl border ${darkMode ? 'border-zinc-800 bg-[#1e1e1e]' : 'border-zinc-200 bg-zinc-50'}`}>
                        <div className={`flex items-center justify-between px-4 py-2.5 text-xs font-mono border-b ${darkMode ? 'bg-[#252526] text-zinc-400' : 'bg-zinc-100 text-zinc-500'}`}>
                          <span className="font-semibold uppercase">{language || 'code'}</span>
                          <button type="button" onClick={() => onCopyCodeBlock(codeValue, blockId)} className="flex items-center gap-1.5 hover:text-white">
                            {codeCopiedIndex === blockId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <SyntaxHighlighter style={darkMode ? vscDarkPlus : vs} language={language || 'text'} PreTag="div" customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }} {...props}>
                          {codeValue}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className={`px-1.5 py-0.5 rounded font-mono text-xs ${darkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`}>{children}</code>
                    );
                  }
                }}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            )}
          </motion.div>
        )}

        {/* Action Row */}
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex mt-1.5 items-center gap-1 opacity-0 group-hover/msg:opacity-100 transition-opacity ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            {(!isUser || !isImageResponse) && (
              <button type="button" onClick={() => onCopyText(msg.content, idx)} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-800">
                {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
            {!isUser && !isImageResponse && (
              <button type="button" onClick={() => onSpeak(msg.content, idx)} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-800">
                {currentPlayingIndex === idx ? <VolumeX className="w-3.5 h-3.5 text-amber-500" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            )}
            {isUser && !msg.isImage && (
              <button type="button" onClick={() => onStartEdit(idx, msg.content)} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-800">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold bg-zinc-900 text-white">
          {user?.name?.charAt(0) || 'U'}
        </div>
      )}
    </motion.div>
  );
}