// ThemeContext.jsx
// Drop this in your src/ folder and wrap your App with <ThemeProvider>

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isNewWorld, setIsNewWorld] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [rippleOrigin, setRippleOrigin] = useState({ x: '50%', y: '50%' });
  const [splashDone, setSplashDone] = useState(false);

  const switchTheme = useCallback((e) => {
    if (transitioning) return;

    // Capture click position for ripple origin
    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      setRippleOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }

    setTransitioning(true);
    setTimeout(() => {
      setIsNewWorld((prev) => {
        // if switching TO old world, reset splash so navbar hides again
        if (prev === true) setSplashDone(false);
        return !prev;
      });
    }, 420);
    setTimeout(() => setTransitioning(false), 1100);
  }, [transitioning]);

  return (
    <ThemeContext.Provider value={{ isNewWorld, switchTheme, transitioning, splashDone, setSplashDone }}>
      {children}

      {/* Ripple overlay */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            key="ripple"
            style={{
              position: 'fixed',
              zIndex: 9999,
              pointerEvents: 'none',
              borderRadius: '50%',
              background: isNewWorld
                ? 'radial-gradient(circle, #0a0a14 0%, #000 60%)'
                : 'radial-gradient(circle, rgba(97,218,251,0.15) 0%, #000 60%)',
              top: rippleOrigin.y,
              left: rippleOrigin.x,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: '250vmax', height: '250vmax', opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>
    </ThemeContext.Provider>
  );
};