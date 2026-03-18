// ScrollToTop.jsx
// Drop this in src/ and place <ScrollToTop /> inside your <Router> in App.js
// It automatically scrolls to the top whenever the route changes.

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;