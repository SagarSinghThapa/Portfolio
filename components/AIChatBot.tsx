"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, StopCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';

// --- Markdown Safety Scanner ---
// Determines the furthest safe reveal position by tracking whether the
// cursor is currently inside an incomplete Markdown construct.
// Returns a position, NEVER modifies the text.
function findSafeRevealEnd(
  text: string,
  candidateEnd: number,
  isStreamDone: boolean
): number {
  // Fast path: if stream is done, the full Markdown is complete
  if (isStreamDone) return candidateEnd;
  if (candidateEnd <= 0) return 0;

  // Clamp
  const end = Math.min(candidateEnd, text.length);

  // Track construct state
  let insideFencedBlock = false;
  let fenceOpenPos = -1;
  let insideInlineCode = false;
  let inlineCodeOpenPos = -1;
  let insideBold = false;
  let boldOpenPos = -1;
  let insideItalic = false;
  let italicOpenPos = -1;
  let insideLink = false;
  let linkOpenPos = -1;

  let i = 0;
  while (i < end) {
    // 1. Fenced code blocks (``` at start of line or after newline)
    if (
      text.startsWith('```', i) &&
      (i === 0 || text[i - 1] === '\n')
    ) {
      if (!insideFencedBlock) {
        insideFencedBlock = true;
        fenceOpenPos = i;
        // Skip past the fence line
        const lineEnd = text.indexOf('\n', i + 3);
        i = lineEnd === -1 ? end : lineEnd + 1;
        continue;
      } else {
        insideFencedBlock = false;
        fenceOpenPos = -1;
        i += 3;
        continue;
      }
    }

    // Skip all other construct tracking if inside a fenced block
    if (insideFencedBlock) {
      i++;
      continue;
    }

    // 2. Inline code (single backtick, not triple)
    if (text[i] === '`' && !text.startsWith('```', i)) {
      if (!insideInlineCode) {
        insideInlineCode = true;
        inlineCodeOpenPos = i;
      } else {
        insideInlineCode = false;
        inlineCodeOpenPos = -1;
      }
      i++;
      continue;
    }

    // 3. Bold (**) — check before italic
    if (text.startsWith('**', i)) {
      if (!insideBold) {
        insideBold = true;
        boldOpenPos = i;
      } else {
        insideBold = false;
        boldOpenPos = -1;
      }
      i += 2;
      continue;
    }

    // 4. Italic (*) — single asterisk, not part of **
    if (
      text[i] === '*' &&
      !text.startsWith('**', i) &&
      (i === 0 || text[i - 1] !== '*') &&
      (i + 1 >= end || text[i + 1] !== '*')
    ) {
      if (!insideItalic) {
        insideItalic = true;
        italicOpenPos = i;
      } else {
        insideItalic = false;
        italicOpenPos = -1;
      }
      i++;
      continue;
    }

    // 5. Links [text](url)
    if (text[i] === '[' && !insideLink) {
      insideLink = true;
      linkOpenPos = i;
      i++;
      continue;
    }
    if (insideLink && text[i] === ')') {
      insideLink = false;
      linkOpenPos = -1;
      i++;
      continue;
    }

    i++;
  }

  // Determine the safe position based on what constructs are open
  if (insideFencedBlock && fenceOpenPos >= 0) {
    // Hold back entire fenced block
    return fenceOpenPos > 0 ? fenceOpenPos : 0;
  }
  if (insideInlineCode && inlineCodeOpenPos >= 0) {
    return inlineCodeOpenPos > 0 ? inlineCodeOpenPos : 0;
  }
  if (insideBold && boldOpenPos >= 0) {
    return boldOpenPos > 0 ? boldOpenPos : 0;
  }
  if (insideItalic && italicOpenPos >= 0) {
    return italicOpenPos > 0 ? italicOpenPos : 0;
  }
  if (insideLink && linkOpenPos >= 0) {
    return linkOpenPos > 0 ? linkOpenPos : 0;
  }

  // Check for list prefix at the very end (e.g., "- " with no content after)
  const lastNewline = text.lastIndexOf('\n', end - 1);
  const lineStart = lastNewline + 1;
  const trailingLine = text.slice(lineStart, end);
  if (/^(\d+\.\s*|- \s*|\* \s*)$/.test(trailingLine) && end < text.length) {
    // List marker with no content yet — hold back to before this line
    return lineStart > 0 ? lineStart : 0;
  }

  // Snap to nearest preceding whitespace boundary to avoid mid-word split
  if (end < text.length && end > 0 && text[end] !== ' ' && text[end] !== '\n') {
    let snapPos = end;
    while (snapPos > 0 && text[snapPos - 1] !== ' ' && text[snapPos - 1] !== '\n') {
      snapPos--;
    }
    // If snapping would take us back too far (>30 chars), just use end
    if (end - snapPos < 30 && snapPos > 0) {
      return snapPos;
    }
  }

  return end;
}

