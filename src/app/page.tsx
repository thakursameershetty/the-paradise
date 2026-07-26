"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTransitioning(true);
    setTimeout(() => {
      router.push("/explore");
    }, 800);
  };

  return (
    <div className={`${styles.hero} ${isTransitioning ? styles.zoomInTransition : ""}`}>
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={styles.videoBackground}
      >
        <source src="https://828w0y4x5k.ufs.sh/f/STslBtUPAU3wUC04S1PB6LbOpi8KV4SN5ZoxheqRcCyFrX3D" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.blurOverlay}></div>
      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <h2 className={styles.welcomeText}>Welcome to the world of</h2>
        <img src="/assets/paradise.svg" alt="Paradise" className={styles.logoImage} />
        <div className={styles.ctas}>
          <button onClick={handleExploreClick} className={styles.primaryBtn}>
            Enter
          </button>
          <a href="#about" className={styles.secondaryBtn}>
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}
