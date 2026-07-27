'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Countdown } from "@/components/ui/countdown";
import styles from "./page.module.css";

const bgImages = [
  "/assets/merch/The-Paradise-WWM-4.jpg",
  "/assets/merch/The-Paradise-WWM-1.jpg",
  "/assets/merch/The-Paradise-WWM-2.jpg",
  "/assets/merch/The-Paradise-WWM-3.jpg",
];

export default function Home() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const changeBg = () => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
      const nextDelay = Math.random() * (10000 - 5000) + 5000;
      timeoutId = setTimeout(changeBg, nextDelay);
    };

    const initialDelay = Math.random() * (10000 - 5000) + 5000;
    timeoutId = setTimeout(changeBg, initialDelay);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTransitioning(true);
    setTimeout(() => {
      router.push("/explore");
    }, 800);
  };

  const scrollToBuzz = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('buzz')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className={styles.main}>
      <div className={`${styles.hero} ${isTransitioning ? styles.zoomInTransition : ""}`}>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/assets/hero-thumbnail.jpg"
          onCanPlayThrough={() => setHeroLoaded(true)}
          className={styles.videoBackground}
        >
          <source src="https://828w0y4x5k.ufs.sh/f/STslBtUPAU3wUC04S1PB6LbOpi8KV4SN5ZoxheqRcCyFrX3D" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Preload Explore Video once Hero is loaded */}
        {heroLoaded && (
          <video
            preload="auto"
            muted
            playsInline
            poster="/assets/end-frame.png"
            style={{ width: 0, height: 0, position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          >
            <source src="https://828w0y4x5k.ufs.sh/f/STslBtUPAU3wUh13e5PB6LbOpi8KV4SN5ZoxheqRcCyFrX3D" type="video/mp4" />
          </video>
        )}
        <div className={styles.blurOverlay}></div>
        <div className={styles.overlay}></div>

        <div className={styles.topTextWrapper}>
          <h2 className={styles.welcomeText}>Welcome to the world of</h2>
        </div>

        <div className={styles.content}>
          <img src="/assets/paradise.svg" alt="Paradise" className={styles.logoImageNoGlow} />
          <div className={styles.ctas}>
            <button onClick={handleExploreClick} className={styles.primaryBtn}>
              Enter
            </button>
            <button onClick={scrollToBuzz} className={styles.secondaryBtn}>
              Buzz
            </button>
          </div>
        </div>
      </div>

      <section id="buzz" className={styles.buzzSection}>
        <h2 className={styles.buzzTitle}>BUZZ</h2>
        <div className={styles.videoGrid}>
          {/* Video 1 */}
          <div className={styles.videoCard}>
            <div className={styles.videoContainer}>
              <iframe src="https://www.youtube.com/embed/Wgy3Lear20s?si=muHkkEm9FheEtjjS" title="The Spark of Paradise" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>
            <h3 className={styles.cardTitle}>
              <span className={styles.fontBigboz}>The Spark of Paradise</span>
            </h3>
          </div>

          {/* Video 2 */}
          <div className={styles.videoCard}>
            <div className={styles.videoContainer}>
              <iframe src="https://www.youtube.com/embed/NkZFnpDhdCk?si=rGqFr8VWg5cLlw1H" title="The Paradise Glimpse" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>
            <h3 className={styles.cardTitle}>
              <span className={styles.fontBigboz}>The Paradise Glimpse</span>
              <br />
              <span className={styles.fontBrush}>(The Raw Statement)</span>
            </h3>
          </div>

          {/* Video 3 */}
          <div className={styles.videoCard}>
            <div className={styles.videoContainer}>
              <iframe src="https://www.youtube.com/embed/84evu9su5G8?si=YjhqjNL9uvSyb6zM" title="Mohan Babu" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>
            <h3 className={styles.cardTitle}>
              <span className={styles.fontBigboz}>MOHAN BABU</span> / <span className={styles.fontBrush}>Shikanja Maalik</span>
            </h3>
          </div>

          {/* Video 4 */}
          <div className={styles.videoCard}>
            <div className={styles.videoContainer}>
              <iframe src="https://www.youtube.com/embed/sH5GXIlEe-8?si=zv16varhFi3qA7dr" title="Raghav Juyal" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>
            <h3 className={styles.cardTitle}>
              <span className={styles.fontBigboz}>Raghav Juyal</span> / <span className={styles.fontBrush}>Vikram Maalik</span>
            </h3>
          </div>

          {/* Video 5 */}
          <div className={styles.videoCard}>
            <div className={styles.videoContainer}>
              <iframe src="https://www.youtube.com/embed/iAtoZar5W58?si=wFYkQMQwy7gPI_Ny" title="Aaya Sher" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>
            <h3 className={styles.cardTitle}>
              <span className={styles.fontBrush}>Aaya Sher</span>
            </h3>
          </div>
        </div>
      </section>

      {/* Bottom Hero Section */}
      <div className={`${styles.hero} ${isTransitioning ? styles.zoomInTransition : ""}`}>
        {bgImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`Paradise Background ${i}`}
            className={`${styles.videoBackground} ${styles.fadeBg} ${styles.heroImage}`}
            style={{ opacity: i === bgIndex ? 1 : 0 }}
          />
        ))}
        <div className={styles.blurOverlay}></div>
        <div className={styles.overlay}></div>

        <Countdown />

        <div className={styles.content}>
          <img src="/assets/paradise.svg" alt="Paradise" className={styles.logoImageNoGlow} />
        </div>
      </div>
    </main>
  );
}
