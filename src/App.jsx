import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useRef, useState } from "react";
import "./App.css";
import CelebrationPage from "./components/CelebrationPage";
import Countdown from "./components/Countdown";
import Effects from "./components/Effects";
import Gallery from "./components/Gallery";
import Hearts from "./components/Hearts";
import MessageCard from "./components/MessageCard";
import MusicPlayer from "./components/MusicPlayer";

gsap.registerPlugin(ScrollToPlugin);

function App() {
  const [currentPage, setCurrentPage] = useState(1); // Start at 1 for Countdown page

  // Check localStorage to persist new year reached state
  // Always show countdown: ignore localStorage and always set to false
  const [newYearReached, setNewYearReached] = useState(false);

  const [showEffects, setShowEffects] = useState(false);

  const page1Ref = useRef(null); // Countdown page
  const page2Ref = useRef(null); // Celebration Page
  const page3Ref = useRef(null); // MessageCard
  const page4Ref = useRef(null); // Gallery
  const musicPlayerRef = useRef(null); // Music player control

  const goToPage = (pageNumber) => {
    const refs = { 1: page1Ref, 2: page2Ref, 3: page3Ref, 4: page4Ref };
    const currentPageRef = refs[currentPage];
    const nextPageRef = refs[pageNumber];
    const isForward = pageNumber > currentPage;
    gsap.to(currentPageRef.current, {
      x: isForward ? "-100%" : "100%",
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    });
    gsap.set(nextPageRef.current, {
      x: isForward ? "100%" : "-100%",
      opacity: 0,
      visibility: "visible",
    });
    gsap.to(nextPageRef.current, {
      x: "0%",
      opacity: 1,
      duration: 0.6,
      ease: "power2.inOut",
      delay: 0.2,
      onComplete: () => {
        setCurrentPage(pageNumber);
        gsap.set(currentPageRef.current, { x: "0%", visibility: "hidden" });
        gsap.to(window, { duration: 0.3, scrollTo: { y: 0 } });
      },
    });
  };

  const handleNewYearReached = () => {
    setNewYearReached(true);
    localStorage.setItem("newYearReached", "true"); // Persist to localStorage
    setShowEffects(true);
    setTimeout(() => setShowEffects(false), 10000);
  };

  return (
    <div className="app">
      <MusicPlayer ref={musicPlayerRef} />
      <Hearts />

      {/* PAGE 1: Countdown Timer */}
      <div
        ref={page1Ref}
        className={`page ${currentPage === 1 ? "active" : ""}`}
        style={{ visibility: currentPage === 1 ? "visible" : "hidden" }}
      >
        <section className="hero">
          <h1 id="heroTitle">
            {newYearReached ? (
              <>
                Happy New Year <span className="highlight">2026</span> 🎆
              </>
            ) : (
              <>
                Counting down to <span className="highlight">2026</span> 🎆
              </>
            )}
          </h1>
          <p>Wishing you a year full of joy, success, and new adventures! 🥂</p>
        </section>

        <Countdown
          onNewYearReached={handleNewYearReached}
          newYearReached={newYearReached}
        />

        <section className="teaser">
          <h2 id="teaserHeading">
            {newYearReached
              ? "🎉 Ready for a fresh start! 🎉"
              : "✨ A spectacular celebration awaits you at midnight... ✨"}
          </h2>
          <p className="teaser-hint">A new chapter is about to begin! 🌟</p>
        </section>

        <button
          id="celebrateBtn"
          className="celebrate-btn"
          disabled={!newYearReached}
          onClick={() => goToPage(2)}
        >
          🎆 Let's Celebrate
        </button>
      </div>

      {/* PAGE 2: Celebration/QNA Page */}
      <div
        ref={page2Ref}
        className={`page ${currentPage === 2 ? "active" : ""}`}
        style={{ visibility: currentPage === 2 ? "visible" : "hidden" }}
      >
        <CelebrationPage
          onComplete={() => goToPage(3)}
          musicPlayerRef={musicPlayerRef}
        />
      </div>

      {/* PAGE 3: Message Card */}
      <div
        ref={page3Ref}
        className={`page ${currentPage === 3 ? "active" : ""}`}
        style={{ visibility: currentPage === 3 ? "visible" : "hidden" }}
      >
        <button className="back-btn" onClick={() => goToPage(2)}>
          ← Back
        </button>
        <MessageCard isActive={currentPage === 3} />
        <button className="page-nav-btn" onClick={() => goToPage(4)}>
          📸 View Some Quotes
        </button>
      </div>

      {/* PAGE 4: Gallery */}
      <div
        ref={page4Ref}
        className={`page ${currentPage === 4 ? "active" : ""}`}
        style={{ visibility: currentPage === 4 ? "visible" : "hidden" }}
      >
        <button className="back-btn" onClick={() => goToPage(3)}>
          ← Back
        </button>
        <Gallery isActive={currentPage === 4} />
        <section className="final">
          <h2 className="final-message">🎆 Cheers to 2026! — Rawdiaries.24 🎆</h2>
          <p className="final-subtitle">May this year bring you endless happiness and success! ✨</p>
        </section>
      </div>

      {/* Effects */}
      {showEffects && <Effects />}
    </div>
  );
}

export default App;