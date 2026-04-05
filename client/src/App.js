import React, { useEffect, useRef } from 'react';
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

function App() {
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const outline = cursorOutlineRef.current;
    if (!dot || !outline) return;

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const animateOutline = () => {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      outline.style.left = `${outlineX}px`;
      outline.style.top = `${outlineY}px`;
      requestAnimationFrame(animateOutline);
    };

    window.addEventListener('mousemove', moveCursor);
    animateOutline();

    // Hover effect on interactive elements
    const handleHoverIn = () => {
      dot.style.width = '16px';
      dot.style.height = '16px';
      outline.style.width = '56px';
      outline.style.height = '56px';
      outline.style.opacity = '0.3';
    };
    const handleHoverOut = () => {
      dot.style.width = '8px';
      dot.style.height = '8px';
      outline.style.width = '36px';
      outline.style.height = '36px';
      outline.style.opacity = '0.6';
    };

    const interactables = document.querySelectorAll('a, button, .card, .filter-btn');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', handleHoverIn);
      el.addEventListener('mouseleave', handleHoverOut);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <Router>
      {/* Custom Cursor (desktop only) */}
      <div
        ref={cursorDotRef}
        style={{
          position: 'fixed', width: '8px', height: '8px',
          background: 'var(--color-accent)', borderRadius: '50%',
          pointerEvents: 'none', zIndex: 99999,
          transform: 'translate(-50%,-50%)', transition: 'width 0.2s, height 0.2s',
          mixBlendMode: 'difference',
          display: window.innerWidth < 768 ? 'none' : 'block'
        }}
      />
      <div
        ref={cursorOutlineRef}
        style={{
          position: 'fixed', width: '36px', height: '36px',
          border: '1.5px solid var(--color-accent)', borderRadius: '50%',
          pointerEvents: 'none', zIndex: 99998,
          transform: 'translate(-50%,-50%)', opacity: 0.6,
          transition: 'width 0.2s, height 0.2s, opacity 0.2s',
          display: window.innerWidth < 768 ? 'none' : 'block'
        }}
      />

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
