'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './page.module.css';

interface CastCrewItem {
  name: string;
  role: string;
  image: string;
}

interface AboutClientProps {
  items: CastCrewItem[];
}

export default function AboutClient({ items }: AboutClientProps) {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.backgroundBlobs}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
      </div>

      {/* Top Header */}
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <span className="material-symbols-rounded">arrow_back</span>
        </button>

        <div className={styles.logoGroup}>
          <span className={styles.headerText}>CAST</span>
          <img src="/assets/paradise.svg" alt="Paradise" className={styles.headerLogo} />
          <span className={styles.headerText}>CREW</span>
        </div>
        
        {/* Empty div for flexbox balance */}
        <div style={{ width: 40 }} />
      </header>

      <div className={styles.contentScroll}>
        <div className={styles.contentWrapper}>
          <div className={styles.grid}>
            {items.map((item, index) => (
              <motion.div 
                key={item.name}
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <img 
                  src={item.image} 
                  alt={item.name}
                  className={styles.image}
                  loading="lazy"
                />
                <div className={styles.cardOverlay}>
                  <h2 className={styles.name}>{item.name}</h2>
                  <p className={styles.role}>{item.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottomBlur} />
    </div>
  );
}
