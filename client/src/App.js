import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

// Bug 18 — Code splitting: each page loads only when navigated to
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

// Bug 19 — Error Boundary prevents a page crash from blanking the whole app
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('ErrorBoundary caught:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
        <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
          <Routes location={location}>
            <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
            <Route path="/projects" element={<ErrorBoundary><Projects /></ErrorBoundary>} />
            <Route path="/contact" element={<ErrorBoundary><Contact /></ErrorBoundary>} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

/* isMobile never changes after mount — compute once outside the component */
const isMobile = typeof window !== 'undefined'
  ? window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
  : false;

/* ─── Beautiful cursor: one soft glowing orb that follows smoothly ─── */
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pos = useRef({ x: -200, y: -200 });
  const current = useRef({ x: -200, y: -200 });
  const raf = useRef(null);
  // Keep a ref so the mousemove handler can read the latest value
  // without being listed as a useEffect dependency.
  const isVisibleRef = useRef(false);

  useEffect(() => {
    if (isMobile) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const onEnter = () => setIsHovering(true);
    const onLeave = () => setIsHovering(false);

    const animate = () => {
      // Bug 12 — Snappier lerp (was 0.08, felt laggy on fast moves)
      const ease = 0.13;
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

    // Bug 2 — Re-attach hover listeners whenever new elements appear in the DOM
    const attachHoverListeners = () => {
      const tags = document.querySelectorAll('a, button, [role="button"], .filter-btn, .card, input, textarea');
      tags.forEach(el => {
        // Avoid attaching duplicates by removing first
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    attachHoverListeners();

    const observer = new MutationObserver(attachHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('mousemove', onMove);
      observer.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
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
          width: isHovering ? '8px' : '5px',
          height: isHovering ? '8px' : '5px',
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
