"use client";

import {
  Send,
  Heart,
  Bookmark,
  MessageCircle,
  MoreHorizontal
} from "lucide-react";
import { useState } from "react";

interface PostCardProps {
  author?: {
    name?: string;
    username?: string;
    avatar?: string;
    timeAgo?: string;
  };
  content?: {
    text?: string;
    image?: string;
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

export const PostCard: React.FC<PostCardProps> = ({
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
}) => {
  const [liked, setLiked] = useState(engagement?.isLiked || false);
  const [bookmarked, setBookmarked] = useState(engagement?.isBookmarked || false);
  const [likesCount, setLikesCount] = useState(engagement?.likes || 0);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikesCount((prev) => liked ? prev - 1 : prev + 1);
    onLike?.();
  };

  const handleBookmark = () => {
    setBookmarked((prev) => !prev);
    onBookmark?.();
  };

  return (
    <div
      className={`w-full max-w-2xl mx-auto rounded-[1.5rem] bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:border-white/20 ${className || ''}`}
    >
      <div className="p-5 sm:p-6 pb-4 sm:pb-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 card-header">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={
                  author?.avatar ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60"
                }
                alt={author?.name || "Author"}
                className="rounded-full object-cover w-11 h-11 border-2 border-transparent transition-all duration-300"
                style={{ borderColor: themeColor || 'transparent' }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-neutral-100 font-semibold text-[15px] leading-none hover:underline cursor-pointer">
                  {author?.name || "HextaStudio"}
                </h3>
                <span className="text-neutral-500 text-[13px] leading-none flex items-center gap-1">
                  <span>·</span>
                  <span>{author?.timeAgo || "7h"}</span>
                </span>
              </div>
              <span className="text-neutral-400 text-[14px] mt-1 leading-none hover:text-neutral-300 cursor-pointer transition-colors">
                @{author?.username || "HextaStudio"}
              </span>
            </div>
          </div>
          <button 
            onClick={onMore}
            className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 flex flex-col gap-4">
          {content?.text && (
            <p className="whitespace-pre-wrap text-neutral-200 text-[15px] sm:text-[16px] leading-relaxed">
              {content.text}
            </p>
          )}
          {content?.image && (
            <div className="relative rounded-[1.25rem] overflow-hidden border border-white/5 bg-white/5 group mt-1">
              <img
                src={content.image}
                alt="Post content"
                className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                style={{ maxHeight: '600px' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between border-t border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-1">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex items-center gap-2 rounded-full px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-300 hover:bg-white/10 group"
            style={{ color: liked ? themeColor || "#ef4444" : "#a3a3a3" }}
          >
            <Heart 
              className={`w-[20px] h-[20px] transition-transform duration-300 group-hover:scale-110 group-active:scale-95 ${liked ? "fill-current drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`} 
            />
            <span className={`font-medium text-[14px] ${liked ? "text-white" : ""}`}>
              {likesCount > 0 ? likesCount : 'Like'}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={onComment}
            className="flex items-center gap-2 rounded-full px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-300 hover:bg-white/10 group text-neutral-400 hover:text-white"
          >
            <MessageCircle className="w-[20px] h-[20px] transition-transform duration-300 group-hover:scale-110 group-active:scale-95" />
            <span className="font-medium text-[14px]">
              {engagement?.comments || 'Comment'}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={onShare}
            className="flex items-center gap-2 rounded-full px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-300 hover:bg-white/10 group text-neutral-400 hover:text-white"
          >
            <Send className="w-[20px] h-[20px] transition-transform duration-300 group-hover:scale-110 group-active:scale-95 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]" />
            <span className="font-medium text-[14px] hidden sm:inline">
              {engagement?.shares || 'Share'}
            </span>
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={handleBookmark}
          className="flex items-center gap-2 rounded-full px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-300 hover:bg-white/10 group"
          style={{ color: bookmarked ? themeColor || "#3b82f6" : "#a3a3a3" }}
        >
          <Bookmark 
            className={`w-[20px] h-[20px] transition-transform duration-300 group-hover:scale-110 group-active:scale-95 ${bookmarked ? "fill-current drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`} 
          />
          <span className={`font-medium text-[14px] hidden sm:inline ${bookmarked ? "text-white" : ""}`}>
            {bookmarked ? "Saved" : "Save"}
          </span>
        </button>
      </div>
    </div>
  );
};
