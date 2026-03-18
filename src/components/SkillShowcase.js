import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const services = [
  {
    title: 'Web Development',
    description: 'Building responsive, performant web applications with MERN stack and Next.js — from idea to deployment.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    accent: '#61DAFB',
    number: '01',
  },
  {
    title: 'UI/UX Design',
    description: 'Crafting interfaces that feel intuitive and look stunning — pixel-perfect layouts with thoughtful user flows.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/>
        <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/>
        <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/>
        <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/>
        <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>
      </svg>
    ),
    accent: '#a78bfa',
    number: '02',
  },
  {
    title: 'SEO Optimization',
    description: 'Improving visibility with technical SEO, performance tuning, and structured data — drive real organic traffic.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
    accent: '#34d399',
    number: '03',
  },
  {
    title: 'Content Creation',
    description: 'Writing compelling copy, docs, and blog content that resonates with your audience and converts.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    accent: '#fbbf24',
    number: '04',
  },
  {
    title: 'E-commerce Solutions',
    description: 'End-to-end e-commerce platforms with cart, auth, payments, and admin dashboards — ready to scale.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
    accent: '#fb7185',
    number: '05',
  },
];

/* ── Tilt Card ── */
const ServiceCard = ({ service, index, inView }) => {
  const ref = useRef(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sX = useSpring(rotX, { stiffness: 170, damping: 22 });
  const sY = useSpring(rotY, { stiffness: 170, damping: 22 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    rotY.set(((e.clientX - rect.left - rect.width  / 2) / rect.width)  * 14);
    rotX.set(((rect.top  + rect.height / 2 - e.clientY) / rect.height) * 14);
  };
  const onLeave = () => { rotX.set(0); rotY.set(0); setHovered(false); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.93 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.11, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onMouseEnter={() => setHovered(true)}
        style={{ rotateX: sX, rotateY: sY, transformStyle: 'preserve-3d' }}
        className="svc-card"
      >
        {/* Accent top bar */}
        <div className="svc-top-bar" style={{ background: service.accent }} />

        {/* Hover glow */}
        <div
          className="svc-glow"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${service.accent}1a 0%, transparent 70%)`,
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Shine sweep */}
        <div className="svc-shine" />

        <div className="svc-body">
          {/* Number + icon row */}
          <div className="svc-top-row">
            <span className="svc-number">{service.number}</span>
            <div
              className="svc-icon-wrap"
              style={{
                color: service.accent,
                boxShadow: hovered ? `0 0 20px ${service.accent}44` : 'none',
                borderColor: hovered ? `${service.accent}44` : 'rgba(255,255,255,0.08)',
                transition: 'box-shadow 0.3s, border-color 0.3s',
              }}
            >
              {service.icon}
            </div>
          </div>

          {/* Title */}
          <h3 className="svc-title" style={{ color: hovered ? '#fff' : 'rgba(255,255,255,0.85)' }}>
            {service.title}
          </h3>

          {/* Accent underline */}
          <div
            className="svc-underline"
            style={{
              background: service.accent,
              width: hovered ? '100%' : '28px',
            }}
          />

          {/* Description */}
          <p className="svc-desc">{service.description}</p>

          {/* Hover CTA */}
          <div className="svc-cta" style={{ opacity: hovered ? 1 : 0, color: service.accent }}>
            <span>Learn more</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Main ── */
const ServicesSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=DM+Sans:wght@400;500;600;700&display=swap');

        #services {
          background: #000;
          padding: 120px 0 140px;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          font-family: 'DM Sans', sans-serif;
        }

        #services::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 90% 70% at 50% 50%, black, transparent);
          -webkit-mask-image: radial-gradient(ellipse 90% 70% at 50% 50%, black, transparent);
          pointer-events: none;
        }

        .svc-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(110px);
          pointer-events: none;
          opacity: 0.08;
          animation: svcBlobDrift 18s ease-in-out infinite alternate;
        }
        @keyframes svcBlobDrift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(-30px, 30px) scale(1.1); }
        }

        /* header */
        .svc-header {
          text-align: center;
          margin-bottom: 68px;
          padding: 0 24px;
        }
        .svc-eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 20px;
        }
        .svc-eyebrow-line {
          height: 1px;
          width: 44px;
          background: linear-gradient(90deg, rgba(97,218,251,0.55), transparent);
        }
        .svc-eyebrow-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
        }
        .svc-heading {
          font-family: 'Italiana', serif;
          font-size: clamp(52px, 8vw, 90px);
          line-height: 0.92;
          margin: 0 0 18px;
          background: linear-gradient(145deg, #fff 40%, rgba(255,255,255,0.4));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .svc-subtext {
          font-size: 15px;
          color: rgba(255,255,255,0.3);
          max-width: 400px;
          margin: 0 auto;
          line-height: 1.75;
        }

        /* grid */
        .svc-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 28px;
        }
        @media (max-width: 1100px) { .svc-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 700px)  { .svc-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 440px)  { .svc-grid { grid-template-columns: 1fr; } }

        /* card */
        .svc-card {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          transition: border-color 0.3s, box-shadow 0.3s;
          cursor: default;
        }
        .svc-card:hover {
          border-color: rgba(255,255,255,0.13);
          box-shadow: 0 20px 56px rgba(0,0,0,0.55);
        }

        .svc-top-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          z-index: 4;
          opacity: 0.75;
        }

        .svc-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          transition: opacity 0.4s;
        }

        .svc-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 38%,
            rgba(255,255,255,0.04) 50%,
            transparent 62%
          );
          transform: translateX(-100%);
          pointer-events: none;
          z-index: 1;
          border-radius: inherit;
        }
        .svc-card:hover .svc-shine {
          transform: translateX(200%);
          transition: transform 0.65s ease;
        }

        .svc-body {
          position: relative;
          z-index: 2;
          padding: 26px 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: 100%;
        }

        .svc-top-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .svc-number {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.15);
          font-family: 'DM Sans', monospace;
          margin-top: 2px;
        }

        .svc-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        .svc-card:hover .svc-icon-wrap { transform: scale(1.08) translateY(-2px); }

        .svc-title {
          font-size: 15px;
          font-weight: 700;
          margin: 0;
          line-height: 1.25;
          transition: color 0.25s;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: -0.01em;
        }

        .svc-underline {
          height: 1.5px;
          border-radius: 999px;
          transition: width 0.45s cubic-bezier(0.22,1,0.36,1);
          opacity: 0.6;
        }

        .svc-desc {
          font-size: 12.5px;
          line-height: 1.7;
          color: rgba(255,255,255,0.35);
          margin: 0;
          flex: 1;
        }

        .svc-cta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.06em;
          transition: opacity 0.3s;
          margin-top: 4px;
          cursor: pointer;
        }

        /* footer line */
        .svc-footer-line {
          height: 1px;
          max-width: 200px;
          margin: 72px auto 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.13), transparent);
        }
      `}</style>

      <section id="services">
        {/* Blobs */}
        <div className="svc-blob" style={{ left: '10%',  top: '5%',    width: 460, height: 460, background: 'hsl(200,70%,55%)' }} />
        <div className="svc-blob" style={{ right: '8%', bottom: '10%', width: 380, height: 380, background: 'hsl(280,60%,55%)', animationDelay: '-8s' }} />

        {/* Header */}
        <motion.div
          ref={ref}
          className="svc-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="svc-eyebrow">
            <div className="svc-eyebrow-line" />
            <span className="svc-eyebrow-label">What I Offer</span>
            <div className="svc-eyebrow-line" style={{ transform: 'scaleX(-1)' }} />
          </div>
          <h2 className="svc-heading">My Services</h2>
          <p className="svc-subtext">
            Everything you need to build, launch, and grow a digital product — done right.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="svc-grid">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} inView={inView} />
          ))}
        </div>

        {/* Footer divider */}
        <motion.div
          className="svc-footer-line"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'center' }}
        />
      </section>
    </>
  );
};

export default ServicesSection;