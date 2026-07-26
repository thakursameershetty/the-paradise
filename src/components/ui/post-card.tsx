"use client";

import {
  Send,
  Heart,
  Bookmark,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
  onBookmark,
  className,
  themeColor
}) => {
  const [liked, setLiked] = useState(engagement?.isLiked || false);
  const [bookmarked, setBookmarked] = useState(engagement?.isBookmarked || false);
  const [likes, setLikes] = useState(engagement?.likes || 0);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    onLike?.();
  };

  const handleBookmark = () => {
    setBookmarked((prev) => !prev);
    onBookmark?.();
  };

  return (
    <div
      className={cn(
        "m-4 max-w-[30rem] w-full mx-auto rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl p-5 sm:p-6",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 card-header">
        <div className="flex items-center gap-4">
          <img
            src={
              author?.avatar ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60"
            }
            alt={author?.name || "Author"}
            width={40}
            height={40}
            className="rounded-full object-cover w-10 h-10 border border-white/10"
          />
          <div>
            <h3 className="flex flex-col text-neutral-100 font-medium">
              {author?.name || "HextaStudio"}
              <span className="flex items-center gap-1.5 opacity-70 text-sm font-normal text-neutral-400">
                <span>@{author?.username || "HextaStudio"}</span>
                <span>·</span>
                <span>{author?.timeAgo || "7h"}</span>
              </span>
            </h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-5 flex flex-col gap-4">
        {content?.text && (
          <p className="whitespace-pre-wrap text-neutral-200 text-[15px] leading-relaxed px-1">
            {content.text}
          </p>
        )}
        {content?.image && (
          <img
            src={content.image}
            alt="Post content"
            className="max-w-full rounded-2xl object-cover border border-white/10 w-full"
          />
        )}
      </div>

      {/* Actions */}
      <div className="mt-5 flex justify-between gap-2 border-t border-white/5 pt-4">
        <button
          onClick={handleLike}
          className="flex grow items-center justify-center gap-2 rounded-xl px-2 py-2 transition hover:bg-white/5"
          style={{ color: liked ? themeColor || "#ef4444" : "#a3a3a3" }}
        >
          <Heart className={cn("w-5 h-5", liked && "fill-current")} />
          <span className="inline font-medium text-[14px] transition max-sm:hidden">
            {liked ? "Liked" : "Like"}
          </span>
        </button>

        <button
          onClick={handleBookmark}
          className="flex grow items-center justify-center gap-2 rounded-xl px-2 py-2 transition hover:bg-white/5"
          style={{ color: bookmarked ? themeColor || "#3b82f6" : "#a3a3a3" }}
        >
          <Bookmark className={cn("w-5 h-5", bookmarked && "fill-current")} />
          <span className="inline font-medium text-[14px] transition max-sm:hidden">
            {bookmarked ? "Saved" : "Save"}
          </span>
        </button>

        <button className="flex grow items-center justify-center gap-2 rounded-xl px-2 py-2 transition hover:bg-white/5 text-[#a3a3a3] hover:text-white">
          <Send className="w-5 h-5" />
          <span className="inline font-medium text-[14px] transition max-sm:hidden">
            Share
          </span>
        </button>
      </div>
    </div>
  );
};
