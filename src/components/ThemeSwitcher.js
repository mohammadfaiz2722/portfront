// ThemeSwitcher.jsx
// Drop this anywhere in your layout — it floats fixed on screen.
// It reads from ThemeContext and triggers the ripple transition.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';

const ThemeSwitcher = () => {
  const { isNewWorld, switchTheme, transitioning } = useTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700&display=swap');

        .ts-wrap {
          position: fixed;
          bottom: 32px;
          right: 28px;
          z-index: 9000;
          font-family: 'DM Sans', sans-serif;
        }

        /* Tooltip */
        .ts-tooltip {
          position: absolute;
          bottom: calc(100% + 12px);
          right: 0;
          white-space: nowrap;
          background: rgba(10,10,20,0.92);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          pointer-events: none;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .ts-tooltip strong {
          color: #fff;
          font-weight: 700;
        }
        .ts-tooltip::after {
          content: '';
          position: absolute;
          top: 100%; right: 22px;
          border: 6px solid transparent;
          border-top-color: rgba(255,255,255,0.08);
        }

        /* Main pill button */
        .ts-btn-outer {
          position: relative;
          display: flex;
          align-items: center;
          border-radius: 999px;
          padding: 1.5px;
          cursor: pointer;
          border: none;
          background: none;
          outline: none;
          transition: transform 0.2s;
        }
        .ts-btn-outer:hover { transform: translateY(-2px); }
        .ts-btn-outer:active { transform: scale(0.97); }
        .ts-btn-outer:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .ts-gradient-ring {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          transition: opacity 0.4s;
        }

        .ts-btn-inner {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 22px;
          border-radius: 999px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #fff;
          transition: background 0.4s;
          z-index: 1;
          overflow: hidden;
          white-space: nowrap;
        }

        /* Liquid fill animation on the inner background */
        .ts-btn-fill {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
          transform-origin: left center;
        }

        .ts-icon-wrap {
          position: relative;
          width: 22px; height: 22px;
          flex-shrink: 0;
        }
        .ts-icon {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Pulsing ring */
        .ts-pulse-ring {
          position: absolute;
          inset: -6px;
          border-radius: 999px;
          border: 1.5px solid currentColor;
          animation: tsPulse 2.5s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes tsPulse {
          0%   { transform: scale(1);    opacity: 0.4; }
          50%  { transform: scale(1.12); opacity: 0; }
          100% { transform: scale(1);    opacity: 0; }
        }

        /* Particle burst on click */
        .ts-particle {
          position: absolute;
          width: 5px; height: 5px;
          border-radius: 50%;
          pointer-events: none;
        }
        @keyframes tsBurst {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: var(--tx) scale(0); opacity: 0; }
        }
      `}</style>

      <div className="ts-wrap">
        {/* Tooltip */}
        <AnimatePresence>
          {hovered && !transitioning && (
            <motion.div
              className="ts-tooltip"
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {isNewWorld
                ? <>Switch back to <strong>Classic</strong> view</>
                : <>Enter the <strong>New World</strong> ✦</>
              }
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button */}
        <motion.button
          className="ts-btn-outer"
          onClick={switchTheme}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          disabled={transitioning}
          whileTap={{ scale: 0.95 }}
          style={{
            boxShadow: isNewWorld
              ? '0 8px 32px rgba(97,218,251,0.25), 0 0 0 1px rgba(97,218,251,0.2)'
              : '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
          }}
        >
          {/* Gradient ring */}
          <div
            className="ts-gradient-ring"
            style={{
              background: isNewWorld
                ? 'linear-gradient(135deg, #61DAFB, rgba(150,80,255,0.8))'
                : 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
            }}
          />

          <div
            className="ts-btn-inner"
            style={{
              background: isNewWorld ? 'rgba(0,0,0,0.85)' : 'rgba(10,10,18,0.95)',
            }}
          >
            {/* Animated icon */}
            <div className="ts-icon-wrap">
              <AnimatePresence mode="wait">
                {isNewWorld ? (
                  <motion.div
                    key="classic"
                    className="ts-icon"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Rewind / classic icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3.62"/>
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    key="new"
                    className="ts-icon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Sparkle / new world icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Label */}
            <AnimatePresence mode="wait">
              {isNewWorld ? (
                <motion.span
                  key="classic-label"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  Classic View
                </motion.span>
              ) : (
                <motion.span
                  key="new-label"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: 'linear-gradient(90deg, #61DAFB, #a78bfa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  New World ✦
                </motion.span>
              )}
            </AnimatePresence>

            {/* Pulse ring (only in classic mode to entice clicks) */}
            {!isNewWorld && (
              <div className="ts-pulse-ring" style={{ color: '#61DAFB' }} />
            )}
          </div>
        </motion.button>
      </div>
    </>
  );
};

export default ThemeSwitcher;