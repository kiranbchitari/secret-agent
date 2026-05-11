'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load emoji picker
const EmojiPicker = dynamic(
  () => import('emoji-picker-react').then((m) => ({ default: m.default })),
  { ssr: false, loading: () => null }
);

interface MessageInputProps {
  onSend: (text: string) => void;
  onTypingChange: (isTyping: boolean) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, onTypingChange, disabled = false }: MessageInputProps) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const isTypingRef = useRef(false);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [text]);

  const handleTyping = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTypingChange(true);
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onTypingChange(false);
    }, 2000);
  }, [onTypingChange]);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    setShowEmoji(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    isTypingRef.current = false;
    onTypingChange(false);
    textareaRef.current?.focus();
  }, [text, disabled, onSend, onTypingChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Close emoji picker on outside click
  useEffect(() => {
    if (!showEmoji) return;
    const handle = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('[data-emoji-container]')) {
        setShowEmoji(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [showEmoji]);

  return (
    <div
      className="relative"
      style={{
        padding: '8px 12px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        borderTop: 'var(--border-glass)',
        background: 'var(--bg-surface)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            data-emoji-container
            className="absolute bottom-full left-0 right-0 mb-2 mx-3"
            style={{ zIndex: 50 }}
          >
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                setText((t) => t + emojiData.emoji);
                textareaRef.current?.focus();
              }}
              width="100%"
              height={320}
              theme={'dark' as never}
              searchPlaceholder="Search emoji..."
              previewConfig={{ showPreview: false }}
              skinTonesDisabled
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input row */}
      <div className="flex items-end gap-2">
        {/* Emoji button */}
        <button
          id="emoji-btn"
          onClick={() => setShowEmoji((v) => !v)}
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
          style={{
            background: showEmoji ? 'var(--green-ghost)' : 'transparent',
            border: 'var(--border-glass)',
            fontSize: 18,
            color: showEmoji ? 'var(--green-primary)' : 'var(--text-dim)',
          }}
          aria-label="Toggle emoji picker"
        >
          😊
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id="message-input"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          onKeyDown={handleKeyDown}
          placeholder="TYPE SECURE MESSAGE..."
          rows={1}
          disabled={disabled}
          className="agent-input flex-1 px-3 py-2.5 rounded-xl resize-none"
          style={{
            minHeight: 42,
            maxHeight: 120,
            lineHeight: 1.5,
            fontSize: 14,
          }}
        />

        {/* Send button */}
        <motion.button
          id="send-btn"
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
          style={{
            background: text.trim() && !disabled
              ? 'var(--green-ghost)'
              : 'transparent',
            border: `1px solid ${text.trim() && !disabled ? 'var(--green-border-strong)' : 'transparent'}`,
            boxShadow: text.trim() && !disabled ? 'var(--glow-sm)' : 'none',
          }}
          aria-label="Send message"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              color: text.trim() && !disabled ? 'var(--green-primary)' : 'var(--text-dim)',
              transform: 'rotate(90deg)',
              filter: text.trim() && !disabled ? 'drop-shadow(0 0 4px var(--green-primary))' : 'none',
            }}
          >
            <path
              d="M12 19V5M5 12l7-7 7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
