import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import './App.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Beautiful cursor: one soft glowing orb that follows smoothly ─── */
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pos = useRef({ x: -200, y: -200 });
  const current = useRef({ x: -200, y: -200 });
  const raf = useRef(null);
  const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;

  useEffect(() => {
    if (isMobile) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onEnter = () => setIsHovering(true);
    const onLeave = () => setIsHovering(false);

    const animate = () => {
      // Very gentle lerp — feels effortless, not jittery
      const ease = 0.08;
      current.current.x += (pos.current.x - current.current.x) * ease;
      current.current.y += (pos.current.y - current.current.y) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${current.current.x}px, ${current.current.y}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', onMove);

    const tags = document.querySelectorAll('a, button, [role="button"], .filter-btn, .card, input, textarea');
    tags.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        willChange: 'transform',
        /* offset so the glow is centred on the cursor hotspot */
        marginLeft: '-24px',
        marginTop: '-24px',
      }}
    >
      {/* Outer soft glow — scales up on hover */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: isHovering
          ? 'radial-gradient(circle, rgba(0,255,170,0.18) 0%, rgba(0,255,170,0.04) 60%, transparent 100%)'
          : 'radial-gradient(circle, rgba(0,255,170,0.10) 0%, rgba(0,255,170,0.02) 60%, transparent 100%)',
        transform: isHovering ? 'scale(2.2)' : 'scale(1)',
        transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), background 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isVisible ? 1 : 0,
        transitionProperty: 'transform, background, opacity',
      }}>
        {/* Inner crisp dot */}
        <div style={{
          width: isHovering ? '5px' : '5px',
          height: isHovering ? '5px' : '5px',
          borderRadius: '50%',
          background: 'var(--color-accent)',
          boxShadow: isHovering
            ? '0 0 0 1.5px rgba(0,255,170,0.4), 0 0 12px rgba(0,255,170,0.6)'
            : '0 0 0 1px rgba(0,255,170,0.3), 0 0 6px rgba(0,255,170,0.4)',
          transition: 'box-shadow 0.3s ease',
          flexShrink: 0,
        }} />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <CustomCursor />

      {/* Background */}
      <div className="bg-pattern" aria-hidden="true">
        <div className="bg-grid-lines" />
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <div className="App">
        <Navbar />
        <ScrollToTop />
        <AnimatedRoutes />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
