import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
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
  // Dummy feed data
  const feedItems = [
    { id: 1, title: 'Trailer Release', content: 'The highly anticipated trailer drops tomorrow! Get ready for an epic journey.', time: '2h ago' },
    { id: 2, title: 'Behind the Scenes', content: 'A sneak peek into the making of Jadal Zamana. See how the magic happens.', time: '5h ago' },
    { id: 3, title: 'Cast Announcement', content: 'New stars joining the Paradise universe. Read the full cast list.', time: '1d ago' },
    { id: 4, title: 'Welcome to Paradise', content: 'Your journey begins now. Stay tuned for exclusive updates.', time: '2d ago' },
  ];

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

        <div className={styles.postsList}>
          {feedItems.map((item, index) => (
            <motion.div
              key={item.id}
              className={styles.postCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
              style={{
                borderLeft: `3px solid ${winner.colors[0]}`
              }}
            >
              <div className={styles.postMeta}>
                <span className={styles.postTime}>{item.time}</span>
              </div>
              <h4 className={styles.postTitle}>{item.title}</h4>
              <p className={styles.postContent}>{item.content}</p>
            </motion.div>
          ))}
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
