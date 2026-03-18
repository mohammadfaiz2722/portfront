import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

const pricingPlans = [
  {
    name: 'Starter',
    price: '10,000',
    period: '/ project',
    tagline: 'Perfect for landing pages & portfolios.',
    accent: '#a78bfa',
    glow: 'rgba(167,139,250,0.3)',
    badge: null,
    features: [
      { text: 'Frontend Development',         included: true },
      { text: 'Responsive Design',            included: true },
      { text: 'Testing Included',             included: true },
      { text: 'Backend / API',                included: false },
      { text: 'Hosting',                      included: false },
      { text: 'Maintenance',                  included: false },
    ],
  },
  {
    name: 'Enterprise',
    price: '25,000',
    period: '/ project',
    tagline: 'Full-stack apps ready to ship.',
    accent: '#61DAFB',
    glow: 'rgba(97,218,251,0.3)',
    badge: 'Most Popular',
    features: [
      { text: 'Frontend + Backend Dev',       included: true },
      { text: 'Responsive Design',            included: true },
      { text: 'Testing Included',             included: true },
      { text: 'Basic Web Hosting',            included: true },
      { text: 'Free Domain',                  included: false },
      { text: 'Maintenance (extra charges)',  included: false },
    ],
  },
  {
    name: 'Premium',
    price: '50,000',
    period: '/ project',
    tagline: 'Everything — done and dusted.',
    accent: '#fbbf24',
    glow: 'rgba(251,191,36,0.28)',
    badge: 'Best Value',
    features: [
      { text: 'Full Stack Development',       included: true },
      { text: 'Responsive Design',            included: true },
      { text: 'Testing Included',             included: true },
      { text: 'Premium Web Hosting',          included: true },
      { text: 'Free Domain',                  included: true },
      { text: '1 Year Free Maintenance',      included: true },
    ],
  },
];

