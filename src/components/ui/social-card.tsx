"use client";

import { cn } from "@/lib/utils";
import {
  Heart,
  MessageCircle,
  Repeat,
  Send,
  MoreHorizontal,
  Link as LinkIcon,
} from "lucide-react";
import { useState } from "react";

interface SocialCardProps {
  author?: {
    name?: string;
    username?: string;
    avatar?: string;
    timeAgo?: string;
  };
  content?: {
    text?: string;
    image?: string;
    link?: {
      title?: string;
      description?: string;
      icon?: React.ReactNode;
    };
  };
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
  };
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onMore?: () => void;
  className?: string;
  themeColor?: string;
}

export function SocialCard({
  author,
  content,
  engagement,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onMore,
  className,
  themeColor
}: SocialCardProps) {
  const [isLiked, setIsLiked] = useState(engagement?.isLiked ?? false);
  const [likes, setLikes] = useState(engagement?.likes ?? 0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.();
  };

  return (
    <div
      className={cn(
        "w-full max-w-2xl mx-auto",
        "bg-[#0a0a0a] sm:bg-[#111111]",
        "border-b border-white/10 sm:border sm:rounded-3xl",
        "py-4 sm:p-5 sm:mb-4 transition-colors",
        className
      )}
      style={{
        boxShadow: themeColor ? `0 4px 30px -10px ${themeColor}20` : undefined
      }}
    >
      <div className="flex gap-3 px-4 sm:px-0">
        {/* Left Column: Avatar & Thread Line */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative">
            <img
              src={author?.avatar}
              alt={author?.name}
              className="w-10 h-10 rounded-full object-cover bg-neutral-800 border border-white/10"
            />
            {/* Optional badge indicator based on themeColor */}
            {themeColor && (
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#111111]"
                style={{ backgroundColor: themeColor }}
              />
            )}
          </div>
          {/* Thread line (only visible if we had children, but we'll add a subtle one for styling) */}
          <div className="w-[1.5px] grow bg-white/10 mt-3 rounded-full hidden sm:block" />
        </div>

        {/* Right Column: Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-baseline gap-2 truncate">
              <h3 className="text-[15px] font-semibold text-neutral-100 truncate">
                {author?.name}
              </h3>
              <span className="text-sm text-neutral-500 shrink-0">
                {author?.timeAgo || "2h"}
              </span>
            </div>
            <button
              type="button"
              onClick={onMore}
              className="p-2 -mr-2 hover:bg-white/5 rounded-full transition-colors shrink-0 group"
            >
              <MoreHorizontal className="w-5 h-5 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
            </button>
          </div>

          {/* Text Content */}
          {content?.text && (
            <p className="text-[15px] text-neutral-200 leading-relaxed whitespace-pre-wrap mb-3 pr-2">
              {content.text}
            </p>
          )}

          {/* Image Content */}
          {content?.image && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-white/10 mr-2 bg-neutral-900/50">
              <img
                src={content.image}
                alt="Post image"
                className="w-full h-auto object-cover max-h-[500px]"
                loading="lazy"
              />
            </div>
          )}

          {/* Link preview */}
          {content?.link && (
            <div className="mb-3 rounded-2xl border border-white/10 overflow-hidden mr-2">
              <div className="p-4 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/10 rounded-xl">
                    {content.link.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-200">
                      {content.link.title}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                      {content.link.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Engagement Actions */}
          <div className="flex items-center gap-1 mt-1 -ml-2">
            <button
              type="button"
              onClick={handleLike}
              className="flex items-center gap-1.5 p-2 rounded-full hover:bg-white/5 text-neutral-500 transition-colors group"
            >
              <Heart
                className={cn(
                  "w-[18px] h-[18px] transition-all",
                  isLiked ? "fill-rose-500 text-rose-500" : "group-hover:text-neutral-300"
                )}
              />
              {likes > 0 && (
                <span className={cn(
                  "text-xs font-medium",
                  isLiked ? "text-rose-500" : "group-hover:text-neutral-300"
                )}>
                  {likes}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onComment}
              className="flex items-center gap-1.5 p-2 rounded-full hover:bg-white/5 text-neutral-500 transition-colors group"
            >
              <MessageCircle className="w-[18px] h-[18px] group-hover:text-neutral-300" />
              {engagement?.comments ? (
                <span className="text-xs font-medium group-hover:text-neutral-300">
                  {engagement.comments}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={onShare}
              className="flex items-center gap-1.5 p-2 rounded-full hover:bg-white/5 text-neutral-500 transition-colors group"
            >
              <Repeat className="w-[18px] h-[18px] group-hover:text-neutral-300" />
              {engagement?.shares ? (
                <span className="text-xs font-medium group-hover:text-neutral-300">
                  {engagement.shares}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={onShare}
              className="flex items-center gap-1.5 p-2 rounded-full hover:bg-white/5 text-neutral-500 transition-colors group"
            >
              <Send className="w-[18px] h-[18px] group-hover:text-neutral-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

