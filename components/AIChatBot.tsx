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
                    <div className={`text-sm leading-relaxed prose prose-invert prose-sm max-w-none ${isLoading && m.id === messages[messages.length - 1].id ? '[&>p:last-child]:inline' : ''}`}>
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
                        <span className="animate-pulse inline-block ml-1">▌</span>
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
