"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './explore.module.css';
import SpinWheel, { WinnerInfo } from './SpinWheel';
import FacehashSection from './FacehashSection';
import { checkParticipantExists } from '../actions';

export default function ExplorePage() {
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isFeedView, setIsFeedView] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const [showWheel, setShowWheel] = useState(false);
  const [finalWinner, setFinalWinner] = useState<WinnerInfo | null>(null);
  const [contactInfo, setContactInfo] = useState({ fullName: '', phone: '' });

  const triggerHaptic = (pattern: number | number[] = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  useEffect(() => {
    // Check local storage to prevent cheating by reloading
    if (typeof window !== 'undefined') {
      const savedWinner = localStorage.getItem('paradiseWinner');
      if (savedWinner) {
        setFinalWinner(JSON.parse(savedWinner));
        return; // Don't show initial form if they already spun
      }
    }

    // Show form after the title has appeared
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isChecking) return;
    
    setIsChecking(true);
    triggerHaptic(20);

    const result = await checkParticipantExists(contactInfo.phone);
    setIsChecking(false);
    if (result.success && result.participant) {
      const p = result.participant;
      const winner: WinnerInfo = {
        image: `/assets/badges/${p.animal.split(' ').pop()?.toLowerCase()}.png`,
        animal: p.animal,
        character: '',
        colors: p.colors
      };
      
      const fullProfile = { 
        nickname: p.nickname, 
        winner, 
        contactInfo: { fullName: p.fullName, phone: p.phone }
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('paradiseWinner', JSON.stringify(winner));
        localStorage.setItem('paradiseContact', JSON.stringify(fullProfile.contactInfo));
        localStorage.setItem('paradiseNickname', p.nickname);
        localStorage.setItem('paradiseProfile', JSON.stringify(fullProfile));
      }

      setFinalWinner(winner);
      return;
    }

    setShowWheel(true);
  };

  const handleWheelComplete = (winner: WinnerInfo) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('paradiseWinner', JSON.stringify(winner));
      localStorage.setItem('paradiseContact', JSON.stringify(contactInfo));
    }
    setShowWheel(false);
    setFinalWinner(winner);
  };
  return (
    <div className={styles.container}>
      {!isFeedView && (
        <>
          <video
            autoPlay
            muted
            playsInline
            preload="auto"
            poster="/assets/end-frame.png"
            className={`${styles.videoBackground} ${styles.videoBlur}`}
          >
            <source src="https://828w0y4x5k.ufs.sh/f/STslBtUPAU3wUh13e5PB6LbOpi8KV4SN5ZoxheqRcCyFrX3D" type="video/mp4" />
          </video>
          <video
            autoPlay
            muted
            playsInline
            preload="auto"
            poster="/assets/end-frame.png"
            onEnded={() => setIsVideoEnded(true)}
            className={`${styles.videoBackground} ${styles.videoMain}`}
          >
            <source src="https://828w0y4x5k.ufs.sh/f/STslBtUPAU3wUh13e5PB6LbOpi8KV4SN5ZoxheqRcCyFrX3D" type="video/mp4" />
          </video>
        </>
      )}

      <div className={`${styles.endFrame} ${isVideoEnded ? styles.visible : ''}`}></div>
      <div className={styles.overlay}></div>

      <AnimatePresence mode="wait">
        {!showWheel && !finalWinner && (
          <motion.div
            key="form"
            className={`${styles.content} ${showForm ? styles.formActive : ''}`}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/" className={styles.backBtn} onClick={() => triggerHaptic(20)}>
              <span className="material-symbols-rounded">arrow_back</span>
            </Link>

            <div className={styles.titleContainer}>
              <h1 className={styles.title}>
                Welcome to <br className={styles.titleBreak} /> Jadal Zamana
              </h1>
              <p className={styles.subtitle}>who are you ?</p>
            </div>

            <div className={`${styles.formContainer} ${showForm ? styles.showForm : ''}`}>
              <form className={styles.form} onSubmit={handleInitialSubmit}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>NAME</label>
                  <input type="text" placeholder="NAME" className={styles.input} required value={contactInfo.fullName} onChange={(e) => setContactInfo({ ...contactInfo, fullName: e.target.value })} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>MOBILE NO:</label>
                  <input type="tel" placeholder="MOBILE NO:" className={styles.input} required value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={isChecking}>
                  {isChecking ? 'Checking...' : 'Enter Jadal Zamana'}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Spin Wheel */}
        {showWheel && !finalWinner && (
          <motion.div
            key="wheel"
            className={styles.wheelContainer}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 200 }}
          >
            <SpinWheel
              onComplete={handleWheelComplete}
              onBack={() => {
                triggerHaptic(20);
                setShowWheel(false);
              }}
            />
          </motion.div>
        )}

        {finalWinner && (
          <motion.div
            key="facehash"
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1000 }}
          >
            <FacehashSection
              winner={finalWinner}
              onBack={() => {
                setFinalWinner(null);
                setIsFeedView(false);
              }}
              onEnterFeed={() => setIsFeedView(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
