"use client";

import * as React from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSend:   (text: string) => Promise<void>;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text,    setText]    = React.useState("");
  const [sending, setSending] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  };

  const resetHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    autoResize(e.target);
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending || disabled) return;

    const saved = text;
    setText("");
    resetHeight();
    setSending(true);

    try {
      await onSend(trimmed);
    } catch {
      setText(saved);
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty    = text.trim().length === 0;
  const isDisabled = disabled || sending;

  return (
    /* Outer bar — lifts off the chat window */
    <div
      className={cn(
        "px-4 py-3",
        "bg-[--bg]",
        "shadow-[0_-1px_0_0_var(--border)]",
      )}
    >
      {/* Inner pill row */}
      <div
        className={cn(
          "flex items-end gap-1 rounded-2xl",
          "bg-[--bg-muted] ring-1 ring-[--border]",
          "focus-within:ring-2 focus-within:ring-brand-500/30",
          "transition-shadow duration-150",
          "px-2 py-1.5",
        )}
      >
        {/* Attachment */}
        <IconBtn aria-label="Attach file" disabled={isDisabled}>
          <Paperclip className="h-5 w-5" />
        </IconBtn>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Message…"
          rows={1}
          disabled={isDisabled}
          aria-label="Message text"
          className={cn(
            "flex-1 resize-none bg-transparent",
            "py-1.5 text-sm text-[--text-1] placeholder:text-[--text-4]",
            "focus:outline-none",
            "min-h-[32px] max-h-[128px] overflow-y-auto",
            "disabled:opacity-50",
            "self-end",
          )}
        />

        {/* Emoji placeholder */}
        <IconBtn aria-label="Add emoji" disabled={isDisabled}>
          <Smile className="h-5 w-5" />
        </IconBtn>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={isEmpty || isDisabled}
          aria-label="Send message"
          className={cn(
            "flex-none flex items-center justify-center",
            "h-8 w-8 rounded-xl mb-0.5",
            "transition-all duration-150",
            isEmpty || isDisabled
              ? "bg-transparent text-[--text-4] cursor-not-allowed"
              : [
                "bg-brand-gradient text-white shadow-sm",
                "hover:scale-105 hover:shadow-md",
                "active:scale-95",
              ],
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {/* Hint */}
      <p className="mt-1.5 text-center text-[10px] text-[--text-4] select-none">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}

/* ── Shared icon button ─────────────────────────────────────────────── */

function IconBtn({
  children,
  disabled,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "flex-none p-1.5 mb-0.5 rounded-xl text-[--text-4]",
        "hover:bg-[--bg] hover:text-[--text-2]",
        "transition-colors duration-150",
        "disabled:opacity-40 disabled:pointer-events-none",
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
