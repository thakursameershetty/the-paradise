"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PostCard } from "@/components/ui/post-card";
import { PostCardSkeleton } from "@/components/ui/post-card-skeleton";
import { Send, Share, Check, MessageCircle, X, Trash2, ArrowLeft } from "lucide-react";
import styles from '@/app/explore/FeedView.module.css';
import { UpvoteIconButton } from "@/components/ui/upvote-icon-button";
import { Facehash } from "facehash";
import { useSession } from "@/hooks/useSession";
import { SessionModal } from "@/components/ui/SessionModal";

// Reusable button with hover effect (replaces Tailwind hover: pseudo classes)
function HoverBtn({
  onClick, children, baseColor = '#9ca3af', hoverColor = '#ffffff',
  hoverBg = 'rgba(255,255,255,0.08)', danger = false, style = {} as React.CSSProperties
}: {
  onClick?: () => void;
  children: React.ReactNode;
  baseColor?: string;
  hoverColor?: string;
  hoverBg?: string;
  danger?: boolean;
  style?: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        background: hovered ? (danger ? 'rgba(239,68,68,0.1)' : hoverBg) : 'none',
        color: hovered ? (danger ? '#ef4444' : hoverColor) : (danger ? '#9ca3af' : baseColor),
        border: 'none', borderRadius: '8px', cursor: 'pointer',
        padding: '5px 10px', fontSize: '12px', fontWeight: 500,
        transition: 'background 0.15s, color 0.15s',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function PostPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { username, isReady, hasUpvoted, toggleUpvote } = useSession();
  const [showSessionModal, setShowSessionModal] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string, name: string } | null>(null);
  const [expandedThreads, setExpandedThreads] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  // Try to load profile to get user colors for UI
  const [userColors, setUserColors] = useState<string[]>(['#f5c66d']);

  const loadData = async () => {
    if (!id) return;
    try {
      const [postRes, commentsRes] = await Promise.all([
        fetch(`/api/posts/${id}`),
        fetch(`/api/comments?postId=${id}`)
      ]);
      if (postRes.ok) setPost(await postRes.json());
      if (commentsRes.ok) setComments(await commentsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Attempt to load user colors from local storage
    if (typeof window !== 'undefined') {
      try {
        const profileStr = localStorage.getItem('paradiseProfile');
        if (profileStr) {
          const profile = JSON.parse(profileStr);
          if (profile.winner && profile.winner.colors) {
            setUserColors(profile.winner.colors);
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }, [id]);

  // Auto-focus comment input when navigated with ?focus=comments
  useEffect(() => {
    if (!loading && searchParams?.get('focus') === 'comments') {
      const el = document.getElementById('comment-input');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [loading, searchParams]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Update from Paradise",
          text: post?.content || "Check out this update!",
          url: shareUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handlePostComment = async () => {
    if (!username) {
      setShowSessionModal(true);
      return;
    }
    if (!commentText.trim()) return;

    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: id, author: username, text: commentText, parentId: replyingTo?.id })
      });

      if (replyingTo) {
        setExpandedThreads(prev => ({ ...prev, [replyingTo.id]: true }));
      }
      setReplyingTo(null);
      setCommentText("");
      loadData(); // reload
    } catch (e) {
      console.error("Failed to post comment", e);
    }
  };

  const handleCommentUpvote = async (commentId: string, isUpvoted: boolean) => {
    if (!username) {
      setShowSessionModal(true);
      return false;
    }
    toggleUpvote(commentId, isUpvoted);
    try {
      await fetch(`/api/comments/${commentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isUpvoted, username })
      });
      loadData();
      return true;
    } catch (e) {
      console.error("Failed to upvote", e);
      return false;
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!username) return;
    setCommentToDelete(commentId);
  };

  const confirmDeleteComment = async () => {
    if (!username || !commentToDelete) return;

    try {
      await fetch(`/api/comments/${commentToDelete}?author=${encodeURIComponent(username)}`, {
        method: "DELETE"
      });
      loadData();
      setCommentToDelete(null);
    } catch (e) {
      console.error("Failed to delete comment", e);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: '#000', color: '#fff',
        overflowY: 'auto', overflowX: 'hidden', display: 'block', width: '100%', position: 'relative',
      }}>
        {/* Background blobs */}
        <div className={styles.backgroundBlobs}>
          <div className={styles.blob1} />
          <div className={styles.blob2} />
          <div className={styles.blob3} />
        </div>
        {/* Floating Back Button skeleton */}
        <div style={{ position: 'fixed', top: '24px', left: '24px', zIndex: 50 }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        </div>
        {/* Content skeleton */}
        <div style={{ paddingTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '80px 16px 160px' }}>
          <PostCardSkeleton />
          {/* Comment skeletons */}
          {[1, 2].map(i => (
            <div key={i} style={{ width: '100%', maxWidth: '672px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px 16px', display: 'flex', gap: '12px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', flexShrink: 0, animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ width: '120px', height: '13px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div style={{ width: '100%', height: '13px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div style={{ width: '60%', height: '13px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center flex-col gap-4 text-white">
        <p>Post not found</p>
        <button onClick={() => router.back()} className="text-[#1DA1F2] hover:underline">Go back</button>
      </div>
    );
  }

  return (
    <>
      {/* Fixed Background Underlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: -1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(24px)'
      }} />

      <div style={{
        minHeight: '100vh',
        paddingBottom: '160px',
        color: '#ffffff',
        width: '100%',
      }}>
        {/* Background blobs — matching feed page */}
        <div className={styles.backgroundBlobs} style={{ position: 'fixed' }}>
          <div className={styles.blob1} />
          <div className={styles.blob2} />
          <div className={styles.blob3} />
        </div>
        <SessionModal
          isOpen={showSessionModal}
          onClose={() => setShowSessionModal(false)}
          message="Enter your username to interact with this post!"
        />

        {/* Floating Back Button */}
        <button onClick={() => router.back()} style={{
          position: 'fixed', top: '24px', left: '24px', zIndex: 50,
          width: '44px', height: '44px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)',
          color: 'white', cursor: 'pointer', transition: 'all 0.2s'
        }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ArrowLeft style={{ width: '20px', height: '20px' }} />
        </button>

        <div style={{
          width: '100%',
          maxWidth: '672px',
          margin: '0 auto',
          padding: '96px 16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}>

          {/* The Post itself */}
          <PostCard
            themeColor={userColors[0]}
            author={{
              name: post.authorName,
              username: post.authorUsername,
              avatar: post.authorAvatar,
              timeAgo: new Date(post.createdAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              }),
            }}
            content={{
              text: post.content,
              image: post.image || undefined,
            }}
            engagement={{
              likes: post.likes,
              comments: post.comments,
              shares: post.shares,
              isLiked: hasUpvoted(post.id),
            }}
            onLike={async (e) => {
              if (e) e.stopPropagation();
              if (!username) {
                setShowSessionModal(true);
                return;
              }
              const newLikeState = !hasUpvoted(post.id);
              toggleUpvote(post.id, newLikeState);
              try {
                await fetch(`/api/posts/${post.id}/like`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ isLiked: newLikeState, username })
                });
              } catch (error) {
                console.error('Failed to like post:', error);
                toggleUpvote(post.id, !newLikeState);
              }
            }}
            onShare={handleShare}
            onComment={() => document.getElementById('comment-input')?.focus()}
          />

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '24px 0' }} />

          {/* Comments Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, padding: '0 8px', margin: 0 }}>
              Comments ({post.comments})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {comments.length === 0 ? (
                <p className="text-gray-500 italic text-center py-8">Be the first to share your thoughts.</p>
              ) : (
                comments.filter((c: any) => !c.parentId).map((comment: any) => {
                  const replies = comments.filter((c: any) => c.parentId === comment.id);
                  const isExpanded = expandedThreads[comment.id];
                  return (
                    <div key={comment.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* Comment Card */}
                      <div style={{
                        padding: '14px 16px', borderRadius: '12px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', gap: '12px', alignItems: 'flex-start',
                      }}>
                        {/* Avatar */}
                        <div style={{
                          flexShrink: 0, width: '34px', height: '34px', borderRadius: '50%',
                          overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'black',
                          marginTop: '1px',
                        }}>
                          <Facehash name={comment.author} size={34} />
                        </div>
                        {/* Content column */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Author + date */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 700, fontSize: '14px' }}>{comment.author}</span>
                            <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: 'auto', flexShrink: 0 }}>
                              {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          {/* Comment text */}
                          <p style={{ fontSize: '14px', color: '#d1d5db', margin: '0 0 8px 0', lineHeight: 1.5, wordBreak: 'break-word' }}>
                            {comment.text}
                          </p>
                          {/* Actions */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '-10px' }}>
                            <UpvoteIconButton
                              count={comment.upvotes}
                              initialUpvoted={hasUpvoted(comment.id)}
                              onUpvote={(isUpvoted) => handleCommentUpvote(comment.id, isUpvoted)}
                            />
                            <HoverBtn
                              onClick={() => {
                                setReplyingTo({ id: comment.id, name: comment.author });
                                document.getElementById('comment-input')?.focus();
                              }}
                            >
                              <MessageCircle style={{ width: '13px', height: '13px' }} />
                              Reply
                            </HoverBtn>
                            {username === comment.author && (
                              <HoverBtn danger onClick={() => handleDeleteComment(comment.id)}>
                                <Trash2 style={{ width: '13px', height: '13px' }} />
                              </HoverBtn>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* View replies toggle */}
                      {replies.length > 0 && (
                        <div style={{ paddingLeft: '48px' }}>
                          <HoverBtn
                            onClick={() => setExpandedThreads(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                            style={{ fontWeight: 700, gap: '10px' }}
                          >
                            <div style={{ width: '28px', height: '1px', background: 'rgba(255,255,255,0.2)' }} />
                            {isExpanded ? 'Hide replies' : `View ${replies.length} repl${replies.length === 1 ? 'y' : 'ies'}`}
                          </HoverBtn>
                        </div>
                      )}

                      {/* Replies */}
                      {isExpanded && replies.length > 0 && (
                        <div style={{ paddingLeft: '32px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', marginTop: '8px' }}>
                          <div style={{
                            position: 'absolute', left: '16px', top: 0, bottom: '16px',
                            width: '1px', background: 'rgba(255,255,255,0.1)',
                          }} />
                          {replies.map((reply: any) => (
                            <div key={reply.id} style={{
                              padding: '12px 14px', borderRadius: '12px',
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              position: 'relative', zIndex: 1, marginLeft: '16px',
                              display: 'flex', gap: '10px', alignItems: 'flex-start',
                            }}>
                              {/* Avatar */}
                              <div style={{
                                flexShrink: 0, width: '26px', height: '26px', borderRadius: '50%',
                                overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'black',
                                marginTop: '1px',
                              }}>
                                <Facehash name={reply.author} size={26} />
                              </div>
                              {/* Content */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <span style={{ fontWeight: 700, fontSize: '13px', display: 'block', marginBottom: '3px' }}>{reply.author}</span>
                                <p style={{ fontSize: '13px', color: '#d1d5db', margin: '0 0 6px 0', lineHeight: 1.5, wordBreak: 'break-word' }}>{reply.text}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '-10px' }}>
                                  <UpvoteIconButton
                                    count={reply.upvotes}
                                    initialUpvoted={hasUpvoted(reply.id)}
                                    onUpvote={(isUpvoted) => handleCommentUpvote(reply.id, isUpvoted)}
                                  />
                                  <HoverBtn
                                    onClick={() => {
                                      setReplyingTo({ id: comment.id, name: reply.author });
                                      setCommentText(`@${reply.author} `);
                                      document.getElementById('comment-input')?.focus();
                                    }}
                                  >
                                    <MessageCircle style={{ width: '12px', height: '12px' }} />
                                    Reply
                                  </HoverBtn>
                                  {username === reply.author && (
                                    <HoverBtn danger onClick={() => handleDeleteComment(reply.id)}>
                                      <Trash2 style={{ width: '12px', height: '12px' }} />
                                    </HoverBtn>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Floating CTA Pill */}
        <div style={{
          position: 'fixed', bottom: '32px',
          left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: '672px',
          padding: '0 16px', zIndex: 50,
          pointerEvents: 'none',
        }}>
          <div style={{ pointerEvents: 'auto', width: '100%', position: 'relative' }}>

            {replyingTo && (
              <div style={{
                position: 'absolute', bottom: '100%', left: '16px', right: '16px',
                background: 'rgba(28,28,30,0.95)', border: '1px solid rgba(255,255,255,0.1)',
                borderBottom: 'none', borderRadius: '12px 12px 0 0',
                padding: '8px 16px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                backdropFilter: 'blur(20px)', boxShadow: '0 -4px 20px rgba(0,0,0,0.4)',
              }}>
                <span style={{ fontSize: '12px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Replying to <strong style={{ color: 'white' }}>@{replyingTo.name}</strong>
                </span>
                <button
                  onClick={() => { setReplyingTo(null); setCommentText(""); }}
                  style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px' }}
                >
                  <X style={{ width: '12px', height: '12px' }} />
                </button>
              </div>
            )}

            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'rgba(28,28,30,0.97)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
              borderRadius: '9999px', padding: '8px',
              width: '100%', position: 'relative', zIndex: 10,
            }}>
              <div style={{
                flexShrink: 0, width: '44px', height: '44px', borderRadius: '50%',
                overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
                background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {username ? (
                  <Facehash name={username} size={44} enableBlink={true} />
                ) : (
                  <div style={{ color: '#6b7280', opacity: 0.5, fontSize: '14px' }}>?</div>
                )}
              </div>
              <input
                id="comment-input"
                ref={inputRef}
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && commentText.trim()) {
                    handlePostComment();
                  }
                }}
                onClick={() => {
                  if (!username) {
                    setShowSessionModal(true);
                  }
                }}
                placeholder="Add a comment..."
                style={{
                  flex: 1, background: 'transparent', border: 'none',
                  outline: 'none', color: 'white', fontSize: '14px',
                  paddingLeft: '8px',
                }}
              />
              <button
                onClick={handlePostComment}
                disabled={!commentText.trim()}
                style={{
                  flexShrink: 0, background: 'rgba(255,255,255,0.1)',
                  color: 'white', width: '44px', height: '44px',
                  borderRadius: '50%', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: commentText.trim() ? 1 : 0.5,
                  transition: 'background 0.2s',
                }}
              >
                <Send style={{ width: '16px', height: '16px', marginLeft: '2px' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Delete Comment Confirmation Modal */}
        <AnimatePresence>
          {commentToDelete && (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '16px',
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  width: '100%', maxWidth: '384px',
                  background: '#1c1c1e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px', padding: '24px',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
                }}
              >
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'white', margin: '0 0 12px' }}>Delete Comment?</h2>
                <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.5 }}>
                  Are you sure you want to delete this comment? This action cannot be undone.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    onClick={() => setCommentToDelete(null)}
                    style={{
                      padding: '8px 16px', fontSize: '14px', fontWeight: 500,
                      color: 'white', background: 'transparent',
                      border: 'none', borderRadius: '9999px', cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteComment}
                    style={{
                      padding: '8px 16px', fontSize: '14px', fontWeight: 500,
                      background: 'rgba(239,68,68,0.15)', color: '#ef4444',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '9999px', cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
