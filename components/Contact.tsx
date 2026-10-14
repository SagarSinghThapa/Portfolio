"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, MapPin } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Your message has been sent successfully!",
        });
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus({
          type: "error",
          message: result.error || "Failed to send message.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative z-10 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Let&apos;s Connect</h2>
          <div className="w-20 h-1.5 bg-red-600 dark:bg-rose-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              I am currently open to new opportunities, collaborations, and exciting projects in Data Science and AI. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center text-red-500 dark:text-rose-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                  <a href="mailto:sagarsinghthapa639@gmail.com" className="hover:text-red-500 dark:hover:text-rose-400 transition-colors">
                    sagarsinghthapa639@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center text-red-500 dark:text-rose-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Location</p>
                  <p>Dehradun, India (UPES)</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="backdrop-blur-md bg-black/20 p-8 rounded-2xl border border-white/5 shadow-sm">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      required
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-rose-500 focus:border-transparent outline-none transition-all dark:text-white"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      required
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-rose-500 focus:border-transparent outline-none transition-all dark:text-white"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject"
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-rose-500 focus:border-transparent outline-none transition-all dark:text-white"
                    placeholder="Project Inquiry"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-rose-500 focus:border-transparent outline-none transition-all resize-none dark:text-white"
                    placeholder="Hello, I'd like to talk about..."
                  />
                </div>
                
                <AnimatePresence>
                  {status.message && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-4 rounded-lg text-sm font-medium ${status.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}
                    >
                      {status.message}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white dark:text-gray-900 font-bold py-4 px-8 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
