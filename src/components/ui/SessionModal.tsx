"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facehash } from "facehash";
import { useSession } from "@/hooks/useSession";

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (name: string) => void;
  message?: string;
}

export function SessionModal({ isOpen, onClose, onSuccess, message }: SessionModalProps) {
  const { login } = useSession();
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 3) {
      login(name.trim());
      onSuccess?.(name.trim());
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#1c1c1e] border border-[#2c2c2e] shadow-2xl rounded-2xl p-6 overflow-hidden backdrop-blur-xl text-white"
          >
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl text-white mb-2">Identify Yourself</h2>
              <p className="text-sm text-gray-400">
                {message || "Enter a username to join the discussion."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full border border-gray-800 bg-[#0a0a0c] shadow-inner overflow-hidden flex items-center justify-center">
                  {name.trim() ? (
                    <Facehash name={name} size={96} enableBlink={true} />
                  ) : (
                    <div className="text-gray-500 opacity-50">?</div>
                  )}
                </div>
                <div className="w-full">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter username (min 3 chars)"
                    className="w-full bg-[#0a0a0c] border border-gray-800 rounded-lg px-4 py-3 text-center text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/50 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  type="button" 
                  className="flex-1 py-2.5 rounded-md border border-gray-700 hover:bg-gray-800 transition-colors" 
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-md bg-white text-black font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={name.trim().length < 3}
                >
                  Join
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
