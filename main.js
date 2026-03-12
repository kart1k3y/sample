document.addEventListener("DOMContentLoaded", (event) => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initialize smooth scroll (Lenis)
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

    // --- HERO ANIMATION (Zooms out to the text MINECRAFT) ---
    let heroTl = gsap.timeline();

    // The background image starts scaled in and blurred, then zooms out (scale down)
    heroTl.fromTo(".hero-image",
        { scale: 2.5, filter: "brightness(0.3) blur(20px)" },
        { scale: 1, filter: "brightness(0.7) blur(0px)", duration: 2.5, ease: "power4.inOut" }
    );

    // The text MINECRAFT starts massive, then scales out to fit the screen
    heroTl.fromTo(".hero-title",
        { scale: 6, opacity: 0, letterSpacing: "100px" },
        { scale: 1, opacity: 1, letterSpacing: "2px", duration: 2, ease: "power3.out" },
        "-=1.8"
    );

    // Subtitle fade in
    heroTl.fromTo(".hero-subtitle",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
        "-=1"
    );

    // Fade in scroll indicator
    heroTl.fromTo(".scroll-indicator",
        { opacity: 0 },
        { opacity: 1, duration: 1 },
        "-=0.5"
    );

    // --- SCROLL ANIMATIONS ---

    // Parallax on Hero Section
    gsap.to(".hero-image", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.to(".hero-title", {
        yPercent: 80,
        opacity: 0,
        scale: 0.9,
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Items Section: Cards Stagger In
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

    // Characters Section: Parallax effect based on data-speed
    gsap.utils.toArray('.char-card').forEach(card => {
        let speed = card.getAttribute('data-speed');
        gsap.fromTo(card, 
            { y: () => (parseFloat(speed) - 1) * -150 },
            { 
                y: () => (parseFloat(speed) - 1) * 150,
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

    // Intro for characters section titles
    gsap.from(".characters .section-title", {
        x: -50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: ".characters",
            start: "top 80%"
        }
    });

    // Features Section: Bento Box reveal
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
});
