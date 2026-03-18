'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaReact, FaNodeJs, FaDatabase, FaHtml5, FaCss3Alt, FaJs } from 'react-icons/fa';
import { SiNextdotjs } from 'react-icons/si';

const skills = [
  { name: 'React',      icon: FaReact,    color: '#61DAFB', glow: 'rgba(97,218,251,0.4)',  angle: 0   },
  { name: 'Next.js',    icon: SiNextdotjs,color: '#ffffff', glow: 'rgba(255,255,255,0.25)', angle: 51  },
  { name: 'Node.js',    icon: FaNodeJs,   color: '#68A063', glow: 'rgba(104,160,99,0.4)',   angle: 102 },
  { name: 'JavaScript', icon: FaJs,       color: '#F7DF1E', glow: 'rgba(247,223,30,0.4)',   angle: 153 },
  { name: 'MongoDB',    icon: FaDatabase, color: '#4DB33D', glow: 'rgba(77,179,61,0.4)',    angle: 204 },
  { name: 'HTML5',      icon: FaHtml5,    color: '#E44D26', glow: 'rgba(228,77,38,0.4)',    angle: 255 },
  { name: 'CSS3',       icon: FaCss3Alt,  color: '#264DE4', glow: 'rgba(38,77,228,0.4)',    angle: 306 },
];

/* ── Tilt card ── */
const TiltCard = ({ skill, index, controls }) => {
  const cardRef = useRef(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springRotX = useSpring(rotX, { stiffness: 200, damping: 20 });
  const springRotY = useSpring(rotY, { stiffness: 200, damping: 20 });

  const handleMouse = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    rotY.set(((e.clientX - cx) / rect.width)  * 22);
    rotX.set(((cy - e.clientY) / rect.height) * 22);
  };
  const resetTilt = () => { rotX.set(0); rotY.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.85 }}
      animate={controls}
      variants={{ visible: { opacity: 1, y: 0, scale: 1 } }}
      transition={{ duration: 0.7, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      className="p-3"
      style={{ perspective: 800 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouse}
        onMouseLeave={resetTilt}
        style={{
          rotateX: springRotX,
          rotateY: springRotY,
          transformStyle: 'preserve-3d',
        }}
        whileTap={{ scale: 0.94 }}
        className="skill-card group relative cursor-pointer select-none"
      >
        {/* Glass surface */}
        <div
          className="skill-inner relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            border: `1px solid rgba(255,255,255,0.08)`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`,
            backdropFilter: 'blur(12px)',
            padding: '2rem 1.5rem',
          }}
        >
          {/* Glow blob on hover */}
          <div
            className="glow-blob absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${skill.glow} 0%, transparent 70%)`,
              filter: 'blur(8px)',
            }}
          />

          {/* Shine sweep */}
          <div className="shine-sweep absolute inset-0 rounded-2xl" />

          {/* Number badge */}
          <span
            className="absolute top-3 right-3 text-xs font-mono opacity-20 group-hover:opacity-50 transition-opacity"
            style={{ color: skill.color }}
          >
            0{index + 1}
          </span>

          {/* Icon */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div
              className="icon-wrap flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
              style={{
                width: 68,
                height: 68,
                background: `linear-gradient(145deg, rgba(255,255,255,0.05), rgba(0,0,0,0.2))`,
                boxShadow: `0 0 0 1px rgba(255,255,255,0.07), 0 4px 16px ${skill.glow}`,
              }}
            >
              <skill.icon
                style={{
                  color: skill.color,
                  fontSize: 34,
                  filter: `drop-shadow(0 0 8px ${skill.color}88)`,
                  transition: 'filter 0.3s',
                }}
                className="group-hover:drop-shadow-[0_0_14px_var(--glow)]"
              />
            </div>

            <p
              className="text-sm font-semibold tracking-widest uppercase"
              style={{
                color: 'rgba(255,255,255,0.55)',
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '0.15em',
                transition: 'color 0.3s',
              }}
            >
              <span
                className="group-hover:text-white transition-colors duration-300"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {skill.name}
              </span>
            </p>

            {/* Colored underline */}
            <div
              className="underline-bar h-0.5 w-0 group-hover:w-full rounded-full transition-all duration-500"
              style={{ background: `linear-gradient(90deg, transparent, ${skill.color}, transparent)` }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Main Section ── */
const SkillsSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const [orbs] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 300 + 200,
      hue: Math.random() * 60 + 200,
      dur: Math.random() * 14 + 10,
    }))
  );

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Italiana&display=swap');

        #skills {
          font-family: 'DM Sans', sans-serif;
        }

        .shine-sweep::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255,255,255,0.06) 50%,
            transparent 60%
          );
          transform: translateX(-100%);
          transition: transform 0s;
        }
        .skill-card:hover .shine-sweep::after {
          transform: translateX(200%);
          transition: transform 0.65s ease;
        }

        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.12;
          pointer-events: none;
          animation: orbDrift var(--dur) ease-in-out infinite alternate;
        }

        @keyframes orbDrift {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, -40px) scale(1.12); }
        }

        .grid-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent);
          pointer-events: none;
        }

        .section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        .heading-display {
          font-family: 'Italiana', serif;
          line-height: 1;
          background: linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.5) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .accent-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
        }

        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.1em;
          font-family: 'DM Sans', monospace;
        }
        .tag-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #61DAFB;
          box-shadow: 0 0 6px #61DAFB;
          animation: tagPulse 2s ease-in-out infinite;
        }
        @keyframes tagPulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0;
          max-width: 800px;
          margin: 0 auto;
        }

        @media (max-width: 640px) {
          .skills-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .heading-display { font-size: 56px !important; }
        }
      `}</style>

      <section
        className="relative overflow-hidden py-28 bg-black"
        id="skills"
      >
        {/* Subtle grid */}
        <div className="grid-lines" />

        {/* Ambient orbs */}
        {orbs.map((orb) => (
          <div
            key={orb.id}
            className="floating-orb"
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: orb.size,
              height: orb.size,
              background: `hsl(${orb.hue}, 60%, 55%)`,
              '--dur': `${orb.dur}s`,
            }}
          />
        ))}

        <div className="container relative z-10 mx-auto px-6 md:px-12">

          {/* Header */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="accent-line w-16" />
              <span className="section-label">Technical Arsenal</span>
              <div className="accent-line w-16" />
            </div>

            <h2
              className="heading-display mb-5"
              style={{ fontSize: 'clamp(52px, 8vw, 90px)' }}
            >
              My Skills
            </h2>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: 'rgba(255,255,255,0.35)',
                fontSize: 15,
                maxWidth: 380,
                margin: '0 auto 1.5rem',
                lineHeight: 1.7,
              }}
            >
              A curated set of tools I reach for to build fast, scalable, and beautiful products.
            </p>

            <div className="flex justify-center">
              <span className="tag-pill">
                <span className="tag-dot" />
                Available for work
              </span>
            </div>
          </motion.div>

          {/* Cards grid */}
          <div className="skills-grid">
            {skills.map((skill, i) => (
              <TiltCard
                key={skill.name}
                skill={skill}
                index={i}
                controls={controls}
              />
            ))}
          </div>

          {/* Bottom decorative line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={inView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="accent-line mt-20 max-w-sm mx-auto"
            style={{ transformOrigin: 'center' }}
          />
        </div>
      </section>
    </>
  );
};

export default SkillsSection;