// Advance from a position forward by N word boundaries
function advanceByWords(text: string, from: number, wordCount: number): number {
  let pos = from;
  let words = 0;
  while (pos < text.length && words < wordCount) {
    // Skip whitespace
    while (pos < text.length && (text[pos] === ' ' || text[pos] === '\n' || text[pos] === '\r' || text[pos] === '\t')) {
      pos++;
    }
    // Skip word characters
    if (pos < text.length) {
      while (pos < text.length && text[pos] !== ' ' && text[pos] !== '\n' && text[pos] !== '\r' && text[pos] !== '\t') {
        pos++;
      }
      words++;
    }
  }
  return pos;
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const chatState = useChat({
    onError: (err) => {
      console.error("Chat error:", err);
    }
  });
  
  const { messages, sendMessage, status, error, stop } = chatState;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  
  const isLoading = status === "streaming" || status === "submitted";

  // --- Progressive Reveal State ---
  const [displayText, setDisplayText] = useState("");
  const revealedLengthRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Derive streamedText from the last assistant message (read-only, never modified)
  const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
  const isLastAssistant = lastMsg?.role === 'assistant';
  const streamedText = isLastAssistant
    ? (lastMsg.parts?.filter((p: { type: string }) => p.type === 'text')
        .map((p: { type: string; text?: string }) => p.text ?? '').join('') ?? '')
    : '';

  // Derive completion state
  const isRevealing = displayText.length < streamedText.length;
  const isFullyComplete = !isLoading && !isRevealing;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    sendMessage({ text: inputValue });
    setInputValue("");
    setUserHasScrolled(false);
  };

  const handleSuggestedClick = (text: string) => {
    sendMessage({ text });
    setUserHasScrolled(false);
  };

  // Auto-scroll to bottom of chat unless user has scrolled up
  useEffect(() => {
    if (messagesEndRef.current && !userHasScrolled) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, userHasScrolled, displayText]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    // If we are close to the bottom, resume auto-scroll
    if (scrollHeight - scrollTop - clientHeight < 50) {
      setUserHasScrolled(false);
    } else {
      setUserHasScrolled(true);
    }
  };

  // --- Reset reveal state when user sends a new message ---
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
      revealedLengthRef.current = 0;
      setDisplayText("");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [messages.length]);

  // --- Progressive Reveal Loop ---
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Nothing to reveal
    if (!streamedText || streamedText.length === 0) return;

    const isStreamDone = status !== "streaming" && status !== "submitted";

    // Already fully revealed and done
    if (revealedLengthRef.current >= streamedText.length && isStreamDone) {
      // Ensure displayText is the full text
      setDisplayText(streamedText);
      return;
    }

    // Select speed based on streaming state
    const intervalMs = isStreamDone ? 10 : 30;
    const wordsPerTick = isStreamDone ? 5 : 2;

    intervalRef.current = setInterval(() => {
      const currentPos = revealedLengthRef.current;
      
      // Already caught up to what's available
      if (currentPos >= streamedText.length) {
        if (isStreamDone) {
          setDisplayText(streamedText);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
        return;
      }

      // Find candidate position (advance by N words)
      const candidateEnd = Math.min(
        advanceByWords(streamedText, currentPos, wordsPerTick),
        streamedText.length
      );

      // Find the safe reveal position
      const safePos = findSafeRevealEnd(streamedText, candidateEnd, isStreamDone);

      if (safePos > currentPos) {
        revealedLengthRef.current = safePos;
        setDisplayText(streamedText.slice(0, safePos));
      }
      // If safePos === currentPos, skip this tick (incomplete construct blocking)

      // Check if fully caught up
      if (revealedLengthRef.current >= streamedText.length && isStreamDone) {
        setDisplayText(streamedText);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [streamedText, status]);

  // Determine if a message is the actively revealing assistant message
  const isActiveRevealMessage = useCallback((m: typeof messages[0]) => {
    return (
      m.role === 'assistant' &&
      m.id === lastMsg?.id &&
      (isLoading || isRevealing)
    );
  }, [lastMsg?.id, isLoading, isRevealing]);

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-[#0B0B0F]/90 backdrop-blur-md border border-white/10 text-gray-200 rounded-full shadow-2xl hover:bg-gray-800 transition-all ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-32px)] max-w-[460px] h-[700px] max-h-[calc(100dvh-32px)] backdrop-blur-xl bg-[#0B0B0F]/90 rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between text-white border-b border-white/10 bg-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight flex items-center gap-2">
                    Sagar AI
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  </h3>
                  <p className="text-xs text-[#A1A1AA]">Portfolio Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-[#A1A1AA] hover:text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent"
            >
              {messages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Hi! I can answer questions about Sagar&apos;s experience, projects, and skills.</p>
                  
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    <button onClick={() => handleSuggestedClick("Tell me about Alpine Explorer")} className="text-xs px-4 py-2 border border-white/10 bg-white/5 rounded-full hover:bg-white/10 hover:border-white/20 transition-all text-[#F5F5F7] shadow-sm">
                      Tell me about Alpine Explorer
                    </button>
                    <button onClick={() => handleSuggestedClick("What did Sagar build at IBM?")} className="text-xs px-4 py-2 border border-white/10 bg-white/5 rounded-full hover:bg-white/10 hover:border-white/20 transition-all text-[#F5F5F7] shadow-sm">
                      What did Sagar build at IBM?
                    </button>
                    <button onClick={() => handleSuggestedClick("What technologies does Sagar use?")} className="text-xs px-4 py-2 border border-white/10 bg-white/5 rounded-full hover:bg-white/10 hover:border-white/20 transition-all text-[#F5F5F7] shadow-sm">
                      What technologies does Sagar use?
                    </button>
                  </div>
                </div>
              )}
              
              {messages.map((m) => (
                <motion.div 
                  key={m.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: m.role === 'user' ? 0.2 : 0.4, ease: "easeOut" }}
                  className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-gray-800 text-gray-300' : 'bg-white/10 text-white'}`}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[85%] px-4 py-3 ${
                    m.role === 'user' 
                      ? 'bg-white/10 text-[#F5F5F7] rounded-2xl rounded-tr-sm' 
                      : 'text-[#F5F5F7] bg-transparent rounded-2xl rounded-tl-sm'
                  }`}>
                    <div className={`text-sm leading-relaxed prose prose-invert prose-sm max-w-none ${(isLoading || isRevealing) && m.id === lastMsg?.id ? '[&>p:last-child]:inline' : ''}`}>
                      {m.role === 'user' ? (
                        // User messages: render as-is
                        m.parts?.map((part, i) => {
                          if (part.type === 'text') {
                            return <span key={i}>{part.text}</span>;
                          }
                          return null;
                        })
                      ) : isActiveRevealMessage(m) ? (
                        // Last assistant message during active reveal: use displayText
                        <>
                          <ReactMarkdown>{displayText}</ReactMarkdown>
                          <span className="animate-pulse inline-block ml-1">▌</span>
                        </>
                      ) : (
                        // Historical/completed assistant messages: render full text
                        m.parts?.map((part, i) => {
                          if (part.type === 'text') {
                            return <ReactMarkdown key={i}>{part.text}</ReactMarkdown>;
                          }
                          return null;
                        })
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && status !== "streaming" && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5 px-4 py-3">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-2 h-2 bg-gray-500 rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-2 bg-gray-500 rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 bg-gray-500 rounded-full" />
                  </div>
                </div>
              )}
              
              {error && (
                <div className="text-center text-sm text-red-500 mt-2 bg-red-500/10 p-2 rounded-lg">
                  Sorry, I couldn't complete that response. Please try again.
                </div>
              )}
              
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-transparent relative">
              {isLoading && status === "streaming" && (
                <button
                  onClick={() => stop()}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#0B0B0F] border border-white/20 text-xs px-3 py-1.5 rounded-full text-gray-300 hover:text-white transition-colors shadow-lg"
                >
                  <StopCircle className="w-3 h-3" /> Stop generating
                </button>
              )}
              <form onSubmit={handleFormSubmit} className="relative flex items-center w-full">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Message Sagar AI..."
                  className="w-full bg-[#1A1A24]/80 border border-white/10 rounded-full pl-5 pr-12 py-3.5 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all text-[#F5F5F7] placeholder-gray-500"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-2 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
