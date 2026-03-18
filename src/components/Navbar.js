import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import TypingGame from './TypingGame';

const resume = '/FaizJOb.pdf';

const NAV_LINKS = [
  { label: 'Home',     type: 'router', to: '/' },
  { label: 'About',    type: 'scroll', to: 'about' },
  { label: 'Projects', type: 'scroll', to: 'projects' },
  { label: 'Skills',   type: 'scroll', to: 'skills' },
  { label: 'Pricing',  type: 'router', to: '/pricing' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [activeLink, setActiveLink] = useState('Home');
  const [hovered, setHovered]       = useState(null);
  const [gameOpen, setGameOpen]     = useState(false);
  const navRef                      = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuOpen && navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const close = (label) => {
    setMenuOpen(false);
    if (label) setActiveLink(label);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Italiana&display=swap');

        .nb-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          font-family: 'DM Sans', sans-serif;
          transition: padding 0.4s ease;
        }

        /* ── pill container ── */
        .nb-pill {
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.25rem;
          height: 60px;
          border-radius: 999px;
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
          position: relative;
          overflow: hidden;
        }
        .nb-pill.floating {
          max-width: 860px;
          margin-top: 16px;
          background: rgba(8,8,12,0.72);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: 0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .nb-pill.top {
          max-width: 100%;
          margin-top: 0;
          border-radius: 0;
          background: rgba(0,0,0,0);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          box-shadow: none;
          backdrop-filter: none;
        }

        /* shimmer line at top of pill */
        .nb-pill::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          border-radius: 999px;
          opacity: 0;
          transition: opacity 0.4s;
        }
        .nb-pill.floating::before { opacity: 1; }

        /* ── logo ── */
        .nb-logo {
          font-family: 'Italiana', serif;
          font-size: 22px;
          color: #fff;
          text-decoration: none;
          letter-spacing: 0.02em;
          white-space: nowrap;
          flex-shrink: 0;
          user-select: none;
          background: linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.55));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: opacity 0.2s;
        }
        .nb-logo:hover { opacity: 0.75; }
        .nb-logo span {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          display: block;
          margin-top: -4px;
          background: linear-gradient(90deg, #61DAFB88, #61DAFB44);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── desktop links ── */
        .nb-links {
          display: flex;
          align-items: center;
          gap: 2px;
          list-style: none;
          margin: 0; padding: 0;
        }
        @media (max-width: 767px) { .nb-links { display: none; } }

        .nb-link-item { position: relative; }

        .nb-link-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 7px 14px;
          border-radius: 999px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          position: relative;
          transition: color 0.25s;
          letter-spacing: 0.01em;
        }
        .nb-link-btn:hover,
        .nb-link-btn.active { color: #fff; }

        /* hover/active pill bg */
        .nb-link-bg {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: rgba(255,255,255,0.07);
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }
        .nb-link-btn:hover .nb-link-bg { opacity: 1; }
        .nb-link-btn.active .nb-link-bg {
          opacity: 1;
          background: rgba(97,218,251,0.1);
        }

        /* active dot */
        .nb-link-dot {
          position: absolute;
          bottom: 4px; left: 50%;
          transform: translateX(-50%);
          width: 3px; height: 3px;
          border-radius: 50%;
          background: #61DAFB;
          box-shadow: 0 0 6px #61DAFB;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .nb-link-btn.active .nb-link-dot { opacity: 1; }

        /* ── resume cta ── */
        .nb-resume {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 18px;
          border-radius: 999px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #000;
          background: #fff;
          text-decoration: none;
          transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
          box-shadow: 0 2px 16px rgba(255,255,255,0.15);
          flex-shrink: 0;
        }
        .nb-resume:hover {
          background: #e0f7ff;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(97,218,251,0.35);
        }
        .nb-resume:active { transform: translateY(0); }
        .nb-resume svg { transition: transform 0.25s; }
        .nb-resume:hover svg { transform: translateY(1px); }
        @media (max-width: 767px) { .nb-resume { display: none; } }

        /* ── hamburger ── */
        .nb-ham {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 38px; height: 38px;
          cursor: pointer;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 9px;
          transition: background 0.2s;
        }
        @media (max-width: 767px) { .nb-ham { display: flex; } }
        .nb-ham:hover { background: rgba(255,255,255,0.1); }
        .nb-ham span {
          display: block;
          height: 1.5px;
          background: rgba(255,255,255,0.8);
          border-radius: 2px;
          transform-origin: center;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.25s, width 0.3s;
        }
        .nb-ham span:nth-child(2) { width: 65%; align-self: flex-end; }
        .nb-ham.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .nb-ham.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nb-ham.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── mobile drawer ── */
        .nb-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 998;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .nb-drawer-overlay.open { opacity: 1; pointer-events: all; }

        .nb-drawer {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: min(300px, 85vw);
          z-index: 999;
          background: rgba(8,8,14,0.97);
          border-left: 1px solid rgba(255,255,255,0.07);
          box-shadow: -20px 0 60px rgba(0,0,0,0.6);
          display: flex;
          flex-direction: column;
          padding: 80px 28px 40px;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .nb-drawer.open { transform: translateX(0); }

        .nb-drawer-links {
          list-style: none;
          margin: 0; padding: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .nb-drawer-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 16px;
          border-radius: 12px;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          transition: color 0.2s, background 0.2s;
        }
        .nb-drawer-link:hover,
        .nb-drawer-link.active {
          color: #fff;
          background: rgba(255,255,255,0.05);
        }
        .nb-drawer-link.active { color: #61DAFB; }

        .nb-drawer-num {
          font-family: 'DM Sans', monospace;
          font-size: 10px;
          color: rgba(255,255,255,0.18);
          font-weight: 600;
          letter-spacing: 0.1em;
          min-width: 20px;
        }

        .nb-drawer-resume {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          margin-top: 20px;
          transition: background 0.2s, color 0.2s;
        }
        .nb-drawer-resume:hover {
          background: rgba(97,218,251,0.1);
          color: #61DAFB;
          border-color: rgba(97,218,251,0.25);
        }

        .nb-drawer-footer {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 11px;
          color: rgba(255,255,255,0.18);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      {/* Overlay for mobile */}
      <div
        className={`nb-drawer-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile drawer */}
      <div className={`nb-drawer ${menuOpen ? 'open' : ''}`}>
        <ul className="nb-drawer-links">
          {NAV_LINKS.map((link, i) => {
            const isActive = activeLink === link.label;
            const inner = (
              <>
                <span className="nb-drawer-num">0{i + 1}</span>
                {link.label}
              </>
            );
            return (
              <li key={link.label}>
                {link.type === 'router' ? (
                  <Link
                    to={link.to}
                    className={`nb-drawer-link ${isActive ? 'active' : ''}`}
                    onClick={() => close(link.label)}
                  >{inner}</Link>
                ) : (
                  <ScrollLink
                    to={link.to}
                    smooth duration={500}
                    className={`nb-drawer-link ${isActive ? 'active' : ''}`}
                    onClick={() => close(link.label)}
                  >{inner}</ScrollLink>
                )}
              </li>
            );
          })}
        </ul>
        <a
          href={resume}
          target="_blank"
          rel="noopener noreferrer"
          download="Faiz.pdf"
          className="nb-drawer-resume"
          onClick={() => setMenuOpen(false)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download Resume
        </a>
        <div className="nb-drawer-footer">Faiz's Creations © 2024</div>
      </div>

      {/* Main nav bar */}
      <nav className="nb-root" ref={navRef} style={{ padding: scrolled ? '0 16px' : '0 20px' }}>
        <div className={`nb-pill ${scrolled ? 'floating' : 'top'}`}>

          {/* Logo */}
          <span
            onClick={() => setGameOpen(true)}
            className="nb-logo"
            style={{ cursor: 'pointer' }}
            title="psst... click me 👀"
          >
            Faiz's Creations
            <span>Portfolio</span>
          </span>

          {/* Desktop links */}
          <ul className="nb-links">
            {NAV_LINKS.map((link) => {
              const isActive = activeLink === link.label;
              const cls = `nb-link-btn ${isActive ? 'active' : ''}`;
              const inner = (
                <>
                  <span className="nb-link-bg" />
                  {link.label}
                  <span className="nb-link-dot" />
                </>
              );
              return (
                <li key={link.label} className="nb-link-item">
                  {link.type === 'router' ? (
                    <Link to={link.to} className={cls} onClick={() => close(link.label)}>
                      {inner}
                    </Link>
                  ) : (
                    <ScrollLink
                      to={link.to}
                      smooth
                      duration={500}
                      className={cls}
                      onClick={() => close(link.label)}
                    >
                      {inner}
                    </ScrollLink>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Resume CTA + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a
              href={resume}
              target="_blank"
              rel="noopener noreferrer"
              download="Faiz.pdf"
              className="nb-resume"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Resume
            </a>

            <div
              className={`nb-ham ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              role="button"
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </div>
          </div>
        </div>
      </nav>
      <TypingGame open={gameOpen} onClose={() => setGameOpen(false)} />
    </>
  );
};

export default Navbar;