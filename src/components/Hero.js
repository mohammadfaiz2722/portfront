import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { Typewriter } from 'react-simple-typewriter';

/* ─────────────────────────────────────────
   SPLASH SCREEN
───────────────────────────────────────── */
const SplashScreen = ({ onEnd }) => {
  const [phase, setPhase] = useState('in'); // 'in' | 'hold' | 'out'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 900);
    const t2 = setTimeout(() => setPhase('out'),  2400);
    const t3 = setTimeout(onEnd, 3300);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onEnd]);

  const letters = 'Mohammad Faiz'.split('');

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: '#000' }}
      animate={{ opacity: phase === 'out' ? 0 : 1 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=DM+Sans:wght@400;500;600&display=swap');
        .splash-letter { display: inline-block; }
        @keyframes splashLine { from { scaleX: 0 } to { scaleX: 1 } }
      `}</style>

      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(97,218,251,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Name */}
      <div style={{ overflow: 'hidden', marginBottom: 8 }}>
        <motion.h1
          style={{
            fontFamily: "'Italiana', serif",
            fontSize: 'clamp(42px, 8vw, 88px)',
            color: '#fff',
            letterSpacing: '0.04em',
            lineHeight: 1,
            margin: 0,
          }}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {letters.map((l, i) => (
            <motion.span
              key={i}
              className="splash-letter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.04, duration: 0.5, ease: 'easeOut' }}
              style={l === ' ' ? { display: 'inline-block', width: '0.35em' } : {}}
            >{l}</motion.span>
          ))}
        </motion.h1>
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: 1,
          width: 200,
          background: 'linear-gradient(90deg, transparent, rgba(97,218,251,0.6), transparent)',
          transformOrigin: 'center',
          margin: '14px 0',
        }}
      />

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
          margin: 0,
        }}
      >
        Web Developer
      </motion.p>

      {/* Corner decorations */}
      {[
        { top: 28, left: 28 },
        { top: 28, right: 28 },
        { bottom: 28, left: 28 },
        { bottom: 28, right: 28 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
          style={{
            position: 'absolute', ...pos,
            width: 20, height: 20,
            borderTop: pos.top !== undefined ? '1px solid rgba(255,255,255,0.15)' : 'none',
            borderBottom: pos.bottom !== undefined ? '1px solid rgba(255,255,255,0.15)' : 'none',
            borderLeft: pos.left !== undefined ? '1px solid rgba(255,255,255,0.15)' : 'none',
            borderRight: pos.right !== undefined ? '1px solid rgba(255,255,255,0.15)' : 'none',
          }}
        />
      ))}
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────── */
const MagneticButton = ({ children }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18 });
  const sy = useSpring(y, { stiffness: 180, damping: 18 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy, display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   FLOATING GRID DOTS (bg texture)
───────────────────────────────────────── */
const GridDots = () => (
  <div style={{
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
    backgroundSize: '44px 44px',
    maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
    WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
  }} />
);

/* ─────────────────────────────────────────
   AMBIENT ORBS
───────────────────────────────────────── */
const orbs = [
  { x: '15%', y: '20%', size: 420, hue: 210, opacity: 0.12, dur: 12 },
  { x: '75%', y: '65%', size: 360, hue: 185, opacity: 0.10, dur: 16 },
  { x: '55%', y: '10%', size: 280, hue: 240, opacity: 0.08, dur: 9  },
];

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
const Hero = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [ready, setReady]           = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax for the blobs
  const blobX = useSpring(useTransform(mouseX, [0, 1], [-18, 18]), { stiffness: 60, damping: 20 });
  const blobY = useSpring(useTransform(mouseY, [0, 1], [-12, 12]), { stiffness: 60, damping: 20 });

  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const handleSplashEnd = () => {
    setShowSplash(false);
    setTimeout(() => setReady(true), 80);
  };

  const stagger = (i) => ({
    initial: { opacity: 0, y: 32 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.8, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div className="relative" id="hero">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=DM+Sans:wght@400;500;600;700&display=swap');

        #hero { isolation: isolate; }

        .hero-section {
          background: #000;
          min-height: 100svh;
          width: 100%;
          max-width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        @keyframes orbFloat {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(20px, -20px) scale(1.06); }
          100% { transform: translate(0, 0) scale(1); }
        }

        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(72px);
          pointer-events: none;
          animation: orbFloat var(--dur) ease-in-out infinite;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 6px 18px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 28px;
        }
        .eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #61DAFB;
          box-shadow: 0 0 8px #61DAFB;
          animation: eyebrowPulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes eyebrowPulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.4); opacity: 0.6; }
        }

        .hero-name {
          font-family: 'Italiana', serif;
          font-size: clamp(54px, 10vw, 110px);
          line-height: 0.92;
          letter-spacing: -0.01em;
          color: #fff;
          margin: 0;
        }
        .hero-name-fill {
          background: linear-gradient(150deg, #ffffff 40%, rgba(255,255,255,0.45) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(16px, 2.2vw, 22px);
          color: rgba(255,255,255,0.45);
          margin: 0;
          font-weight: 400;
          line-height: 1.6;
        }
        .hero-sub .tw-accent {
          color: #61DAFB;
          font-weight: 600;
        }

        .hero-divider {
          height: 1px;
          width: 60px;
          background: linear-gradient(90deg, rgba(97,218,251,0.5), transparent);
          margin: 28px auto;
        }

        /* CTA button */
        .cta-outer {
          position: relative;
          display: inline-flex;
          border-radius: 999px;
          padding: 1.5px;
          background: linear-gradient(135deg, rgba(97,218,251,0.6), rgba(150,100,255,0.5));
          box-shadow: 0 0 24px rgba(97,218,251,0.2);
          transition: box-shadow 0.3s;
        }
        .cta-outer:hover {
          box-shadow: 0 0 36px rgba(97,218,251,0.35);
        }
        .cta-inner {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 34px;
          border-radius: 999px;
          background: #000;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          text-decoration: none;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: background 0.3s;
          position: relative;
          overflow: hidden;
        }
        .cta-inner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(97,218,251,0.08), rgba(150,100,255,0.08));
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: inherit;
        }
        .cta-outer:hover .cta-inner::before { opacity: 1; }

        .cta-arrow {
          transition: transform 0.3s ease;
        }
        .cta-outer:hover .cta-arrow { transform: translateY(2px); }

        /* Scroll hint */
        .scroll-hint {
          position: absolute;
          bottom: 36px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          cursor: pointer;
        }
        .scroll-mouse {
          width: 22px; height: 34px;
          border: 1.5px solid rgba(255,255,255,0.15);
          border-radius: 11px;
          display: flex;
          justify-content: center;
          padding-top: 6px;
        }
        .scroll-wheel {
          width: 3px; height: 6px;
          background: rgba(255,255,255,0.4);
          border-radius: 2px;
          animation: scrollWheel 1.8s ease-in-out infinite;
        }
        @keyframes scrollWheel {
          0%   { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }

        /* Side stat tags */
        .stat-tag {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          font-family: 'DM Sans', sans-serif;
        }
        .stat-tag-num {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }
        .stat-tag-label {
          font-size: 10px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          line-height: 1.4;
        }

        @media (max-width: 767px) {
          .stat-tag { display: none; }
          .hero-divider { margin: 20px auto; }
        }
      `}</style>

      <AnimatePresence>
        {showSplash && <SplashScreen onEnd={handleSplashEnd} />}
      </AnimatePresence>

      <section className="hero-section">
        {/* Grid dot texture */}
        <GridDots />

        {/* Ambient orbs */}
        {orbs.map((orb, i) => (
          <motion.div
            key={i}
            className="hero-orb"
            style={{
              left: orb.x, top: orb.y,
              width: orb.size, height: orb.size,
              background: `hsl(${orb.hue}, 70%, 60%)`,
              opacity: orb.opacity,
              '--dur': `${orb.dur}s`,
              x: blobX,
              y: blobY,
            }}
          />
        ))}

        {/* Floating stat tags */}
        <motion.div
          className="stat-tag"
          style={{ left: '6%', top: '38%' }}
          {...stagger(4)}
        >
          <div>
            <div className="stat-tag-num">3+</div>
            <div className="stat-tag-label">Years<br />Coding</div>
          </div>
        </motion.div>

        <motion.div
          className="stat-tag"
          style={{ right: '6%', top: '42%' }}
          {...stagger(5)}
        >
          <div>
            <div className="stat-tag-num">10+</div>
            <div className="stat-tag-label">Projects<br />Built</div>
          </div>
        </motion.div>

        {/* Center content */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 10, padding: '0 24px' }}>

          <motion.div {...stagger(0)}>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Available for work
            </div>
          </motion.div>

          <motion.div {...stagger(1)}>
            <h1 className="hero-name">
              <span className="hero-name-fill">Mohammad Faiz</span>
            </h1>
          </motion.div>

          <motion.div {...stagger(2)}>
            <div className="hero-divider" />
          </motion.div>

          <motion.div {...stagger(2)}>
            <p className="hero-sub">
              I'm a{' '}
              <span className="tw-accent">
                <Typewriter
                  words={['Web Developer', 'MERN Stack Dev', 'Next.js Engineer', 'Coder', 'Gamer']}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={65}
                  deleteSpeed={40}
                  delaySpeed={1200}
                />
              </span>
              <span style={{ color: 'rgba(255,255,255,0.28)', marginLeft: 8, fontStyle: 'italic' }}>
                — building things for the web.
              </span>
            </p>
          </motion.div>

          <motion.div {...stagger(3)} style={{ marginTop: 40 }}>
            <MagneticButton>
              <div className="cta-outer">
                <ScrollLink to="projects" smooth duration={500} className="cta-inner">
                  View My Work
                  <svg
                    className="cta-arrow"
                    width="14" height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                </ScrollLink>
              </div>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <ScrollLink to="about" smooth duration={600}>
          <motion.div
            className="scroll-hint"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div className="scroll-mouse">
              <div className="scroll-wheel" />
            </div>
            Scroll
          </motion.div>
        </ScrollLink>
      </section>
    </div>
  );
};

export default Hero;