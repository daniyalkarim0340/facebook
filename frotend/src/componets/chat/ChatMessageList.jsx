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
    // 1. Core Scroll Container Framework
    // Uses 'space-y-8' to provide a clean visual rhythm and separation between distinct conversational blocks.
    <div className="space-y-8 py-8 w-full">
      
      {/* 2. Message Loop Iterator
          Maps through the message array to sequentially render each response block.
      */}
      {messages.map((msg, idx) => (
        <ChatMessage
          // The key combines the index with a string slice of the content.
          // WHY: Using just 'idx' can cause rendering bugs if messages are deleted or re-ordered. 
          // Slicing the text ensures React uniquely identifies this specific bubble's data footprint.
          key={`${idx}-${msg.content?.slice(0, 24)}`}
          
          // Core state pointers
          msg={msg}
          idx={idx}
          darkMode={darkMode}
          user={user}
          
          // Editing Management Flags
          // WHY: By evaluating 'editingIndex === idx', only ONE message block turns into 
          // an active editable input window at any given time.
          isEditing={editingIndex === idx}
          editingText={editingText}
          editInputRef={editInputRef}
          
          // Interaction tracking flags (shows checkmarks or audio animations uniquely)
          copiedIndex={copiedIndex}
          codeCopiedIndex={codeCopiedIndex}
          currentPlayingIndex={currentPlayingIndex}
          
          // Upward Event Callback Pipeline
          // WHY: These map directly to handlers in the parent dashboard, allowing deeply nested UI 
          // bubbles to safely update global application and pipeline state.
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

      {/* 3. Framer Motion Exit Animation Layer
          WHY: AnimatePresence monitors internal tree changes. When 'loading' shifts to false,
          it catches the unmounting event, allowing the typing indicator to cleanly fade or 
          slide out of view instead of abruptly vanishing from the layout.
      */}
      <AnimatePresence>
        {loading && (
          <AiTypingIndicator darkMode={darkMode} status={loadingStatusText} />
        )}
      </AnimatePresence>

      {/* 4. Invisible Layout Scroll Anchor
          WHY: This element takes up minimal space ('h-4') and is hidden from screen readers. 
          It serves purely as a physical geometric coordinate target for the parent component's 
          'scrollIntoView()' hook. Whenever a message mounts, the dashboard tells the browser 
          to instantly scroll right here.
      */}
      <div ref={messagesEndRef} className="h-4 shrink-0 scroll-mt-4" aria-hidden="true" />
    </div>
  );
}