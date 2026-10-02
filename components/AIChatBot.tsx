"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, StopCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';

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
  }, [messages, isLoading, userHasScrolled]);

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
                  
                  <div className="mt-6 flex flex-col gap-2">
                    <button onClick={() => handleSuggestedClick("Tell me about Alpine Explorer")} className="text-xs px-3 py-2 border border-white/10 rounded-full hover:bg-white/5 transition-colors text-left">
                      Tell me about Alpine Explorer
                    </button>
                    <button onClick={() => handleSuggestedClick("What did Sagar build at IBM?")} className="text-xs px-3 py-2 border border-white/10 rounded-full hover:bg-white/5 transition-colors text-left">
                      What did Sagar build at IBM?
                    </button>
                    <button onClick={() => handleSuggestedClick("What technologies does Sagar use?")} className="text-xs px-3 py-2 border border-white/10 rounded-full hover:bg-white/5 transition-colors text-left">
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
                    <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                      {m.parts?.map((part, i) => {
                        if (part.type === 'text') {
                          return m.role === 'user' ? (
                            <span key={i}>{part.text}</span>
                          ) : (
                            <ReactMarkdown key={i}>{part.text}</ReactMarkdown>
                          );
                        }
                        return null;
                      })}
                      {isLoading && m.id === messages[messages.length - 1].id && m.role === 'assistant' && (
                        <span className="inline-block w-1.5 h-3 ml-1 bg-gray-400 animate-pulse align-middle" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="backdrop-blur-md bg-white/10 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                    <span className="text-xs text-gray-400 mr-2">Thinking</span>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
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
            <div className="p-4 bg-transparent border-t border-white/10 relative">
              {isLoading && status === "streaming" && (
                <button
                  onClick={() => stop()}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/80 border border-white/20 text-xs px-3 py-1.5 rounded-full text-gray-300 hover:text-white hover:bg-black transition-colors"
                >
                  <StopCircle className="w-3 h-3" /> Stop generating
                </button>
              )}
              <form onSubmit={handleFormSubmit} className="flex gap-2">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-black/50 border border-white/10 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-rose-500 transition-all dark:text-white"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="w-10 h-10 rounded-full bg-red-600 dark:bg-rose-500 text-white dark:text-gray-900 flex items-center justify-center hover:bg-red-700 dark:hover:bg-rose-600 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0"
                >
                  <Send className="w-4 h-4 -ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
