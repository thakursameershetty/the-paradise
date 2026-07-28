"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

const animations = {
  icon: {
    initial: { scale: 1, rotate: 0 },
    tapActive: { scale: 0.85, rotate: -10 },
    tapCompleted: { scale: 1, rotate: 0 },
  },
  burst: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: [0, 1.4, 1], opacity: [0, 0.4, 0] },
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
  particles: (index: number) => {
    const angle = (index / 5) * (2 * Math.PI);
    const radius = 18 + Math.random() * 8;
    const scale = 0.8 + Math.random() * 0.4;
    const duration = 0.6 + Math.random() * 0.1;

    return {
      initial: { scale: 0, opacity: 0.3, x: 0, y: 0 },
      animate: {
        scale: [0, scale, 0],
        opacity: [0.3, 0.8, 0],
        x: [0, Math.cos(angle) * radius],
        y: [0, Math.sin(angle) * radius * 0.75],
      },
      transition: { duration, delay: index * 0.04, ease: "easeOut" as const },
    };
  },
};

interface UpvoteIconButtonProps {
  initialUpvoted?: boolean;
  onUpvote?: (isUpvoted: boolean) => boolean | Promise<boolean> | void;
  count?: number;
}

export function UpvoteIconButton({ initialUpvoted = false, onUpvote, count = 0 }: UpvoteIconButtonProps) {
  const [isSaved, setIsSaved] = React.useState(initialUpvoted);
  const [localCount, setLocalCount] = React.useState(count);

  React.useEffect(() => {
    setIsSaved(initialUpvoted);
  }, [initialUpvoted]);

  React.useEffect(() => {
    setLocalCount(count);
  }, [count]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if wrapped in a Link
    e.stopPropagation();

    const newState = !isSaved;

    if (onUpvote) {
      const allowed = await onUpvote(newState);
      if (allowed === false) return; // Prevent upvote if rejected (e.g. session modal opened)
    }

    setIsSaved(newState);
    setLocalCount(prev => newState ? prev + 1 : prev - 1);
  };

  return (
    <div className="relative flex items-center group">
      <button
        onClick={handleClick}
        aria-pressed={isSaved}
        className="pointer-events-auto flex items-center gap-1.5 hover:bg-red-500/10 rounded-full py-1.5 px-2 transition-colors bg-transparent border-none cursor-pointer outline-none"
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isSaved ? 1.1 : 1 }}
          whileTap={
            isSaved ? animations.icon.tapCompleted : animations.icon.tapActive
          }
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="relative flex items-center justify-center w-5 h-5"
        >
          <Heart className="absolute opacity-60 text-gray-500 group-hover:text-red-500 transition-colors w-5 h-5" />

          <Heart
            className={`absolute text-red-500 transition-all duration-300 w-5 h-5 ${isSaved ? 'fill-red-500 opacity-100' : 'fill-transparent opacity-0'}`}
            aria-hidden="true"
          />

          <AnimatePresence>
            {isSaved && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(239,68,68,0.4) 0%, rgba(239,68,68,0) 80%)",
                }}
                {...animations.burst}
              />
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {isSaved && (
            <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-red-500"
                  style={{
                    width: `${4 + Math.random() * 2}px`,
                    height: `${4 + Math.random() * 2}px`,
                    filter: "blur(1px)",
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={animations.particles(i).initial}
                  animate={animations.particles(i).animate}
                  transition={animations.particles(i).transition}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <span className={`text-sm font-bold ${isSaved ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'} transition-colors`}>
          {localCount}
        </span>
      </button>
    </div >
  );
}
