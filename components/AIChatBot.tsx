"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const chatState = useChat({
    onError: (err) => {
      console.error("Chat error:", err);
    }
  });
  
  const { messages, sendMessage, status, error } = chatState;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isLoading = status === "streaming" || status === "submitted";

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    sendMessage({ text: inputValue });
    setInputValue("");
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-red-600 dark:bg-rose-500 text-white dark:text-gray-900 rounded-full shadow-2xl hover:shadow-red-500/30 transition-all ${isOpen ? 'hidden' : 'flex'}`}
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
            className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-[400px] h-[600px] max-h-[80vh] backdrop-blur-xl bg-black/40 rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-red-600 dark:bg-rose-500 p-4 flex items-center justify-between text-white dark:text-gray-900">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">AI Assistant</h3>
                  <p className="text-xs opacity-90">Ask me about Sagar&apos;s work!</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Hi! I can answer questions about Sagar&apos;s experience, projects, and skills.</p>
                  <p className="text-sm mt-2">Try asking: "What did Sagar build at IBM?"</p>
                </div>
              )}
              
              {messages.map((m) => (
                <motion.div 
                  key={m.id} 
                  initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: m.role === 'user' ? 0.3 : 0.6, ease: "easeOut" }}
                  className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-red-900/30 text-red-500 dark:text-rose-400' : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    m.role === 'user' 
                      ? 'bg-red-600 text-white dark:bg-rose-500 dark:text-gray-900 rounded-tr-sm' 
                      : 'backdrop-blur-md bg-white/10 text-white border border-white/5 rounded-tl-sm shadow-sm'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {m.parts?.map((part, i) => {
                        if (part.type === 'text') {
                          return <span key={i}>{part.text}</span>;
                        }
                        return null;
                      })}
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
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  </div>
                </div>
              )}
              
              {error && (
                <div className="text-center text-sm text-red-500 mt-2">
                  Failed to get response. Is your API key correct?
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-transparent border-t border-white/10">
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
                  className="w-10 h-10 rounded-full bg-red-600 dark:bg-rose-500 text-white dark:text-gray-900 flex items-center justify-center hover:bg-red-700 dark:hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 -ml-0.5" />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
