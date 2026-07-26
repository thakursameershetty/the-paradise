'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/app/page.module.css';

interface TimeLeft {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-09-25T00:00:00');

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      let months = (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth());
      let tempDate = new Date(now);
      tempDate.setMonth(tempDate.getMonth() + months);

      if (tempDate.getTime() > targetDate.getTime()) {
        months--;
        tempDate = new Date(now);
        tempDate.setMonth(tempDate.getMonth() + months);
      }

      const remainingDiff = targetDate.getTime() - tempDate.getTime();
      const days = Math.floor(remainingDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingDiff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remainingDiff / 1000 / 60) % 60);
      const seconds = Math.floor((remainingDiff / 1000) % 60);

      return { months, days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  // Prevent hydration mismatch by returning null initially if needed,
  // but since it's just numbers, it's usually fine, or we can use a mounted state
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className={styles.countdownWrapper}>
      <h3 className={styles.countdownTitle}>The first ever show of Paradise will begin at</h3>
      <div className={styles.countdownTimer}>
        <div className={styles.countdownUnit}>
          <span className={styles.countdownNumber}>{formatNumber(timeLeft.months)}</span>
          <span className={styles.countdownLabel}>Months</span>
        </div>
        <span className={styles.countdownSeparator}>:</span>
        <div className={styles.countdownUnit}>
          <span className={styles.countdownNumber}>{formatNumber(timeLeft.days)}</span>
          <span className={styles.countdownLabel}>Days</span>
        </div>
        <span className={styles.countdownSeparator}>:</span>
        <div className={styles.countdownUnit}>
          <span className={styles.countdownNumber}>{formatNumber(timeLeft.hours)}</span>
          <span className={styles.countdownLabel}>Hours</span>
        </div>
        <span className={styles.countdownSeparator}>:</span>
        <div className={styles.countdownUnit}>
          <span className={styles.countdownNumber}>{formatNumber(timeLeft.minutes)}</span>
          <span className={styles.countdownLabel}>Minutes</span>
        </div>
        <span className={styles.countdownSeparator}>:</span>
        <div className={styles.countdownUnit}>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={timeLeft.seconds}
                initial={{ y: 15, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -15, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className={`${styles.countdownNumber} ${styles.seconds}`}
              >
                {formatNumber(timeLeft.seconds)}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className={styles.countdownLabel}>Seconds</span>
        </div>
      </div>
    </div>
  );
}
