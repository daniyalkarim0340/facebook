import { AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import AiTypingIndicator from './AiTypingIndicator';

export default function ChatMessageList({
  messages,
  darkMode,
  user,
  loading,
  loadingStatusText,
  editingIndex,
  editingText,
  editInputRef,
  copiedIndex,
  codeCopiedIndex,
  currentPlayingIndex,
  messagesEndRef,
  onEditTextChange,
  onCancelEdit,
  onSaveEdit,
  onCopyText,
  onCopyCodeBlock,
  onSpeak,
  onStartEdit,
  onDownloadImage,
}) {
  return (
    <div className="space-y-8 py-8 w-full">
      {messages.map((msg, idx) => (
        <ChatMessage
          key={`${idx}-${msg.content?.slice(0, 24)}`}
          msg={msg}
          idx={idx}
          darkMode={darkMode}
          user={user}
          isEditing={editingIndex === idx}
          editingText={editingText}
          editInputRef={editInputRef}
          copiedIndex={copiedIndex}
          codeCopiedIndex={codeCopiedIndex}
          currentPlayingIndex={currentPlayingIndex}
          onEditTextChange={onEditTextChange}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onCopyText={onCopyText}
          onCopyCodeBlock={onCopyCodeBlock}
          onSpeak={onSpeak}
          onStartEdit={onStartEdit}
          onDownloadImage={onDownloadImage}
        />
      ))}

      <AnimatePresence>
        {loading && (
          <AiTypingIndicator darkMode={darkMode} status={loadingStatusText} />
        )}
      </AnimatePresence>

      <div ref={messagesEndRef} className="h-4 shrink-0 scroll-mt-4" aria-hidden="true" />
    </div>
  );
}
