'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { PostCard } from '@/components/ui/post-card';
import { PostCardSkeleton } from '@/components/ui/post-card-skeleton';
import { getPosts, verifyParticipant } from '../actions';
import styles from './FeedView.module.css';
import { Facehash } from 'facehash';
import type { WinnerInfo } from './SpinWheel';
import { Menu, X, LogOut, MessageSquare, ShoppingBag } from 'lucide-react';
import { useSession } from '@/hooks/useSession';

interface FeedViewProps {
  nickname: string;
  winner: WinnerInfo;
  profileData?: any;
}

const menuItems = [
  {
    label: 'Ask The Team',
    description: 'Got questions? Reach out directly.',
    href: '/ask',
  },
  {
    label: 'Merchandise',
    description: 'Official Paradise merch drops.',
    href: '/merch',
  },
  {
    label: 'About & Credits',
    description: 'The story behind Paradise.',
    href: '/about',
  },
];

export default function FeedView({ nickname, winner, profileData }: FeedViewProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const router = useRouter();
  const { hasUpvoted, toggleUpvote } = useSession();

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      if (nickname) {
        const verify = await verifyParticipant(nickname);
        if (verify.success && verify.exists === false) {
          setShowDeletedModal(true);
          setIsLoading(false);
          return;
        }
      }

      const result = await getPosts();
      if (result.success && result.posts) {
        setPosts(result.posts);
      }
      setIsLoading(false);
    }
    init();
  }, [nickname]);

  return (
    <div className={styles.feedContainer}>
      {/* ── Deleted User Modal Overlay ── */}
      <AnimatePresence>
        {showDeletedModal && (
          <div className={styles.profileOverlayWrapper} style={{ zIndex: 9999 }}>
            <motion.div
              className={styles.profileBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className={styles.profileModal}
              style={{ textAlign: 'center', padding: '40px 20px' }}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ff4444' }}>Session Expired</h2>
              <p style={{ color: '#ccc', marginBottom: '32px', fontSize: '15px', lineHeight: '1.5' }}>
                You have been logged out. Please enter your name and mobile number again to continue.
              </p>
              <button
                className={styles.nextBtn}
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
                style={{
                  background: '#ff4444',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 16px rgba(255,68,68,0.5)',
                  width: '100%',
                  marginTop: '0'
                }}
              >
                OK
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className={styles.backgroundBlobs}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
      </div>

      {/* Top Header */}
      <header className={styles.header}>
        {/* Hamburger */}
        <button
          className={styles.hamburgerBtn}
          onClick={() => setShowMenu(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Logo */}
        <div className={styles.logoGroup}>
          <img src="/assets/paradise.svg" alt="Paradise" className={styles.headerLogo} />
          <span className={styles.headerText}>FEED</span>
        </div>

        {/* Avatar */}
        <motion.div
          layoutId="profile-avatar-container"
          className={styles.avatarTopRight}
          onClick={() => setShowProfile(true)}
          style={{ cursor: 'pointer' }}
        >
          <motion.div layoutId="profile-facehash" className={styles.facehashSmall}>
            <Facehash name={nickname || ' '} size={44} />
          </motion.div>
          <motion.div layoutId="profile-badge" className={styles.badgeSmallWrapper}>
            <img src={winner.image} alt={winner.animal} className={styles.badgeSmall} />
          </motion.div>
        </motion.div>
      </header>

      {/* Feed Content */}
      <div
        className={styles.feedScroll}
        onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 50)}
      >


        <div className={styles.postsList}>
          {isLoading ? (
            <>
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </>
          ) : posts.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>No updates yet in Paradise. Stay tuned!</p>
          ) : (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
              >
                <div 
                  onClick={() => router.push(`/post/${post.id}`)}
                  className="cursor-pointer"
                >
                  <PostCard
                    themeColor={winner.colors[0]}
                    author={{
                      name: post.authorName,
                      username: post.authorUsername,
                      avatar: post.authorAvatar,
                      timeAgo: new Date(post.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
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
                      if(e) e.stopPropagation();
                      const newLikeState = !hasUpvoted(post.id);
                      toggleUpvote(post.id, newLikeState);
                      try {
                        await fetch(`/api/posts/${post.id}/like`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ isLiked: newLikeState, username: nickname })
                        });
                      } catch (error) {
                        console.error('Failed to like post:', error);
                        // Revert on failure
                        toggleUpvote(post.id, !newLikeState);
                      }
                    }}
                    onComment={(e: any) => {
                      if(e) e.stopPropagation();
                      router.push(`/post/${post.id}?focus=comments`);
                    }}
                    onShare={(e: any) => {
                      if(e) e.stopPropagation();
                      const shareUrl = `${window.location.origin}/post/${post.id}`;
                      if (navigator.share) {
                        navigator.share({
                          title: `Update from ${post.authorName}`,
                          text: `Check out this update on Paradise!`,
                          url: shareUrl,
                        }).catch(console.error);
                      } else {
                        navigator.clipboard.writeText(shareUrl).then(() => {
                          alert("Post link copied to clipboard!");
                        });
                      }
                    }}
                  />
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Explicit spacer to ensure scroll gap across all browsers */}
        <div style={{ height: '250px', flexShrink: 0, width: '100%' }} />
      </div>

      <div className={styles.bottomBlur} />

      {/* Floating Buttons */}
      <div className={styles.floatingAskWrapper}>
        {/* Merchandise Gold Button */}
        <motion.button
          className={styles.floatingGoldBtn}
          onClick={() => router.push('/merch')}
          initial={{ y: 100, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            padding: isScrolled ? '14px 14px' : '10px 24px'
          }}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.05 }}
          style={{ outline: 'none' }}
        >
          <ShoppingBag size={isScrolled ? 22 : 20} />
          <AnimatePresence>
            {!isScrolled && (
              <motion.span
                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                animate={{ opacity: 1, width: 'auto', marginLeft: 8 }}
                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                transition={{ duration: 0.2 }}
                style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
              >
                Merchandise
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Ask The Team Red Button */}
        <motion.button
          className={styles.floatingAskBtn}
          onClick={() => router.push('/ask')}
          initial={{ y: 100, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            padding: isScrolled ? '14px 14px' : '10px 24px'
          }}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{ outline: 'none' }}
        >
          <MessageSquare size={isScrolled ? 22 : 20} />
          <AnimatePresence>
            {!isScrolled && (
              <motion.span
                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                animate={{ opacity: 1, width: 'auto', marginLeft: 8 }}
                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                transition={{ duration: 0.2 }}
                style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
              >
                Ask The Team
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ── Full-Screen Menu Overlay (portal so it escapes the fixed container) ── */}
      {showMenu && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          <motion.div
            className={styles.fullMenuOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {/* Home button */}
            <button
              className={styles.fullMenuHome}
              onClick={() => {
                setShowMenu(false);
                router.push('/');
              }}
              title="Go to Home"
            >
              <span className="material-symbols-rounded">home</span>
            </button>

            {/* Close button */}
            <button className={styles.fullMenuClose} onClick={() => setShowMenu(false)}>
              <X size={24} />
            </button>

            {/* Logo */}
            <div className={styles.fullMenuLogoWrap}>
              <img src="/assets/paradise.svg" alt="Paradise" className={styles.fullMenuLogo} />
            </div>

            {/* Nav items — text only, no icons */}
            <nav className={styles.fullMenuNav}>
              {menuItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowMenu(false);
                    router.push(item.href);
                  }}
                  href={item.href}
                  className={styles.fullMenuItem}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.07, duration: 0.28 }}
                >
                  <p className={styles.fullMenuItemLabel}>{item.label}</p>
                </motion.a>
              ))}
            </nav>

            {/* Profile shortcut */}
            <button
              className={styles.fullMenuProfileBtn}
              onClick={() => { setShowMenu(false); setShowProfile(true); }}
            >
              View my profile
            </button>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

      {/* ── Profile Overlay ── */}
      <AnimatePresence>
        {showProfile && profileData && (
          <div className={styles.profileOverlayWrapper}>
            <motion.div
              className={styles.profileBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfile(false)}
            />
            <motion.div
              className={styles.profileModal}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >

              {/* Close */}
              <button className={styles.closeModalBtn} onClick={() => setShowProfile(false)}>
                <X size={18} />
              </button>

              {/* Hero — avatar + name */}
              <div className={styles.profileHero}>
                <div className={styles.profileAvatarWrap}>
                  <div className={styles.profileAvatarRing} style={{ borderColor: winner.colors[0] }}>
                    <Facehash name={nickname || ' '} size={88} />
                  </div>
                  <img src={winner.image} alt={winner.animal} className={styles.profileBadgeLarge} />
                </div>
                <div>
                  <h2 className={styles.profileNickname}>@{nickname}</h2>
                  <p className={styles.profileRealName}>{profileData.contactInfo?.fullName || 'Anonymous'}</p>
                  <span className={styles.profileAnimalTag}>{winner.animal}</span>
                </div>
              </div>

              {/* Contact info */}
              <div className={styles.profileSection}>
                <p className={styles.profileSectionTitle}>Contact</p>
                <div className={styles.profileInfoGrid}>

                  <div className={styles.profileInfoItem}>
                    <span className={styles.profileInfoIcon}>
                      <span className="material-symbols-rounded">call</span>
                    </span>
                    <span className={styles.profileInfoValue}>{profileData.contactInfo?.phone || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Reset */}
              <button
                className={styles.resetBtn}
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/explore';
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
