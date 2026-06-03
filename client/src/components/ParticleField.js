import React, { useRef, useEffect } from 'react';
import './ParticleField.css';

/*
  ParticleField — a lightweight 2D canvas constellation effect.

  Chosen over a full Three.js/WebGL scene deliberately: it gives the
  same "alive" hero feeling at a fraction of the bundle size and GPU
  cost, runs smoothly on low-end laptops, and degrades gracefully.

  Behaviour:
   - Floating accent-coloured nodes drift slowly.
   - Nearby nodes link with faint lines (denser = brighter).
   - Lines also reach toward the cursor, so the field reacts to the user.
   - Pauses when scrolled off-screen (IntersectionObserver).
   - Fully disabled under prefers-reduced-motion.
   - DPR-aware so it stays crisp on retina displays.
*/
const ParticleField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];
    let raf = null;
    let running = true;

    const mouse = { x: -9999, y: -9999 };

    // Fewer particles on small screens — keeps phones smooth.
    const densityFor = (w) => {
      if (w < 600) return 28;
      if (w < 1100) return 48;
      return 70;
    };

    const linkDist = 130; // px in CSS space
    const mouseDist = 180;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    const initParticles = () => {
      const count = densityFor(width);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
      }));
    };

    const step = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      // Move + draw nodes
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 170, 0.55)';
        ctx.fill();
      }

      // Links between nearby nodes
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * 0.18;
            ctx.strokeStyle = `rgba(0, 255, 170, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Links toward the cursor
        const mdx = a.x - mouse.x;
        const mdy = a.y - mouse.y;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < mouseDist) {
          const alpha = (1 - mdist / mouseDist) * 0.4;
          ctx.strokeStyle = `rgba(128, 255, 212, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(step);
    };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    // Pause rendering when the hero scrolls out of view.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(step);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    raf = requestAnimationFrame(step);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />;
};

export default ParticleField;
