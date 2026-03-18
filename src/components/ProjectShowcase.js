import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

const projects = [
  {
    name: 'CodeWardrobe',
    tagline: 'Code with Style, Dress with Pride.',
    description: 'A full-featured e-Commerce platform for developer-themed apparel with cart, auth, and payment flow.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    liveLink: 'https://example.com/project-one',
    sourceCodeLink: 'https://github.com/mohammadfaiz2722/CodeWardrobe',
    image: '/CodeWardrobe.jpg',
    accent: '#61DAFB',
    style: { objectFit: 'cover' },
  },
  {
    name: 'Real Estate Portfolio',
    tagline: 'Elegance in every listing.',
    description: 'A sleek portfolio site built for a real-estate company — fast, visual, and conversion-focused.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveLink: 'https://grandblue.omrox.in/#home',
    sourceCodeLink: 'https://github.com/mohammadfaiz2722',
    image: '/gb.png',
    accent: '#a78bfa',
    style: {},
  },
  {
    name: 'Portfolio',
    tagline: 'The cosmos of my journey.',
    description: 'A space-themed personal portfolio where innovation meets the infinite possibilities of the digital universe.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveLink: 'https://github.com/mohammadfaiz2722/portfolio_new',
    sourceCodeLink: 'https://github.com/mohammadfaiz2722/portfolio_new',
    image: '/port.png',
    accent: '#f59e0b',
    style: {},
  },
  {
    name: 'iNoteBook',
    tagline: 'Your secrets, locked tight.',
    description: 'A secure note-taking web app where your private thoughts stay private — encrypted and always accessible.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    liveLink: 'https://github.com/mohammadfaiz2722/iNoteBook',
    sourceCodeLink: 'https://github.com/mohammadfaiz2722/iNoteBook',
    image: '/inote.png',
    accent: '#34d399',
    style: {},
  },
  {
    name: 'FaizBook',
    tagline: 'Share thoughts, stay anonymous.',
    description: 'A minimal social media app where anyone can post their thoughts freely and anonymously.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    liveLink: 'https://github.com/mohammadfaiz2722/FaizBook',
    sourceCodeLink: 'https://github.com/mohammadfaiz2722/FaizBook',
    image: '/fbapp.png',
    accent: '#fb7185',
    style: {},
  },
  {
    name: 'Cosmic Vault',
    tagline: 'A universe of memories.',
    description: 'Your gateway to securely store and beautifully showcase digital treasures — photos, notes, and memories.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    liveLink: 'https://cosmicvaultfrontend.onrender.com/',
    sourceCodeLink: 'https://github.com/mohammadfaiz2722/CosmicVaultFrontEnd',
    image: '/cv.png',
    accent: '#818cf8',
    style: {},
  },
];

