'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import styles from './page.module.css';

interface MerchClientProps {
  items: string[];
}

export default function MerchClient({ items }: MerchClientProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Close modal on escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setSelectedImage(null);
  };

  return (
    <div
      className={styles.container}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
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
          <img src="/assets/paradise.svg" alt="Paradise" className={styles.headerLogo} />
          <span className={styles.headerText}>MERCH</span>
        </div>

        {/* Empty div for flexbox balance */}
        <div style={{ width: 40 }} />
      </header>

      <div className={styles.contentScroll}>
        <div className={styles.contentWrapper}>
          <div className={styles.grid}>
            {items.map((item, index) => (
              <motion.div
                key={item}
                className={styles.card}
                onClick={() => setSelectedImage(item)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src={`/assets/merch/${item}`}
                  alt={`Merch item ${index + 1}`}
                  className={styles.image}
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottomBlur} />

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button
              className={styles.modalCloseBtn}
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>

            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`/assets/merch/${selectedImage}`}
                alt="Expanded merch view"
                className={styles.modalImage}
              />

              <a
                href={`/assets/merch/${selectedImage}`}
                download={selectedImage}
                className={styles.downloadBtn}
              >
                <Download size={20} />
                <span>Download</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
