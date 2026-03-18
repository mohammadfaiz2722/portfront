// ─────────────────────────────────────────────────────────────
// HOW TO WIRE IT UP — App.js
// ─────────────────────────────────────────────────────────────
// 1. Copy ThemeContext.jsx and ThemeSwitcher.jsx into src/
// 2. For every section, you now have TWO versions:
//      OldHero.jsx      (your original)
//      Hero.jsx         (the new redesign)
//    Rename your originals to Old*.jsx
// 3. Replace your App.js with something like this:

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { ThemeProvider, useTheme } from './components/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcher';

// ── New world components (the redesigns)
import Navbar          from './components/Navbar';
import Hero            from './components/Hero';
import PhotoSection    from './components/PhotoSection';
import ProjectsShowcase from './components/ProjectShowcase';
import SkillsSection   from './components/SkillSection';
import ServicesSection from './components/SkillShowcase'
import ContactSection  from './components/ContactSection';
import CosmicProjectForm from './components/ProjectForm';
import PricingPage from './components/Pricing'
import ScrollToTop from './components/ScrollToTOp'

// ── Old world components (your originals, renamed)
import OldNavbar          from './components/oldNavbar';
import OldHero            from './components/oldHero';
import OldPhotoSection    from './components/oldPhotoSection';
import OldProjectsShowcase from './components/oldProjectShowcase';
import OldSkillsSection   from './components/oldSkillSection';
import OldServicesSection from './components/oldServiceSetion';
import OldContactSection  from './components/oldContactSection';
import OldPricingPage from './components/oldPricingPage';
import OldCosmicProjectForm from './components/oldProjectForm';
import BrickBreaker from './components/ShootingGame';


// ─────────────────────────────────────────
// The main page — swaps between worlds
// ─────────────────────────────────────────
const Layout = ({ children }) => {
  const { isNewWorld, splashDone } = useTheme();
 
  // In old world, hide navbar until splash finishes
  const showNavbar = isNewWorld || splashDone;
 
  return (
    <>
      {showNavbar && (isNewWorld ? <Navbar /> : <OldNavbar />)}
      {children}
    </>
  );
};
 
// ─────────────────────────────────────────
// Pages
// ─────────────────────────────────────────
const HomePage = () => {
  const { isNewWorld } = useTheme();
 
  return (
    <AnimatePresence mode="wait">
      {isNewWorld ? (
        <motion.div
          key="new-world"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Hero />
          <PhotoSection />
          <ProjectsShowcase />
          <SkillsSection />
          <ServicesSection />
          <ContactSection />
        </motion.div>
      ) : (
        <motion.div
          key="old-world"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <OldHero />
          <OldPhotoSection />
          <OldProjectsShowcase />
          <OldSkillsSection />
          <OldServicesSection />
          <OldContactSection />
          <BrickBreaker/>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
 
const PricingRoute = () => {
  const { isNewWorld } = useTheme();
  return isNewWorld ? <PricingPage /> : <OldPricingPage />;
};
 
const ProjectFormRoute = () => {
  const { isNewWorld } = useTheme();
  return isNewWorld ? <CosmicProjectForm /> : <OldCosmicProjectForm />;
};
 
// ─────────────────────────────────────────
// Root App
// ─────────────────────────────────────────
const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Routes>
 
          <Route path="/" element={
            <Layout><HomePage /></Layout>
          } />
 
          <Route path="/pricing" element={
            <Layout><PricingRoute /></Layout>
          } />
 
          <Route path="/projectform" element={
            <Layout><ProjectFormRoute /></Layout>
          } />
        
 
        </Routes>
 
        <ThemeSwitcher />
      </Router>
    </ThemeProvider>
  );
};
 
export default App;