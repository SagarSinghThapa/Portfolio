"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/#about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Experience', href: '/experience' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-black/20 backdrop-blur-md z-50 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">
              Sagar
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium text-gray-300 hover:text-red-500 dark:hover:text-rose-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <a 
              href="/Sagar_Singh_Thapa_Resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium px-5 py-2 rounded-full border border-red-500/30 bg-red-900/20 text-red-100 hover:bg-red-600/40 hover:text-white transition-all shadow-[0_0_15px_rgba(220,38,38,0.1)] hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] focus:ring-2 focus:ring-red-500 outline-none"
            >
              Resume
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 backdrop-blur-xl bg-black/80 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-white/10">
                <a 
                  href="/Sagar_Singh_Thapa_Resume.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-red-500 dark:text-rose-400 hover:bg-red-900/20 transition-colors"
                >
                  Resume
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
