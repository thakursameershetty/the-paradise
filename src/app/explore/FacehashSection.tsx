'use client';

import React, { useState } from 'react';
import { Facehash } from 'facehash';
import { motion } from 'framer-motion';
import styles from './FacehashSection.module.css';
import type { WinnerInfo } from './SpinWheel';

interface FacehashSectionProps {
  winner: WinnerInfo;
  onBack?: () => void;
}

export default function FacehashSection({ winner, onBack }: FacehashSectionProps) {
  const [nickname, setNickname] = useState('');

  const triggerHaptic = (pattern: number | number[] = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  return (
    <div
      className={styles.container}
      style={{ '--theme-color': winner.colors[0] } as React.CSSProperties}
    >
      {onBack && (
        <button
          className={styles.floatingBackBtn}
          onClick={() => {
            triggerHaptic(20);
            onBack();
          }}
          type="button"
        >
          <span className="material-symbols-rounded">arrow_back</span>
        </button>
      )}

      <div className={styles.header}>
        <h1 className={styles.title}>Identify Yourself</h1>
        <p className={styles.subtitle}>
          Enter a short nickname to<br />create your Paradise ID.
        </p>
      </div>

      <div className={styles.avatarContainer}>
        <div className={styles.facehashWrapper}>
          <Facehash name={nickname || ' '} size={180} />
        </div>

        <div className={styles.badgeWrapper}>
          <motion.img
            layoutId="winner-badge"
            src={winner.image}
            alt={winner.animal}
            className={styles.badge}
          />
        </div>
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <span className={styles.atSymbol}>@</span>
          <input
            type="text"
            className={styles.input}
            placeholder="what should we call you?"
            value={nickname}
            onChange={(e) => setNickname(e.target.value.replace(/\s/g, '_').toLowerCase())}
            maxLength={15}
            autoFocus
          />
        </div>

        <button
          className={styles.nextBtn}
          disabled={!nickname.trim()}
          onClick={() => {
            triggerHaptic(20);
            // Action to be defined
          }}
          style={{
            background: winner.colors[0],
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 16px ${winner.colors[0]}80`,
            borderColor: winner.colors[1] === '#111111' ? winner.colors[0] : winner.colors[1],
            opacity: nickname.trim() ? 1 : 0.5,
            cursor: nickname.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
