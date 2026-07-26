import { motion } from 'framer-motion';
import styles from './FeedView.module.css';
import { Facehash } from 'facehash';
import type { WinnerInfo } from './SpinWheel';

interface FeedViewProps {
  nickname: string;
  winner: WinnerInfo;
}

export default function FeedView({ nickname, winner }: FeedViewProps) {
  // Dummy feed data
  const feedItems = [
    { id: 1, title: 'Trailer Release', content: 'The highly anticipated trailer drops tomorrow! Get ready for an epic journey.', time: '2h ago' },
    { id: 2, title: 'Behind the Scenes', content: 'A sneak peek into the making of Jadal Zamana. See how the magic happens.', time: '5h ago' },
    { id: 3, title: 'Cast Announcement', content: 'New stars joining the Paradise universe. Read the full cast list.', time: '1d ago' },
    { id: 4, title: 'Welcome to Paradise', content: 'Your journey begins now. Stay tuned for exclusive updates.', time: '2d ago' },
  ];

  return (
    <div className={styles.feedContainer}>
      {/* Top Header with Avatar */}
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.greeting}>Welcome,</h2>
          <h1 className={styles.nickname}>@{nickname}</h1>
        </div>

        {/* This layoutId matches the one in FacehashSection */}
        <motion.div layoutId="profile-avatar-container" className={styles.avatarTopRight}>
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
    </div>
  );
}
