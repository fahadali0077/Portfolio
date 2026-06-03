import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useSpring, useInView, animate } from 'framer-motion';

/* ───────────────────────────────────────────────
   ScrollProgressBar
   A thin gradient bar pinned to the top of the viewport
   that fills as the user scrolls the whole page.
   ─────────────────────────────────────────────── */
export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  return <motion.div className="scroll-progress-bar" style={{ scaleX }} aria-hidden="true" />;
};

/* ───────────────────────────────────────────────
   MagneticButton
   Wraps any clickable element and pulls it gently
   toward the cursor for a tactile, premium feel.
   Disabled automatically on touch / reduced-motion.
   ─────────────────────────────────────────────── */
const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isTouch =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches;

export const Magnetic = ({ children, strength = 0.35, className = '' }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = useCallback(
    (e) => {
      if (prefersReduced || isTouch || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      setPos({ x: x * strength, y: y * strength });
    },
    [strength]
  );

  const reset = useCallback(() => setPos({ x: 0, y: 0 }), []);

  return (
    <motion.div
      ref={ref}
      className={`magnetic ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.4 }}
      style={{ display: 'inline-flex' }}
    >
      {children}
    </motion.div>
  );
};

/* ───────────────────────────────────────────────
   CountUp
   Animates a number from 0 → target when scrolled
   into view. Keeps any non-digit suffix (e.g. "+").
   ─────────────────────────────────────────────── */
export const CountUp = ({ value, duration = 1.8, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState('0');

  // Split "15+" → number 15, suffix "+"
  const match = String(value).match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : String(value);

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setDisplay(`${target}${suffix}`);
      return;
    }
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(`${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, target, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};

/* ───────────────────────────────────────────────
   Spotlight
   Tracks the cursor inside a card and exposes
   --mx / --my CSS vars so a radial glow can follow it.
   Wrap a card; add the `.spotlight` class for styling.
   ─────────────────────────────────────────────── */
export const Spotlight = ({ children, className = '', as: Tag = 'div', ...rest }) => {
  const ref = useRef(null);

  const handleMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    ref.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <Tag
      ref={ref}
      className={`spotlight ${className}`}
      onMouseMove={handleMove}
      {...rest}
    >
      {children}
    </Tag>
  );
};
