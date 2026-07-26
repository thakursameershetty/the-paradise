"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './explore.module.css';
import SpinWheel, { WinnerInfo } from './SpinWheel';
import FacehashSection from './FacehashSection';

export default function ExplorePage() {
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
  const [finalWinner, setFinalWinner] = useState<WinnerInfo | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '', q4: '' });
  const [contactInfo, setContactInfo] = useState({ fullName: '', email: '', phone: '' });

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

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(20);
    setShowModal(true);
  };

  const handleNextQuestion = () => {
    triggerHaptic(20);
    if (currentQuestion < 4) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowModal(false);
      setShowWheel(true);
    }
  };

  const handleWheelComplete = (winner: WinnerInfo) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('paradiseWinner', JSON.stringify(winner));
      localStorage.setItem('paradiseContact', JSON.stringify(contactInfo));
      localStorage.setItem('paradiseAnswers', JSON.stringify(answers));
    }
    setShowWheel(false);
    setFinalWinner(winner);
  };

  const handlePrevQuestion = () => {
    triggerHaptic(20);
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };


  return (
    <div className={styles.container}>
      <video
        autoPlay
        muted
        playsInline
        preload="auto"
        className={`${styles.videoBackground} ${styles.videoBlur}`}
      >
        <source src="https://828w0y4x5k.ufs.sh/f/STslBtUPAU3wUh13e5PB6LbOpi8KV4SN5ZoxheqRcCyFrX3D" type="video/mp4" />
      </video>
      <video
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => setIsVideoEnded(true)}
        className={`${styles.videoBackground} ${styles.videoMain}`}
      >
        <source src="https://828w0y4x5k.ufs.sh/f/STslBtUPAU3wUh13e5PB6LbOpi8KV4SN5ZoxheqRcCyFrX3D" type="video/mp4" />
      </video>

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
                  <label className={styles.label}>EMAIL</label>
                  <input type="email" placeholder="EMAIL" className={styles.input} required value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>MOBILE NO:</label>
                  <input type="tel" placeholder="MOBILE NO:" className={styles.input} required value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} />
                </div>
                <button type="submit" className={styles.submitBtn}>Enter Jadal Zamana</button>
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
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Popup (Independent) */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeBtn}
              onClick={() => {
                triggerHaptic(20);
                setShowModal(false);
              }}
              type="button"
            >
              <span className="material-symbols-rounded">close</span>
            </button>

            <div className={styles.questionsSliderWrapper}>
              <div
                className={styles.questionsSlider}
                style={{ transform: `translateX(-${(currentQuestion - 1) * 100}%)` }}
              >
                {[1, 2, 3, 4].map((qNum) => (
                  <div className={styles.questionSlide} key={qNum}>
                    <h3 className={styles.questionTitle}>Question {qNum}</h3>
                    <textarea
                      className={styles.modalInput}
                      placeholder={`Your answer for question ${qNum}...`}
                      value={answers[`q${qNum}` as keyof typeof answers]}
                      onChange={(e) => setAnswers({ ...answers, [`q${qNum}`]: e.target.value })}
                      autoFocus={currentQuestion === qNum}
                      rows={4}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.modalActions}>
              {currentQuestion > 1 && (
                <button className={styles.prevBtn} onClick={handlePrevQuestion} type="button">
                  Previous
                </button>
              )}
              <button className={styles.nextBtn} onClick={handleNextQuestion} type="button">
                {currentQuestion < 4 ? 'Next' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
