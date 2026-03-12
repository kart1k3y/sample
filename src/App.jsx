import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from '@studio-freight/lenis';
import './App.css';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

function App() {
  const container = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- LOADING ANIMATION ---
  useEffect(() => {
    // Force the browser to start at the top of the page on a fresh reload
    window.scrollTo(0, 0);
    // Lock native scrolling so the user cannot scroll the page behind the loading screen!
    // This guarantees the GSAP ScrollTriggers calculate precisely at y:0 when loading finishes.
    document.body.style.overflow = "hidden";

    // Simulate a Minecraft terrain generation / loading process
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
        // Release the scroll lock so Lenis can take over
        document.body.style.overflow = ""; 
      }
    });

    tl.to(".loading-bar", {
      width: "100%",
      duration: 2.5,
      ease: "power1.inOut"
    });
    
    tl.to(".loading-screen", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut"
    });
  }, []);

  useGSAP(() => {
    if (isLoading) return; // Wait for loading to finish

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const mm = gsap.matchMedia();

    mm.add("(min-width: 320px)", () => {
      // --- HERO SCROLL-ZOOM ANIMATION ---
      
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "+=150%", 
          scrub: 1.5,
          pin: true
        }
      });

      // Step 1: The completely black mask fades IN instantly over the first scroll tick.
      heroTl.to(".hero-multiply-mask", { opacity: 1, duration: 0.5, ease: "none" }, 0);

      // Step 2: The massively scaled CSS mask natively shrinks down to scale(1).
      // Because transform-origin is CSS centered, it will perfectly close in from
      // all 4 edges of the screen simultaneously.
      heroTl.to(".hero-multiply-mask", { scale: 1, duration: 2, ease: "power2.out" }, 0);

      // --- OTHER SCROLL ANIMATIONS ---

      // Parallax removed from Hero since we pin it for the zoom effect

    // Items Section Reveal
    gsap.from(".item-card", {
      y: 100,
      opacity: 0,
      scale: 0.9,
      stagger: 0.15,
      duration: 1,
      ease: "back.out(1.5)",
      scrollTrigger: {
        trigger: ".items",
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    });

    // Characters Section Parallax
    gsap.utils.toArray('.char-card').forEach((card) => {
      const speed = parseFloat(card.getAttribute('data-speed'));
      gsap.fromTo(card, 
        { y: (speed - 1) * -150 },
        { 
          y: (speed - 1) * 150,
          ease: "none",
          scrollTrigger: {
            trigger: ".characters",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        }
      );
    });

    // Character Title Intro
    gsap.from(".characters .section-title", {
      x: -50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: ".characters",
        start: "top 80%"
      }
    });

    // Features Section Reveal
    gsap.from(".bento-item", {
      scale: 0.8,
      opacity: 0,
      rotation: 2,
      y: 50,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".features",
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    });

    // Navbar backdrop blur on scroll
    gsap.to(".navbar", {
      backgroundColor: "rgba(9, 9, 11, 0.9)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      duration: 0.3,
      scrollTrigger: {
        trigger: "body",
        start: "100px top",
        toggleActions: "play none none reverse"
      }
    });
    
    }); // End MatchMedia

    // Cleanup on unmount
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: container, dependencies: [isLoading] }); // Add dependencies

  return (
    <div ref={container} className="app-container">
      {/* LOADING SCREEN */}
      {isLoading && (
        <div className="loading-screen">
          <div className="loading-logo">Mojang</div>
          <div className="loading-bar-container">
            <div className="loading-bar"></div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">MINECRAFT</div>
        <div className="nav-links">
          <a href="#items">Items</a>
          <a href="#characters">Characters</a>
          <a href="#features">Features</a>
          <a href="#" className="btn-glow">Play Now</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-sticky-container">
          
          {/* The Solid Background Image */}
          <div className="hero-image-bg"></div>

          {/* The Pure CSS Multiply Mask */}
          {/* mix-blend-mode: multiply turns the white text 100% transparent, and the black background 100% solid! */}
          <div className="hero-multiply-mask">
            <h1 className="hero-multiply-text">MINECRAFT</h1>
          </div>

          <div className="scroll-indicator" style={{bottom: "10vh", zIndex: 10}}>
            <div className="mouse"><div className="wheel"></div></div>
          </div>
        </div>
      </section>

      {/* Items Section */}
      <section className="items" id="items">
        <h2 className="section-title">Legendary <span className="highlight-blue">Items</span></h2>
        <div className="items-grid">
          <div className="item-card">
            <div className="item-icon diamond"></div>
            <h3>Diamond</h3>
            <p>The core of durability, forged deep within the earth to withstand any trial.</p>
          </div>
          <div className="item-card">
            <div className="item-icon pickaxe"></div>
            <h3>Netherite Pickaxe</h3>
            <p>Break boundaries faster than ever with the hardest material known.</p>
          </div>
          <div className="item-card">
            <div className="item-icon potion"></div>
            <h3>Potion of Healing</h3>
            <p>Instant rejuvenation and vitality in the absolute heat of battle.</p>
          </div>
        </div>
      </section>

      {/* Characters Section */}
      <section className="characters" id="characters">
        <h2 className="section-title">Meet the <span className="highlight-green">Characters</span></h2>
        <div className="char-container">
          <div className="char-card" data-speed="1.2">
            <div className="char-img steve"></div>
            <div className="char-info">
              <h3>Steve</h3>
              <p>The original explorer, building grand structures across infinite possibilities.</p>
            </div>
          </div>
          <div className="char-card" data-speed="0.8">
            <div className="char-img alex"></div>
            <div className="char-info">
              <h3>Alex</h3>
              <p>Agile, smart, and always ready to craft the next brilliant machinery.</p>
            </div>
          </div>
          <div className="char-card" data-speed="1.1">
            <div className="char-img creeper"></div>
            <div className="char-info">
              <h3>Creeper</h3>
              <p>An explosive personality waiting silently to strike when you least expect.</p>
            </div>
          </div>
          <div className="char-card" data-speed="0.9">
            <div className="char-img enderman"></div>
            <div className="char-info">
              <h3>Enderman</h3>
              <p>A mysterious teleporter from the void. Whatever you do, don't look.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <h2 className="section-title">Limitless <span className="highlight-orange">Features</span></h2>
        <div className="bento-box">
          <div className="bento-item bento-large">
            <div className="bento-icon">🏔️</div>
            <h3>Infinite Generation</h3>
            <p>Every world is a completely unique seed holding endless possibilities, towering mountains, and deep, sprawling cave systems waiting to be discovered.</p>
          </div>
          <div className="bento-item">
            <div className="bento-icon">⚙️</div>
            <h3>Redstone Logic</h3>
            <p>Build complex contraptions, automated farms, and complete computers using power mechanics.</p>
          </div>
          <div className="bento-item">
            <div className="bento-icon">🌳</div>
            <h3>Dynamic Biomes</h3>
            <p>Journey from frozen jagged peaks to lush glowing caves, each with unique flora and fauna.</p>
          </div>
          <div className="bento-item bento-wide">
            <div className="bento-icon">🌍</div>
            <h3>Multiplayer Realms</h3>
            <p>Survive and thrive with your friends across devices, establishing economies, waging wars, or building grand collaborative empires together on persistent servers.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>Minecraft GSAP Experience &copy; 2026. Built by Antigravity.</p>
      </footer>
    </div>
  );
}

export default App;
