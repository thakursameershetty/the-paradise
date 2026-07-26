'use client';

import React, { useState } from 'react';
import { Facehash } from 'facehash';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FacehashSection.module.css';
import type { WinnerInfo } from './SpinWheel';
import { saveParticipant } from '@/app/actions';
import FeedView from './FeedView';

interface FacehashSectionProps {
  winner: WinnerInfo;
  onBack?: () => void;
}

export default function FacehashSection({ winner, onBack }: FacehashSectionProps) {
  const [nickname, setNickname] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [view, setView] = useState<'form' | 'feed'>('form');
  const [profileData, setProfileData] = useState<any>(null);

  const triggerHaptic = (pattern: number | number[] = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedNickname = localStorage.getItem('paradiseNickname');
      const savedProfile = localStorage.getItem('paradiseProfile');

      if (savedNickname) {
        setNickname(savedNickname);

        if (savedProfile) {
          setProfileData(JSON.parse(savedProfile));
        } else {
          // Fallback for older sessions before paradiseProfile was consolidated
          const contactInfo = JSON.parse(localStorage.getItem('paradiseContact') || '{}');
          const answers = JSON.parse(localStorage.getItem('paradiseAnswers') || '{}');
          setProfileData({ nickname: savedNickname, winner, contactInfo, answers });
        }

        setView('feed');
        if (window.location.pathname !== '/feed') {
          window.history.replaceState(null, '', '/feed');
        }
      }
    }
  }, []);

  if (view === 'feed') {
    return <FeedView nickname={nickname} winner={winner} profileData={profileData} />;
  }

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

      <motion.div layoutId="profile-avatar-container" className={styles.avatarContainer}>
        <motion.div layoutId="profile-facehash" className={styles.facehashWrapper}>
          <Facehash name={nickname || ' '} size={180} />
        </motion.div>

        <motion.div layoutId="profile-badge" className={styles.badgeWrapper}>
          <img
            src={winner.image}
            alt={winner.animal}
            className={styles.badge}
          />
        </motion.div>
      </motion.div>

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

            const contactInfo = JSON.parse(localStorage.getItem('paradiseContact') || '{}');
            const answers = JSON.parse(localStorage.getItem('paradiseAnswers') || '{}');

            const result = await saveParticipant({
              nickname,
              animal: winner.animal,
              colors: winner.colors,
              fullName: contactInfo.fullName || '',
              email: contactInfo.email || '',
              phone: contactInfo.phone || '',
              q1: answers.q1 || '',
              q2: answers.q2 || '',
              q3: answers.q3 || '',
              q4: answers.q4 || ''
            });

            if (!result.success) {
              setErrorMsg(result.error || 'Failed to save');
              setIsSaving(false);
            } else {
              triggerHaptic([30, 50, 30, 50, 50]);
              setIsSaving(false);
              localStorage.setItem('paradiseNickname', nickname);
              const fullProfile = { nickname, winner, contactInfo, answers };
              localStorage.setItem('paradiseProfile', JSON.stringify(fullProfile));
              setProfileData(fullProfile);
              window.history.pushState(null, '', '/feed');
              setView('feed');
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
