"use client";

import { cn } from "@/lib/utils";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
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
  const [isBookmarked, setIsBookmarked] = useState(engagement?.isBookmarked ?? false);
  const [likes, setLikes] = useState(engagement?.likes ?? 0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.();
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.();
  };

  return (
    <div
      className={cn(
        "w-full max-w-2xl mx-auto",
        "bg-[#1a1a1a]",
        "border border-white/10",
        "rounded-3xl shadow-xl",
        className
      )}
      style={{
        borderLeft: themeColor ? `4px solid ${themeColor}` : undefined
      }}
    >
      <div className="divide-y divide-white/5">
        <div className="p-6">
          {/* Author section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={author?.avatar}
                alt={author?.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10 bg-black"
              />
              <div>
                <h3 className="text-sm font-medium text-white" style={{ fontFamily: 'Impact, sans-serif', letterSpacing: '1px' }}>
                  {author?.name}
                </h3>
                <p className="text-xs text-white/50">
                  @{author?.username} · {author?.timeAgo}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onMore}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-5 h-5 text-white/50" />
            </button>
          </div>

          {/* Content section */}
          <p className="text-white/80 mb-4 leading-relaxed whitespace-pre-wrap">
            {content?.text}
          </p>
          
          {content?.image && (
             <div className="mb-4 rounded-2xl overflow-hidden border border-white/10">
               <img src={content.image} alt="Post image" className="w-full h-auto object-cover" />
             </div>
          )}

          {/* Link preview */}
          {content?.link && (
            <div className="mb-4 rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-4 bg-black/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/10 rounded-xl">
                    {content.link.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">
                      {content.link.title}
                    </h4>
                    <p className="text-xs text-white/50">
                      {content.link.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Engagement section */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors",
                  isLiked
                    ? "text-rose-500"
                    : "text-white/50 hover:text-rose-500"
                )}
              >
                <Heart
                  className={cn(
                    "w-5 h-5 transition-all",
                    isLiked && "fill-current scale-110"
                  )}
                />
                <span>{likes}</span>
              </button>
              <button
                type="button"
                onClick={onComment}
                className="flex items-center gap-2 text-sm text-white/50 hover:text-blue-400 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{engagement?.comments || 0}</span>
              </button>
              <button
                type="button"
                onClick={onShare}
                className="flex items-center gap-2 text-sm text-white/50 hover:text-green-400 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>{engagement?.shares || 0}</span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleBookmark}
              className={cn(
                "p-2 rounded-full transition-all",
                isBookmarked 
                  ? "text-yellow-400 bg-yellow-400/10" 
                  : "text-white/50 hover:bg-white/10"
              )}
            >
              <Bookmark className={cn(
                "w-5 h-5 transition-transform",
                isBookmarked && "fill-current scale-110"
              )} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