/* ── Tilt Project Card ── */
const ProjectCard = ({ project, index, inView }) => {
  const cardRef = useRef(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sX = useSpring(rotX, { stiffness: 180, damping: 22 });
  const sY = useSpring(rotY, { stiffness: 180, damping: 22 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    rotY.set(((e.clientX - cx) / rect.width)  * 12);
    rotX.set(((cy - e.clientY) / rect.height) * 12);
  };
  const onLeave = () => {
    rotX.set(0); rotY.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onMouseEnter={() => setHovered(true)}
        style={{
          rotateX: sX, rotateY: sY,
          transformStyle: 'preserve-3d',
        }}
        className="proj-card"
      >
        {/* Accent glow */}
        <div
          className="proj-glow"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${project.accent}22 0%, transparent 70%)`,
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Top accent bar */}
        <div className="proj-accent-bar" style={{ background: project.accent }} />

        {/* Image */}
        <div className="proj-img-wrap">
          <img
            src={project.image}
            alt={project.name}
            className="proj-img"
            style={project.style}
          />
          <div className="proj-img-overlay" style={{ background: `linear-gradient(to bottom, transparent 40%, #0a0a0f 100%)` }} />

          {/* Index number watermark */}
          <span className="proj-index-num">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Body */}
        <div className="proj-body">
          <div className="proj-name-row">
            <div>
              <h3 className="proj-name">{project.name}</h3>
              <p className="proj-tagline" style={{ color: project.accent }}>{project.tagline}</p>
            </div>
          </div>

          <p className="proj-desc">{project.description}</p>

          {/* Tech chips */}
          <div className="proj-chips">
            {project.technologies.map((t) => (
              <span key={t} className="proj-chip" style={{ borderColor: `${project.accent}33`, color: project.accent }}>
                {t}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="proj-links">
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="proj-link-btn proj-link-primary"
              style={{ background: project.accent, color: '#000' }}
            >
              <FaExternalLinkAlt size={11} />
              Live Demo
            </a>
            <a
              href={project.sourceCodeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="proj-link-btn proj-link-ghost"
            >
              <FaGithub size={13} />
              Source
            </a>
          </div>
        </div>

        {/* Bottom shine */}
        <div className="proj-shine" />
      </motion.div>
    </motion.div>
  );
};

/* ── Main ── */
const ProjectsShowcase = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=DM+Sans:wght@400;500;600;700&display=swap');

        #projects {
          background: #000;
          padding: 120px 0 140px;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          font-family: 'DM Sans', sans-serif;
        }

        #projects::before {
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

        /* ambient blobs */
        .proj-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          opacity: 0.09;
          animation: projBlobDrift 16s ease-in-out infinite alternate;
        }
        @keyframes projBlobDrift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(40px,-40px) scale(1.1); }
        }

        /* section header */
        .proj-section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          font-family: 'DM Sans', sans-serif;
        }
        .proj-header-line {
          height: 1px;
          width: 48px;
          background: linear-gradient(90deg, rgba(97,218,251,0.55), transparent);
        }
        .proj-heading {
          font-family: 'Italiana', serif;
          font-size: clamp(52px, 8vw, 90px);
          line-height: 0.92;
          margin: 0;
          background: linear-gradient(145deg, #fff 40%, rgba(255,255,255,0.45));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .proj-subtext {
          font-size: 15px;
          color: rgba(255,255,255,0.32);
          max-width: 400px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* grid */
        .proj-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }
        @media (max-width: 1024px) { .proj-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px)  { .proj-grid { grid-template-columns: 1fr; } }

        /* card */
        .proj-card {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 8px 40px rgba(0,0,0,0.45);
          transition: border-color 0.3s, box-shadow 0.3s;
          cursor: pointer;
        }
        .proj-card:hover {
          border-color: rgba(255,255,255,0.14);
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        }

        .proj-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          transition: opacity 0.4s;
          z-index: 0;
        }

        .proj-accent-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          z-index: 5;
          opacity: 0.7;
        }

        .proj-img-wrap {
          position: relative;
          width: 100%;
          height: 190px;
          overflow: hidden;
        }
        .proj-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), filter 0.4s;
          filter: saturate(0.85);
        }
        .proj-card:hover .proj-img {
          transform: scale(1.06);
          filter: saturate(1.05);
        }
        .proj-img-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .proj-index-num {
          position: absolute;
          top: 10px;
          right: 12px;
          font-family: 'DM Sans', monospace;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.1em;
          z-index: 3;
        }

        .proj-body {
          padding: 20px 22px 22px;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .proj-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          line-height: 1.2;
        }
        .proj-tagline {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.06em;
          margin: 2px 0 0;
          opacity: 0.8;
          font-style: italic;
        }
        .proj-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.38);
          line-height: 1.65;
          margin: 0;
        }

        .proj-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .proj-chip {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid;
          background: rgba(255,255,255,0.03);
        }

        .proj-links {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }
        .proj-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        }
        .proj-link-btn:hover { transform: translateY(-1px); opacity: 0.88; }
        .proj-link-primary {
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        .proj-link-ghost {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
        }
        .proj-link-ghost:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }

        .proj-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            transparent 40%,
            rgba(255,255,255,0.03) 50%,
            transparent 60%
          );
          transform: translateX(-100%);
          pointer-events: none;
          z-index: 1;
        }
        .proj-card:hover .proj-shine {
          transform: translateX(200%);
          transition: transform 0.7s ease;
        }

        /* header wrapper */
        .proj-header-wrap {
          text-align: center;
          margin-bottom: 64px;
          padding: 0 24px;
        }
        .proj-header-eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 20px;
        }
      `}</style>

      {/* Blobs */}
      <div className="proj-blob" style={{ left: '0%',  top: '0%',   width: 500, height: 500, background: 'hsl(210,70%,55%)' }} />
      <div className="proj-blob" style={{ right: '0%', bottom: '0%', width: 400, height: 400, background: 'hsl(270,60%,55%)', animationDelay: '-7s' }} />

      <section id="projects" ref={ref}>
        {/* Header */}
        <motion.div
          className="proj-header-wrap"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="proj-header-eyebrow">
            <div className="proj-header-line" />
            <span className="proj-section-label">Selected Work</span>
            <div className="proj-header-line" style={{ transform: 'scaleX(-1)' }} />
          </div>
          <h2 className="proj-heading">My Projects</h2>
          <p className="proj-subtext" style={{ marginTop: 16 }}>
            A collection of things I've built — from full-stack apps to polished front-end experiences.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="proj-grid">
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} inView={inView} />
          ))}
        </div>

        {/* Footer line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: 1,
            maxWidth: 200,
            margin: '72px auto 0',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            transformOrigin: 'center',
          }}
        />
      </section>
    </>
  );
};

export default ProjectsShowcase;