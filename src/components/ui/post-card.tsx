"use client";

import {
  Send,
  Heart,
  Bookmark,
  MessageCircle,
  MoreHorizontal
} from "lucide-react";
import { Facehash } from "facehash";
import { useState } from "react";
import { LikeButton } from "@/components/ui/like-button";

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
      className={`w-full max-w-2xl mx-auto overflow-hidden border border-white/10 bg-[#0a0a0a]/80 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] ${className || ""}`}
      style={{ borderRadius: "1.5rem" }}
    >
      {/* Header + text + image all share ONE horizontal padding value,
          set inline so it can never be dropped by a purge/JIT issue. */}
      <div style={{ padding: "1.25rem 1.25rem 0 1.25rem" }}>
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="h-11 w-11 rounded-full overflow-hidden border-2 flex-shrink-0"
                style={{
                  borderColor: themeColor || "transparent",
                  transition: "border-color 300ms ease"
                }}
              >
                <Facehash name={author?.name || "Admin"} size={44} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="cursor-pointer text-[15px] font-semibold leading-none text-neutral-100 hover:underline">
                    {author?.name || "HextaStudio"}
                  </h3>
                  <span className="flex items-center gap-1 text-[13px] leading-none text-neutral-500">
                    <span>·</span>
                    <span>{author?.timeAgo || "7h"}</span>
                  </span>
                </div>
                <span className="mt-1 cursor-pointer text-[14px] leading-none text-neutral-400 transition-colors hover:text-neutral-300">
                  @{author?.username || "HextaStudio"}
                </span>
              </div>
            </div>
            <button
              onClick={onMore}
              className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          {/* Text */}
          {content?.text && (
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-neutral-200 sm:text-[16px]">
              {content.text}
            </p>
          )}
        </div>
      </div>

      {/* Image gets the SAME horizontal padding as the text above it,
          plus its own bottom padding, and an explicit radius. This is
          the block that was bleeding edge-to-edge before. */}
      {content?.image && (
        <div style={{ padding: "1rem 1.25rem 1.25rem 1.25rem" }}>
          <div
            className="group relative overflow-hidden border border-white/5 bg-white/5"
            style={{ borderRadius: "1.25rem" }}
          >
            <img
              src={content.image}
              alt="Post content"
              className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              style={{ maxHeight: "600px", display: "block" }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </div>
      )}

      {/* Actions — all four buttons are direct children of one justify-between
          row so spacing is even across the whole width (no lopsided cluster).
          Horizontal padding here is deliberately >= the card's corner radius
          (1.5rem) so the outer edges never get clipped by overflow-hidden. */}
      <div
        className="flex items-center justify-between border-t border-white/5 bg-white/[0.02]"
        style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "0.875rem", paddingBottom: "0.875rem" }}
      >
        <div className="flex items-center gap-6">
          <LikeButton
            liked={liked}
            onClick={handleLike}
            className="group flex items-center gap-1.5 rounded-full transition-all duration-300 hover:bg-white/10"
            style={{ 
              marginLeft: "-0.75rem",
              paddingLeft: "1.25rem",
              paddingRight: "1.25rem",
              paddingTop: "0.625rem",
              paddingBottom: "0.625rem",
              color: liked ? themeColor || "#ef4444" : "#a3a3a3" 
            }}
          >
            <Heart
              className={`h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110 group-active:scale-95 ${liked ? "fill-current drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""
                }`}
            />
            {/* Mobile: number only if > 0. Desktop: number or "Like" label */}
            {likesCount > 0 ? (
              <span 
                className={`text-[13px] font-medium ${liked ? "text-white" : ""}`}
                style={{ minWidth: "30px", display: "inline-block" }}
              >
                {likesCount}
              </span>
            ) : (
              <span 
                className={`hidden text-[13px] font-medium sm:inline ${liked ? "text-white" : ""}`}
                style={{ minWidth: "30px", display: "inline-block" }}
              >
                Like
              </span>
            )}
          </LikeButton>

          <button
            onClick={onComment}
            className="group flex items-center gap-1.5 rounded-full text-neutral-400 transition-all duration-300 hover:bg-white/10 hover:text-white"
            style={{ paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "0.625rem", paddingBottom: "0.625rem" }}
          >
            <MessageCircle className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110 group-active:scale-95" />
            {(engagement?.comments ?? 0) > 0 ? (
              <span 
                className="text-[13px] font-medium"
                style={{ minWidth: "60px", display: "inline-block" }}
              >
                {engagement!.comments}
              </span>
            ) : (
              <span 
                className="hidden text-[13px] font-medium sm:inline"
                style={{ minWidth: "60px", display: "inline-block" }}
              >
                Comment
              </span>
            )}
          </button>

          <button
            onClick={onShare}
            className="group flex items-center gap-1.5 rounded-full text-neutral-400 transition-all duration-300 hover:bg-white/10 hover:text-white"
            style={{ paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "0.625rem", paddingBottom: "0.625rem" }}
          >
            <Send className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:scale-110 group-active:scale-95" />
            {(engagement?.shares ?? 0) > 0 ? (
              <span 
                className="text-[13px] font-medium"
                style={{ minWidth: "40px", display: "inline-block" }}
              >
                {engagement!.shares}
              </span>
            ) : (
              <span 
                className="hidden text-[13px] font-medium sm:inline"
                style={{ minWidth: "40px", display: "inline-block" }}
              >
                Share
              </span>
            )}
          </button>
        </div>

        <button
          onClick={handleBookmark}
          className="group flex items-center gap-1.5 rounded-full transition-all duration-300 hover:bg-white/10"
          style={{ 
            marginRight: "-0.75rem",
            paddingLeft: "1.25rem",
            paddingRight: "1.25rem",
            paddingTop: "0.625rem",
            paddingBottom: "0.625rem",
            color: bookmarked ? themeColor || "#3b82f6" : "#a3a3a3" 
          }}
        >
          <Bookmark
            className={`h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110 group-active:scale-95 ${bookmarked ? "fill-current drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""
              }`}
          />
          {/* Save has no count — hide label on mobile entirely */}
          <span 
            className={`hidden text-[13px] font-medium sm:inline ${bookmarked ? "text-white" : ""}`}
            style={{ minWidth: "40px", display: "inline-block" }}
          >
            {bookmarked ? "Saved" : "Save"}
          </span>
        </button>
      </div>
    </div>
  );
};
