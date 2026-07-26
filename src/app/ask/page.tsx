'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Facehash } from 'facehash';
import { ArrowLeft, Send } from 'lucide-react';
import type { WinnerInfo } from '../explore/SpinWheel';
import styles from './page.module.css';

export default function AskPage() {
  const router = useRouter();
  const [winner, setWinner] = useState<WinnerInfo | null>(null);
  const [nickname, setNickname] = useState('');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWinner = localStorage.getItem('paradiseWinner');
      const savedNickname = localStorage.getItem('paradiseNickname');
      const savedContact = localStorage.getItem('paradiseContact');

      if (savedWinner) {
        setWinner(JSON.parse(savedWinner));
      }

      if (savedNickname) {
        setNickname(savedNickname);
      } else if (savedContact) {
        const contact = JSON.parse(savedContact);
        setNickname(contact.fullName?.split(' ')[0] || 'Explorer');
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submit
    router.push('/explore');
  };

  if (!winner) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingDot} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.blob1}
        style={{ backgroundColor: winner.colors[0] }}
      />
      <div
        className={styles.blob2}
        style={{ backgroundColor: winner.colors[1] || winner.colors[0] }}
      />

      {/* Header / Back */}
      <button
        onClick={() => router.back()}
        className={styles.floatingBackBtn}
        type="button"
      >
        <span className="material-symbols-rounded">arrow_back</span>
      </button>

      <div className={styles.contentWrapper}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Profile Info */}
          <div className={styles.profileSection}>
            <div className={styles.avatarWrap}>
              <div
                className={styles.avatarRing}
                style={{ borderColor: winner.colors[0] }}
              >
                <Facehash name={nickname || ' '} size={56} />
              </div>
              <img
                src={winner.image}
                alt={winner.animal}
                className={styles.badge}
              />
            </div>
            <span className={styles.username}>@{nickname}</span>
          </div>

          {/* Inputs */}
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title: What's your question about?"
              className={styles.input}
              required
            />

            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Dive deep into the details..."
              className={styles.textarea}
              required
            />
          </div>

          {/* Submit Button */}
          <div className={styles.submitBtnWrap}>
            <button
              type="submit"
              className={styles.submitBtn}
              style={{
                background: `linear-gradient(180deg, ${winner.colors[0]} 0%, ${winner.colors[1]} 100%)`,
                boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 8px 24px rgba(0, 0, 0, 0.4)`
              }}
            >
              <Send size={18} />
              <span>Submit Question</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
