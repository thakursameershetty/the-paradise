import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PostCard } from '@/components/ui/post-card';
import { getPosts } from '../actions';
import styles from './FeedView.module.css';
import { Facehash } from 'facehash';
import type { WinnerInfo } from './SpinWheel';

interface FeedViewProps {
  nickname: string;
  winner: WinnerInfo;
  profileData?: any;
}

export default function FeedView({ nickname, winner, profileData }: FeedViewProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);

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

      {/* Top Header with Avatar */}
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.greeting}>Welcome,</h2>
          <h1 className={styles.nickname}>@{nickname}</h1>
        </div>

        {/* This layoutId matches the one in FacehashSection */}
        <motion.div 
          layoutId="profile-avatar-container" 
          className={styles.avatarTopRight}
          onClick={() => setShowProfile(true)}
          style={{ cursor: 'pointer' }}
        >
          <motion.div layoutId="profile-facehash" className={styles.facehashSmall}>
            <Facehash name={nickname || ' '} size={60} />
          </motion.div>
          <motion.div layoutId="profile-badge" className={styles.badgeSmallWrapper}>
            <img src={winner.image} alt={winner.animal} className={styles.badgeSmall} />
          </motion.div>
        </motion.div>
      </header>

      {/* Feed Content */}
      <div className={styles.feedScroll}>
        <div className={styles.feedHeader}>
          <h3>PARADISE UPDATES</h3>
          <div className={styles.pulse} />
        </div>

        <div className={styles.postsList} style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
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
                    timeAgo: new Date(post.createdAt).toLocaleDateString(),
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
      </div>

      {/* Profile Overlay */}
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
              style={{ borderTop: `4px solid ${winner.colors[0]}` }}
            >
              <button className={styles.closeModalBtn} onClick={() => setShowProfile(false)}>
                <span className="material-symbols-rounded">close</span>
              </button>
              
              <div className={styles.profileHeader}>
                <div className={styles.profileAvatarLarge}>
                  <Facehash name={nickname || ' '} size={100} />
                  <img src={winner.image} alt={winner.animal} className={styles.profileBadgeLarge} />
                </div>
                <div className={styles.profileNameplate}>
                  <h2>@{nickname}</h2>
                  <p className={styles.realName}>{profileData.contactInfo?.fullName || 'Anonymous'}</p>
                </div>
              </div>

              <div className={styles.profileDetails}>
                <div className={styles.detailRow}>
                  <span className="material-symbols-rounded">mail</span>
                  <span>{profileData.contactInfo?.email || 'No email provided'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className="material-symbols-rounded">call</span>
                  <span>{profileData.contactInfo?.phone || 'No phone provided'}</span>
                </div>
              </div>

              <div className={styles.profileAnswers}>
                <h3>Your Answers</h3>
                <div className={styles.answerBlock}>
                  <p className={styles.questionNum}>Q1</p>
                  <p className={styles.answerText}>{profileData.answers?.q1 || '-'}</p>
                </div>
                <div className={styles.answerBlock}>
                  <p className={styles.questionNum}>Q2</p>
                  <p className={styles.answerText}>{profileData.answers?.q2 || '-'}</p>
                </div>
                <div className={styles.answerBlock}>
                  <p className={styles.questionNum}>Q3</p>
                  <p className={styles.answerText}>{profileData.answers?.q3 || '-'}</p>
                </div>
                <div className={styles.answerBlock}>
                  <p className={styles.questionNum}>Q4</p>
                  <p className={styles.answerText}>{profileData.answers?.q4 || '-'}</p>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
