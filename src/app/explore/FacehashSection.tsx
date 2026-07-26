'use client';

import React, { useState } from 'react';
import { Facehash } from 'facehash';
import { motion } from 'framer-motion';
import styles from './FacehashSection.module.css';
import type { WinnerInfo } from './SpinWheel';
import { saveParticipant } from '@/app/actions';

interface FacehashSectionProps {
  winner: WinnerInfo;
  onBack?: () => void;
}

export default function FacehashSection({ winner, onBack }: FacehashSectionProps) {
  const [nickname, setNickname] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
          disabled={!nickname.trim() || isSaving}
          onClick={async () => {
            triggerHaptic(20);
            setErrorMsg('');
            setIsSaving(true);
            
            const result = await saveParticipant({
              nickname,
              animal: winner.animal,
              color1: winner.colors[0],
              color2: winner.colors[1],
            });

            if (!result.success) {
              setErrorMsg(result.error || 'Failed to save');
              setIsSaving(false);
            } else {
              // Successfully saved! We can handle the success state here.
              // For now, let's just trigger a massive haptic and maybe clear the form.
              triggerHaptic([30, 50, 30, 50, 50]);
              setIsSaving(false);
              alert("Your Paradise ID is successfully created and saved!");
            }
          }}
          style={{
            background: winner.colors[0],
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 16px ${winner.colors[0]}80`,
            borderColor: winner.colors[1] === '#111111' ? winner.colors[0] : winner.colors[1],
            opacity: (nickname.trim() && !isSaving) ? 1 : 0.5,
            cursor: (nickname.trim() && !isSaving) ? 'pointer' : 'not-allowed'
          }}
        >
          {isSaving ? 'SAVING...' : 'NEXT'}
        </button>
        {errorMsg && <p className={styles.errorMessage}>{errorMsg}</p>}
      </div>
    </div>
  );
}