/* ── Tilt card ── */
const PricingCard = ({ plan, index, inView }) => {
  const ref = useRef(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sX = useSpring(rotX, { stiffness: 150, damping: 22 });
  const sY = useSpring(rotY, { stiffness: 150, damping: 22 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    rotY.set(((e.clientX - rect.left - rect.width  / 2) / rect.width)  * 12);
    rotX.set(((rect.top  + rect.height / 2 - e.clientY) / rect.height) * 12);
  };
  const onLeave = () => { rotX.set(0); rotY.set(0); setHovered(false); };

  const isFeatured = plan.badge === 'Most Popular';

  return (
    <motion.div
      initial={{ opacity: 0, y: 56, scale: 0.93 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.72, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900, zIndex: isFeatured ? 2 : 1 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onMouseEnter={() => setHovered(true)}
        style={{ rotateX: sX, rotateY: sY, transformStyle: 'preserve-3d' }}
        className="pc-card"
        data-featured={isFeatured}
      >
        {/* Top accent bar */}
        <div className="pc-top-bar" style={{ background: plan.accent }} />

        {/* Hover glow */}
        <div
          className="pc-glow"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${plan.glow} 0%, transparent 65%)`,
            opacity: hovered ? 1 : isFeatured ? 0.4 : 0,
            transition: 'opacity 0.4s',
          }}
        />

        {/* Shine sweep */}
        <div className="pc-shine" />

        <div className="pc-body">
          {/* Badge */}
          {plan.badge && (
            <motion.div
              className="pc-badge"
              style={{ background: `${plan.accent}22`, borderColor: `${plan.accent}44`, color: plan.accent }}
              initial={{ opacity: 0, y: -8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.13 + 0.4, duration: 0.4 }}
            >
              <span className="pc-badge-dot" style={{ background: plan.accent, boxShadow: `0 0 6px ${plan.accent}` }} />
              {plan.badge}
            </motion.div>
          )}

          {/* Plan name */}
          <p className="pc-plan-name" style={{ color: plan.accent }}>{plan.name}</p>
          <p className="pc-tagline">{plan.tagline}</p>

          {/* Price */}
          <div className="pc-price-row">
            <span className="pc-currency">₹</span>
            <span className="pc-price">{plan.price}</span>
          </div>
          <p className="pc-period">{plan.period}</p>

          {/* Divider */}
          <div className="pc-divider" style={{ background: `linear-gradient(90deg, transparent, ${plan.accent}44, transparent)` }} />

          {/* Features */}
          <ul className="pc-features">
            {plan.features.map((f, i) => (
              <li key={i} className={`pc-feature ${f.included ? 'included' : 'excluded'}`}>
                <span className="pc-feature-icon" style={{ color: f.included ? plan.accent : 'rgba(255,255,255,0.15)' }}>
                  {f.included ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  )}
                </span>
                {f.text}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link to="/projectform" className="pc-cta" style={{
            background: hovered || isFeatured
              ? plan.accent
              : 'rgba(255,255,255,0.05)',
            color: hovered || isFeatured ? '#000' : 'rgba(255,255,255,0.5)',
            borderColor: hovered || isFeatured ? plan.accent : 'rgba(255,255,255,0.09)',
            boxShadow: hovered || isFeatured ? `0 8px 24px ${plan.glow}` : 'none',
            transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
          }}>
            Get Started
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Main ── */
const PricingPage = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=DM+Sans:wght@400;500;600;700&display=swap');

        #pricing {
          background: #000;
          padding: 120px 0 140px;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          font-family: 'DM Sans', sans-serif;
        }

        #pricing::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 90% 70% at 50% 50%, black, transparent);
          -webkit-mask-image: radial-gradient(ellipse 90% 70% at 50% 50%, black, transparent);
          pointer-events: none;
        }

        .pc-blob {
          position: absolute; border-radius: 50%;
          filter: blur(110px); pointer-events: none; opacity: 0.08;
          animation: pcBlobDrift 18s ease-in-out infinite alternate;
        }
        @keyframes pcBlobDrift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(30px,-30px) scale(1.08); }
        }

        /* header */
        .pc-header {
          text-align: center;
          margin-bottom: 72px;
          padding: 0 24px;
        }
        .pc-eyebrow {
          display: flex; align-items: center; justify-content: center; gap: 14px;
          margin-bottom: 20px;
        }
        .pc-eyebrow-line {
          height: 1px; width: 44px;
          background: linear-gradient(90deg, rgba(97,218,251,0.5), transparent);
        }
        .pc-eyebrow-label {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.35em; text-transform: uppercase;
          color: rgba(255,255,255,0.28);
        }
        .pc-heading {
          font-family: 'Italiana', serif;
          font-size: clamp(52px, 8vw, 90px);
          line-height: 0.92; margin: 0 0 18px;
          background: linear-gradient(145deg, #fff 40%, rgba(255,255,255,0.4));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .pc-subtext {
          font-size: 15px; color: rgba(255,255,255,0.3);
          max-width: 400px; margin: 0 auto; line-height: 1.75;
        }

        /* grid */
        .pc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1050px;
          margin: 0 auto;
          padding: 0 24px;
          align-items: center;
        }
        @media (max-width: 900px) { .pc-grid { grid-template-columns: 1fr; max-width: 440px; } }

        /* card */
        .pc-card {
          position: relative;
          border-radius: 22px;
          overflow: hidden;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 8px 40px rgba(0,0,0,0.45);
          transition: border-color 0.3s, box-shadow 0.3s;
          cursor: default;
        }
        .pc-card:hover,
        .pc-card[data-featured="true"] {
          border-color: rgba(255,255,255,0.14);
          box-shadow: 0 24px 64px rgba(0,0,0,0.6);
        }
        .pc-card[data-featured="true"] {
          transform: scale(1.04);
        }
        @media (max-width: 900px) {
          .pc-card[data-featured="true"] { transform: scale(1); }
        }

        .pc-top-bar {
          position: absolute; top: 0; left: 0; right: 0;
          height: 2px; z-index: 4; opacity: 0.8;
        }
        .pc-glow {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 0;
        }
        .pc-shine {
          position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 38%, rgba(255,255,255,0.04) 50%, transparent 62%);
          transform: translateX(-100%);
          pointer-events: none; z-index: 1;
        }
        .pc-card:hover .pc-shine {
          transform: translateX(200%);
          transition: transform 0.65s ease;
        }

        .pc-body {
          position: relative; z-index: 2;
          padding: 32px 28px 30px;
          display: flex; flex-direction: column; gap: 0;
        }
        @media (max-width: 480px) { .pc-body { padding: 28px 20px 24px; } }

        .pc-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 14px; border-radius: 999px;
          border: 1px solid; font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          width: fit-content; margin-bottom: 18px;
        }
        .pc-badge-dot {
          width: 5px; height: 5px; border-radius: 50%;
          animation: pcDotPulse 2s ease-in-out infinite;
        }
        @keyframes pcDotPulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.6); opacity: 0.4; }
        }

        .pc-plan-name {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.25em; text-transform: uppercase;
          margin: 0 0 6px;
        }
        .pc-tagline {
          font-size: 13px; color: rgba(255,255,255,0.3);
          margin: 0 0 24px; line-height: 1.5;
        }

        .pc-price-row {
          display: flex; align-items: flex-start; gap: 4px;
          margin-bottom: 4px;
        }
        .pc-currency {
          font-size: 22px; font-weight: 700; color: rgba(255,255,255,0.5);
          margin-top: 6px; line-height: 1;
        }
        .pc-price {
          font-family: 'Italiana', serif;
          font-size: clamp(44px, 6vw, 58px);
          color: #fff; line-height: 1;
          letter-spacing: -0.02em;
        }
        .pc-period {
          font-size: 12px; color: rgba(255,255,255,0.25);
          letter-spacing: 0.08em; margin: 0 0 24px;
        }

        .pc-divider {
          height: 1px; border-radius: 999px;
          margin-bottom: 22px;
        }

        .pc-features {
          list-style: none; margin: 0 0 28px; padding: 0;
          display: flex; flex-direction: column; gap: 11px;
        }
        .pc-feature {
          display: flex; align-items: center; gap: 11px;
          font-size: 13px; line-height: 1.4;
          transition: color 0.2s;
        }
        .pc-feature.included { color: rgba(255,255,255,0.65); }
        .pc-feature.excluded { color: rgba(255,255,255,0.2); text-decoration: line-through; text-decoration-color: rgba(255,255,255,0.1); }
        .pc-feature-icon {
          flex-shrink: 0; width: 18px; height: 18px;
          display: flex; align-items: center; justify-content: center;
        }

        .pc-cta {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px; border-radius: 14px;
          border: 1px solid;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
        }

        /* footer line */
        .pc-footer-line {
          height: 1px; max-width: 200px;
          margin: 72px auto 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
        }

        /* faq note */
        .pc-note {
          text-align: center; margin-top: 32px;
          font-size: 12px; color: rgba(255,255,255,0.18);
          letter-spacing: 0.06em;
        }
        .pc-note a { color: rgba(97,218,251,0.5); text-decoration: none; }
        .pc-note a:hover { color: #61DAFB; }
      `}</style>

      <section id="pricing">
        {/* Blobs */}
        <div className="pc-blob" style={{ left: '5%',  top: '10%', width: 450, height: 450, background: 'hsl(260,70%,55%)' }} />
        <div className="pc-blob" style={{ right: '5%', bottom: '10%', width: 380, height: 380, background: 'hsl(200,70%,55%)', animationDelay: '-8s' }} />

        {/* Header */}
        <motion.div
          ref={ref}
          className="pc-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pc-eyebrow">
            <div className="pc-eyebrow-line" />
            <span className="pc-eyebrow-label">Transparent Pricing</span>
            <div className="pc-eyebrow-line" style={{ transform: 'scaleX(-1)' }} />
          </div>
          <h2 className="pc-heading">Pricing Plans</h2>
          <p className="pc-subtext">
            No hidden fees. Pick the plan that fits your project and let's build something great.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="pc-grid">
          {pricingPlans.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} index={i} inView={inView} />
          ))}
        </div>

        {/* Note */}
        <motion.p
          className="pc-note"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          All prices are negotiable based on scope.{' '}
          <Link to="/projectform" style={{ color: 'rgba(97,218,251,0.5)', textDecoration: 'none' }}>
            Let's talk →
          </Link>
        </motion.p>

        {/* Footer line */}
        <motion.div
          className="pc-footer-line"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'center' }}
        />
      </section>
    </>
  );
};

export default PricingPage;