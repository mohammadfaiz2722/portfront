import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaLinkedin, FaInstagram, FaGithub, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const socials = [
  {
    icon: FaLinkedin,
    label: 'LinkedIn',
    sub: 'Connect professionally',
    href: 'https://www.linkedin.com/in/your-linkedin-profile',
    accent: '#0A66C2',
    glow: 'rgba(10,102,194,0.35)',
    external: true,
  },
  {
    icon: FaInstagram,
    label: 'Instagram',
    sub: '@mohammadfaiz_27',
    href: 'https://www.instagram.com/mohammadfaiz_27/?igsh=MWE0ejdib2IzaDg5Zw%3D%3D',
    accent: '#E1306C',
    glow: 'rgba(225,48,108,0.35)',
    external: true,
  },
  {
    icon: FaGithub,
    label: 'GitHub',
    sub: 'mohammadfaiz2703',
    href: 'https://github.com/mohammadfaiz2703',
    accent: '#fff',
    glow: 'rgba(255,255,255,0.2)',
    external: true,
  },
  {
    icon: FaEnvelope,
    label: 'Email',
    sub: 'myyard789@gmail.com',
    href: 'mailto:myyard789@gmail.com',
    accent: '#61DAFB',
    glow: 'rgba(97,218,251,0.35)',
    external: false,
  },
];

