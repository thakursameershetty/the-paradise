'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { PostCard } from '@/components/ui/post-card';
import { getPosts } from '../actions';
import styles from './FeedView.module.css';
import { Facehash } from 'facehash';
import type { WinnerInfo } from './SpinWheel';
import { Menu, X, LogOut, MessageSquare, ShoppingBag } from 'lucide-react';

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
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadPosts() {
      const result = await getPosts();
      if (result.success && result.posts) {
        setPosts(result.posts);
      }
    }
    loadPosts();
  }, []);

  return (
    <div className={styles.feedContainer}>
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
          {posts.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>No updates yet in Paradise. Stay tuned!</p>
          ) : (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
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
                  }}
                />
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
                      <span className="material-symbols-rounded">mail</span>
                    </span>
                    <span className={styles.profileInfoValue}>{profileData.contactInfo?.email || '—'}</span>
                  </div>
                  <div className={styles.profileInfoItem}>
                    <span className={styles.profileInfoIcon}>
                      <span className="material-symbols-rounded">call</span>
                    </span>
                    <span className={styles.profileInfoValue}>{profileData.contactInfo?.phone || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Answers */}
              <div className={styles.profileSection}>
                <p className={styles.profileSectionTitle}>Your Answers</p>
                <div className={styles.profileAnswersGrid}>
                  {(['q1', 'q2', 'q3', 'q4'] as const).map((key, i) => (
                    <div key={key} className={styles.profileAnswerCard}>
                      <span className={styles.profileAnswerNum} style={{ color: winner.colors[0] }}>Q{i + 1}</span>
                      <p className={styles.profileAnswerText}>{profileData.answers?.[key] || '—'}</p>
                    </div>
                  ))}
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
