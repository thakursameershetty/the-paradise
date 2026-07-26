'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './SpinWheel.module.css';
import confetti from 'canvas-confetti';
export type WinnerInfo = {
  image: string;
  animal: string;
  character: string;
  colors: string[];
};

interface SpinWheelProps {
  onComplete?: (winner: WinnerInfo) => void;
  onBack?: () => void;
}

export default function SpinWheel({ onComplete, onBack }: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(45); // Start at 45deg
  const [winner, setWinner] = useState<WinnerInfo | null>(null);
  const [spinDuration, setSpinDuration] = useState(15);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hapticTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerHaptic = (pattern: number | number[] = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const startHapticEngine = (durationSec: number) => {
    if (hapticTimeoutRef.current) clearTimeout(hapticTimeoutRef.current);
    
    const startTime = Date.now();
    const durationMs = durationSec * 1000;
    
    const tick = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= durationMs) return;
      
      const progress = elapsed / durationMs;
      const speed = Math.pow(1 - progress, 2); // Easing curve approximation
      const delay = Math.max(30, 600 - (speed * 570)); // from 30ms to 600ms
      
      triggerHaptic(10);
      hapticTimeoutRef.current = setTimeout(tick, delay);
    };
    
    tick();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (hapticTimeoutRef.current) clearTimeout(hapticTimeoutRef.current);
    };
  }, []);

  const fireConfetti = (colors: string[]) => {
    triggerHaptic([30, 50, 30, 50, 50]);
    const duration = 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        zIndex: 1000
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
        zIndex: 1000
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const endSpin = (finalRotation: number) => {
    setSpinning(false);
    const normalizedRotation = finalRotation % 360;
    let winnerData: WinnerInfo;

    // 0-90: Pigeon, 90-180: Crow, 180-270: Butterfly, 270-360: Parrot
    if (normalizedRotation >= 0 && normalizedRotation < 90) {
      winnerData = {
        image: '/assets/badges/pigeon.png',
        animal: 'The Pigeon',
        character: 'Vikram Mallik',
        colors: ['#b71c1c', '#ffffff', '#FFD700']
      };
    } else if (normalizedRotation >= 90 && normalizedRotation < 180) {
      winnerData = {
        image: '/assets/badges/crow.png',
        animal: 'The Crow',
        character: 'Jadal',
        colors: ['#b71c1c', '#111111', '#FFD700']
      };
    } else if (normalizedRotation >= 180 && normalizedRotation < 270) {
      winnerData = {
        image: '/assets/badges/butterfly.png',
        animal: 'The Butterfly',
        character: 'Subbu',
        colors: ['#2196F3', '#b71c1c', '#FFD700']
      };
    } else {
      winnerData = {
        image: '/assets/badges/parrot.png',
        animal: 'The Parrot',
        character: 'Shikanja Maalik',
        colors: ['#4CAF50', '#b71c1c', '#FFD700']
      };
    }

    setWinner(winnerData);
    fireConfetti(winnerData.colors);
  };

  const handleSpin = () => {
    if (spinning || winner) return;
    setSpinning(true);
    setWinner(null);
    setSpinDuration(15);

    // Spin 15-24 full rotations + a random angle
    const extraSpins = Math.floor(Math.random() * 10) + 15;
    const randomDegree = Math.floor(Math.random() * 360);
    const newRotation = rotation + (extraSpins * 360) + randomDegree;

    setRotation(newRotation);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (hapticTimeoutRef.current) clearTimeout(hapticTimeoutRef.current);
      endSpin(newRotation);
    }, 15000);

    startHapticEngine(15);
  };

  const handleCenterClick = () => {
    triggerHaptic(20);
    if (winner) return;

    if (spinning) {
      // Add 20 extra rotations immediately and shorten time to drastically increase speed
      setSpinDuration(8);
      const newRotation = rotation + 7200; // 20 spins
      setRotation(newRotation);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (hapticTimeoutRef.current) clearTimeout(hapticTimeoutRef.current);
        endSpin(newRotation);
      }, 8000);

      startHapticEngine(8);
    } else {
      handleSpin();
    }
  };

  return (
    <div className={styles.container}>
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

      {!spinning && !winner && (
        <h2 className={styles.spinnerText}>Spin the wheel to find your character</h2>
      )}

      <div className={styles.wheelWrapper}>
        <div className={styles.pedestal}></div>

        <div className={styles.wheelContainer}>
          <div className={styles.pointerShadow}></div>
          <div className={styles.pointer}></div>

          <div className={styles.wheelOuterRim}></div>
          <div className={styles.wheelInnerRim}></div>

          <div
            className={styles.wheel}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: `transform ${spinDuration}s cubic-bezier(0.2, 0.8, 0.2, 1)`
            }}
          >
            <div className={`${styles.segment} ${styles.segment1}`}>
              <img src="/assets/badges/parrot.png" alt="Parrot" className={styles.badgeImg} />
            </div>
            <div className={`${styles.segment} ${styles.segment2}`}>
              <img src="/assets/badges/butterfly.png" alt="Butterfly" className={styles.badgeImg} />
            </div>
            <div className={`${styles.segment} ${styles.segment3}`}>
              <img src="/assets/badges/crow.png" alt="Crow" className={styles.badgeImg} />
            </div>
            <div className={`${styles.segment} ${styles.segment4}`}>
              <img src="/assets/badges/pigeon.png" alt="Pigeon" className={styles.badgeImg} />
            </div>
          </div>

          <div
            className={styles.centerHub}
            onClick={handleCenterClick}
            style={{ cursor: 'pointer' }}
            title={spinning ? "Click to Turbo Spin!" : "Click to Spin!"}
          >
            <div className={styles.hubInner}></div>
          </div>
        </div>

        <button
          className={styles.spinBtn}
          onClick={handleSpin}
          disabled={spinning}
          type="button"
        >
          {spinning ? 'SPINNING...' : 'SPIN'}
        </button>
      </div>

      {winner && (
        <div className={styles.winnerOverlay} onClick={() => {
          setWinner(null);
          if (onComplete) onComplete(winner);
        }}>
          <div className={styles.winnerInner}>
            <motion.img 
              layoutId="winner-badge" 
              src={winner.image} 
              alt="Winner" 
              className={styles.winnerImage} 
            />
            <h2 className={styles.winnerText}>
              {winner.animal} <span className={styles.characterName}>({winner.character})</span>
            </h2>
            <button 
              className={styles.primaryNextBtn}
              onClick={(e) => {
                e.stopPropagation();
                setWinner(null);
                if (onComplete) onComplete(winner);
              }}
              style={{
                background: winner.colors[0],
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 16px ${winner.colors[0]}80`,
                borderColor: winner.colors[1] === '#111111' ? winner.colors[0] : winner.colors[1]
              }}
            >
              NEXT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