/* ── Magnetic Social Card ── */
const SocialCard = ({ item, index, inView }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 20 });
  const sy = useSpring(y, { stiffness: 160, damping: 20 });
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRX = useSpring(rotX, { stiffness: 160, damping: 20 });
  const sRY = useSpring(rotY, { stiffness: 160, damping: 20 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    x.set((e.clientX - cx) * 0.18);
    y.set((e.clientY - cy) * 0.18);
    rotY.set(((e.clientX - cx) / rect.width)  * 14);
    rotX.set(((cy - e.clientY) / rect.height) * 14);
  };
  const onLeave = () => {
    x.set(0); y.set(0); rotX.set(0); rotY.set(0);
    setHovered(false);
  };

  const Tag = item.external ? 'a' : Link;
  const linkProps = item.external
    ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
    : { to: item.href };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ x: sx, y: sy, perspective: 800 }}
    >
      <Tag {...linkProps} style={{ textDecoration: 'none' }}>
        <motion.div
          ref={ref}
          className="social-card"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          onMouseEnter={() => setHovered(true)}
          style={{ rotateX: sRX, rotateY: sRY, transformStyle: 'preserve-3d' }}
        >
          {/* Top accent bar */}
          <div className="social-top-bar" style={{ background: item.accent, opacity: hovered ? 1 : 0.45 }} />

          {/* Glow */}
          <div
            className="social-glow"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${item.glow} 0%, transparent 70%)`, opacity: hovered ? 1 : 0 }}
          />

          {/* Shine */}
          <div className="social-shine" />

          <div className="social-body">
            <div
              className="social-icon-wrap"
              style={{
                color: item.accent,
                borderColor: hovered ? `${item.accent}55` : 'rgba(255,255,255,0.08)',
                boxShadow: hovered ? `0 0 20px ${item.glow}` : 'none',
              }}
            >
              <item.icon size={22} />
            </div>
            <p className="social-label">{item.label}</p>
            <p className="social-sub">{item.sub}</p>

            <div
              className="social-arrow"
              style={{ color: item.accent, opacity: hovered ? 1 : 0 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
              </svg>
            </div>
          </div>
        </motion.div>
      </Tag>
    </motion.div>
  );
};

/* ── Main ── */
const ContactSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const blobX = useSpring(useTransform(mouseX, [0, 1], [-20, 20]), { stiffness: 50, damping: 20 });
  const blobY = useSpring(useTransform(mouseY, [0, 1], [-15, 15]), { stiffness: 50, damping: 20 });

  const onMouseMove = (e) => {
    mouseX.set(e.clientX / window.innerWidth);
    mouseY.set(e.clientY / window.innerHeight);
  };

  const stagger = (i) => ({
    initial: { opacity: 0, y: 28 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.75, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=DM+Sans:wght@400;500;600;700&display=swap');

        #contact {
          background: #000;
          padding: 120px 0 140px;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          font-family: 'DM Sans', sans-serif;
        }

        #contact::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, black, transparent);
          -webkit-mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, black, transparent);
          pointer-events: none;
        }

        .ct-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          opacity: 0.09;
          animation: ctBlobDrift 18s ease-in-out infinite alternate;
        }
        @keyframes ctBlobDrift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(25px,-25px) scale(1.08); }
        }

        /* big decorative ring */
        .ct-ring {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 600px; height: 600px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.04);
          pointer-events: none;
        }
        .ct-ring-2 {
          width: 380px; height: 380px;
          border-color: rgba(97,218,251,0.05);
        }

        /* header */
        .ct-eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 20px;
        }
        .ct-eyebrow-line {
          height: 1px; width: 44px;
          background: linear-gradient(90deg, rgba(97,218,251,0.5), transparent);
        }
        .ct-eyebrow-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
        }
        .ct-heading {
          font-family: 'Italiana', serif;
          font-size: clamp(46px, 7vw, 84px);
          line-height: 1;
          margin: 0 0 6px;
          background: linear-gradient(145deg, #fff 40%, rgba(255,255,255,0.45));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.01em;
        }
        .ct-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.32);
          max-width: 420px;
          margin: 0 auto;
          line-height: 1.75;
        }

        /* divider */
        .ct-divider {
          height: 1px;
          width: 56px;
          background: linear-gradient(90deg, #61DAFB, rgba(150,80,255,0.5));
          border-radius: 999px;
          margin: 22px auto 0;
        }

        /* social cards grid */
        .ct-socials {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 14px;
          margin: 56px auto 0;
          max-width: 780px;
          padding: 0 24px;
        }

        .social-card {
          position: relative;
          width: 160px;
          border-radius: 18px;
          overflow: hidden;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          transition: border-color 0.3s, box-shadow 0.3s;
          cursor: pointer;
          text-decoration: none;
        }
        .social-card:hover {
          border-color: rgba(255,255,255,0.14);
          box-shadow: 0 20px 54px rgba(0,0,0,0.55);
        }
        .social-top-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          z-index: 4;
          transition: opacity 0.3s;
        }
        .social-glow {
          position: absolute; inset: 0;
          pointer-events: none;
          z-index: 0;
          transition: opacity 0.4s;
        }
        .social-shine {
          position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 38%, rgba(255,255,255,0.05) 50%, transparent 62%);
          transform: translateX(-100%);
          pointer-events: none;
          z-index: 1;
        }
        .social-card:hover .social-shine {
          transform: translateX(200%);
          transition: transform 0.65s ease;
        }
        .social-body {
          position: relative;
          z-index: 2;
          padding: 24px 18px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
        }
        .social-icon-wrap {
          width: 50px; height: 50px;
          border-radius: 14px;
          border: 1px solid;
          background: rgba(255,255,255,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: box-shadow 0.3s, border-color 0.3s, transform 0.3s;
          margin-bottom: 2px;
        }
        .social-card:hover .social-icon-wrap { transform: scale(1.1) translateY(-2px); }
        .social-label {
          font-size: 13.5px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .social-sub {
          font-size: 10.5px;
          color: rgba(255,255,255,0.28);
          margin: 0;
          letter-spacing: 0.02em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 120px;
        }
        .social-arrow {
          margin-top: 4px;
          transition: opacity 0.25s, transform 0.25s;
        }
        .social-card:hover .social-arrow { transform: translate(2px, -2px); }

        /* CTA buttons */
        .ct-ctas {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 52px;
          padding: 0 24px;
        }

        .ct-btn-primary {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 1.5px;
          border-radius: 999px;
          background: linear-gradient(135deg, #61DAFB, rgba(150,80,255,0.7));
          box-shadow: 0 0 24px rgba(97,218,251,0.2);
          transition: box-shadow 0.3s;
          text-decoration: none;
        }
        .ct-btn-primary:hover { box-shadow: 0 0 36px rgba(97,218,251,0.38); }
        .ct-btn-primary-inner {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 13px 30px;
          border-radius: 999px;
          background: #000;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: background 0.25s;
        }
        .ct-btn-primary:hover .ct-btn-primary-inner {
          background: rgba(0,0,0,0.8);
        }

        .ct-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 14px 30px;
          border-radius: 999px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          color: rgba(255,255,255,0.65);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.25s, color 0.25s, border-color 0.25s, transform 0.2s;
        }
        .ct-btn-secondary:hover {
          background: rgba(255,255,255,0.09);
          color: #fff;
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-1px);
        }

        /* footer */
        .ct-footer {
          margin-top: 80px;
          padding-top: 32px;
          border-top: 1px solid rgba(255,255,255,0.06);
          text-align: center;
          font-size: 12px;
          color: rgba(255,255,255,0.18);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          max-width: 1100px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 28px;
          padding-right: 28px;
        }
        .ct-footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .ct-footer-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #61DAFB;
          box-shadow: 0 0 6px #61DAFB;
          display: inline-block;
          margin: 0 8px;
          animation: ftDotPulse 2.5s ease-in-out infinite;
        }
        @keyframes ftDotPulse {
          0%,100% { opacity: 1; } 50% { opacity: 0.25; }
        }

        @media (max-width: 600px) {
          .social-card { width: 140px; }
          .ct-footer-inner { justify-content: center; }
        }
      `}</style>

      <section id="contact" onMouseMove={(e) => { mouseX.set(e.clientX / window.innerWidth); mouseY.set(e.clientY / window.innerHeight); }}>
        {/* Decorative rings */}
        <div className="ct-ring" />
        <div className="ct-ring ct-ring-2" />

        {/* Ambient blobs */}
        <motion.div className="ct-blob" style={{ left: '5%', top: '10%', width: 420, height: 420, background: 'hsl(200,70%,55%)', x: blobX, y: blobY }} />
        <motion.div className="ct-blob" style={{ right: '5%', bottom: '10%', width: 340, height: 340, background: 'hsl(280,60%,55%)', animationDelay: '-9s', x: blobX, y: blobY }} />

        <div ref={ref} style={{ position: 'relative', zIndex: 10 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', padding: '0 24px' }}>
            <motion.div {...stagger(0)}>
              <div className="ct-eyebrow">
                <div className="ct-eyebrow-line" />
                <span className="ct-eyebrow-label">Get In Touch</span>
                <div className="ct-eyebrow-line" style={{ transform: 'scaleX(-1)' }} />
              </div>
            </motion.div>

            <motion.div {...stagger(1)}>
              <h2 className="ct-heading">Let's Build Something</h2>
              <h2 className="ct-heading" style={{ color: 'rgba(255,255,255,0.35)', WebkitTextFillColor: 'rgba(255,255,255,0.2)' }}>
                Together.
              </h2>
            </motion.div>

            <motion.div {...stagger(2)}>
              <div className="ct-divider" />
            </motion.div>

            <motion.div {...stagger(3)}>
              <p className="ct-sub" style={{ marginTop: 22 }}>
                I'm always excited to take on new projects and collaborations.
                Reach out on any platform — I respond fast.
              </p>
            </motion.div>
          </div>

          {/* Social cards */}
          <div className="ct-socials">
            {socials.map((item, i) => (
              <SocialCard key={item.label} item={item} index={i} inView={inView} />
            ))}
          </div>

          {/* CTA buttons */}
          <motion.div
            className="ct-ctas"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/projectform" className="ct-btn-primary">
              <div className="ct-btn-primary-inner">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Discuss a Project
              </div>
            </Link>
            <a
              href="https://api.whatsapp.com/send?phone=6392569054&text=Hi%20Faiz%20I%20need%20more%20info%20about%20your%20project%20pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="ct-btn-secondary"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              WhatsApp Me
            </a>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="ct-footer"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
          >
            <div className="ct-footer-inner">
              <span>© 2024 Mohammad Faiz</span>
              <span>
                Built with
                <span className="ct-footer-dot" />
                React &amp; Framer Motion
              </span>
              <span>Ayodhya, India</span>
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
};

export default ContactSection;