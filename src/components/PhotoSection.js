import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const photo = '/YumaKuga.jpg';

/* ── Tilt photo frame ── */
const TiltPhoto = ({ src, inView }) => {
  const ref = useRef(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sX = useSpring(rotX, { stiffness: 160, damping: 22 });
  const sY = useSpring(rotY, { stiffness: 160, damping: 22 });
  const glowX = useTransform(sY, [-20, 20], ['0%', '100%']);
  const glowY = useTransform(sX, [-20, 20], ['0%', '100%']);

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    rotY.set(((e.clientX - cx) / rect.width)  * 20);
    rotX.set(((cy - e.clientY) / rect.height) * 20);
  };
  const onLeave = () => { rotX.set(0); rotY.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, x: -60, scale: 0.92 }}
      animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900, display: 'flex', justifyContent: 'center' }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: sX, rotateY: sY, transformStyle: 'preserve-3d', position: 'relative' }}
        className="photo-tilt-wrap"
      >
        {/* Outer glow ring */}
        <motion.div
          className="photo-glow-ring"
          style={{
            background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(97,218,251,0.35) 0%, rgba(150,80,255,0.2) 50%, transparent 70%)`,
          }}
        />

        {/* Frame border */}
        <div className="photo-frame-border" />

        {/* Corner accents */}
        {[
          { top: -6, left: -6 },
          { top: -6, right: -6 },
          { bottom: -6, left: -6 },
          { bottom: -6, right: -6 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="photo-corner"
            style={pos}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
          />
        ))}

        {/* Photo */}
        <div className="photo-clip">
          <img
            src={src}
            alt="Mohammad Faiz"
            className="photo-img"
          />
          {/* Overlay shimmer */}
          <div className="photo-shimmer" />
        </div>

        {/* Floating badge */}
        <motion.div
          className="photo-badge"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: 0.75, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="badge-dot" />
          <span className="badge-text">Open to Work</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/* ── Stat pill ── */
const StatPill = ({ value, label, delay, inView }) => (
  <motion.div
    className="stat-pill"
    initial={{ opacity: 0, y: 16 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  >
    <span className="stat-value">{value}</span>
    <span className="stat-label">{label}</span>
  </motion.div>
);

/* ── Main ── */
const PhotoSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);

  const stagger = (i, from = 'bottom') => ({
    initial: { opacity: 0, y: from === 'bottom' ? 30 : -30 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.75, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=DM+Sans:wght@400;500;600;700&display=swap');

        #about {
          background: #000;
          padding: 120px 0;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          font-family: 'DM Sans', sans-serif;
        }

        /* grid bg */
        #about::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, black, transparent);
          -webkit-mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, black, transparent);
          pointer-events: none;
        }

        /* ambient blobs */
        .about-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          opacity: 0.1;
          animation: blobDrift 14s ease-in-out infinite alternate;
        }
        @keyframes blobDrift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(30px,-30px) scale(1.1); }
        }

        /* ── photo tilt ── */
        .photo-tilt-wrap {
          position: relative;
          width: clamp(280px, 38vw, 420px);
          cursor: none;
        }

        .photo-glow-ring {
          position: absolute;
          inset: -24px;
          border-radius: 28px;
          z-index: 0;
          pointer-events: none;
          transition: opacity 0.3s;
          filter: blur(20px);
        }

        .photo-frame-border {
          position: absolute;
          inset: 0;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.1);
          z-index: 2;
          pointer-events: none;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .photo-corner {
          position: absolute;
          width: 14px; height: 14px;
          border-color: rgba(97,218,251,0.55);
          border-style: solid;
          z-index: 3;
        }
        .photo-corner:nth-child(3) { border-width: 1.5px 0 0 1.5px; border-radius: 3px 0 0 0; }
        .photo-corner:nth-child(4) { border-width: 1.5px 1.5px 0 0; border-radius: 0 3px 0 0; }
        .photo-corner:nth-child(5) { border-width: 0 0 1.5px 1.5px; border-radius: 0 0 0 3px; }
        .photo-corner:nth-child(6) { border-width: 0 1.5px 1.5px 0; border-radius: 0 0 3px 0; }

        .photo-clip {
          position: relative;
          border-radius: 22px;
          overflow: hidden;
          z-index: 1;
        }

        .photo-img {
          width: 100%;
          aspect-ratio: 4/5;
          object-fit: cover;
          display: block;
          filter: saturate(0.9) contrast(1.05);
          transition: filter 0.4s;
        }
        .photo-tilt-wrap:hover .photo-img { filter: saturate(1.1) contrast(1.05); }

        .photo-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            transparent 40%,
            rgba(255,255,255,0.04) 50%,
            transparent 60%
          );
          transform: translateX(-100%);
          pointer-events: none;
        }
        .photo-tilt-wrap:hover .photo-shimmer {
          transform: translateX(200%);
          transition: transform 0.7s ease;
        }

        .photo-badge {
          position: absolute;
          bottom: -18px;
          right: -18px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 999px;
          background: rgba(8,8,14,0.9);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(16px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07);
          z-index: 4;
        }
        .badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px #4ade80;
          animation: badgePulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes badgePulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.5); opacity: 0.5; }
        }
        .badge-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        /* ── text side ── */
        .about-text-side {
          max-width: 520px;
        }

        .about-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 20px;
        }
        .about-eyebrow-line {
          height: 1px;
          width: 36px;
          background: linear-gradient(90deg, rgba(97,218,251,0.6), transparent);
        }

        .about-heading {
          font-family: 'Italiana', serif;
          font-size: clamp(54px, 7vw, 84px);
          line-height: 0.92;
          margin: 0 0 6px;
          background: linear-gradient(145deg, #fff 45%, rgba(255,255,255,0.45));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .about-accent-line {
          height: 2px;
          width: 56px;
          background: linear-gradient(90deg, #61DAFB, rgba(150,80,255,0.6));
          border-radius: 999px;
          margin: 22px 0 26px;
        }

        .about-body {
          font-size: 16px;
          line-height: 1.8;
          color: rgba(255,255,255,0.45);
          margin: 0 0 32px;
        }
        .about-body strong {
          color: rgba(255,255,255,0.75);
          font-weight: 600;
        }

        /* stats row */
        .stats-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }
        .stat-pill {
          display: flex;
          flex-direction: column;
          padding: 14px 20px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          gap: 2px;
          min-width: 90px;
        }
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }
        .stat-label {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
        }

        /* tags */
        .about-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .about-tag {
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.05em;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.45);
          transition: color 0.2s, border-color 0.2s, background 0.2s;
          cursor: default;
        }
        .about-tag:hover {
          color: #61DAFB;
          border-color: rgba(97,218,251,0.3);
          background: rgba(97,218,251,0.06);
        }

        /* scroll cue */
        .about-scroll-cue {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 42px;
          color: rgba(255,255,255,0.2);
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          width: fit-content;
          transition: color 0.25s;
        }
        .about-scroll-cue:hover { color: rgba(255,255,255,0.45); }
        .about-scroll-line {
          height: 1px;
          width: 48px;
          background: currentColor;
          transition: width 0.3s;
        }
        .about-scroll-cue:hover .about-scroll-line { width: 72px; }

        /* layout */
        .about-inner {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: clamp(48px, 8vw, 96px);
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 32px;
        }
        @media (max-width: 900px) {
          .about-inner {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .about-text-side { max-width: 100%; }
          .about-eyebrow, .stats-row, .about-tags, .about-scroll-cue { justify-content: center; }
          .about-accent-line { margin-left: auto; margin-right: auto; }
        }
      `}</style>

      <section id="about">
        {/* Ambient blobs */}
        <div className="about-blob" style={{ left: '5%',  top: '10%', width: 400, height: 400, background: 'hsl(200,70%,55%)' }} />
        <div className="about-blob" style={{ right: '5%', bottom: '15%', width: 320, height: 320, background: 'hsl(270,60%,55%)', animationDelay: '-6s' }} />

        <div className="about-inner" ref={ref}>

          {/* Photo */}
          <div style={{ flexShrink: 0 }}>
            <TiltPhoto src={photo} inView={inView} />
          </div>

          {/* Text */}
          <div className="about-text-side">

            <motion.div {...stagger(0)}>
              <div className="about-eyebrow">
                <span className="about-eyebrow-line" />
                Who I Am
              </div>
            </motion.div>

            <motion.div {...stagger(1)}>
              <h2 className="about-heading">About Me</h2>
            </motion.div>

            <motion.div {...stagger(2)}>
              <div className="about-accent-line" />
            </motion.div>

            <motion.div {...stagger(3)}>
              <p className="about-body">
                I'm a passionate <strong>Full Stack Developer</strong> specializing in the{' '}
                <strong>MERN stack</strong> and <strong>Next.js</strong>. I love turning complex
                problems into elegant, fast, and accessible web experiences — from pixel-perfect
                UIs to robust backend systems.
              </p>
            </motion.div>

            {/* Stats */}
            <div className="stats-row">
              <StatPill value="3+"  label="Years exp."   delay={0.45} inView={inView} />
              <StatPill value="10+" label="Projects"     delay={0.55} inView={inView} />
              <StatPill value="∞"   label="Curiosity"    delay={0.65} inView={inView} />
            </div>

            {/* Tech tags */}
            <motion.div {...stagger(5)}>
              <div className="about-tags">
                {['React', 'Next.js', 'Node.js', 'MongoDB', 'Tailwind', 'TypeScript'].map(tag => (
                  <span key={tag} className="about-tag">{tag}</span>
                ))}
              </div>
            </motion.div>

            {/* Scroll cue */}
            <motion.div {...stagger(6)}>
              <div className="about-scroll-cue">
                <span className="about-scroll-line" />
                Scroll to explore
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
};

export default PhotoSection;