import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import './Navbar.css';

const resume = '/faizreal.pdf';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="nav">
             {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="particle absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            backgroundColor: `hsl(${Math.random() * 360}, 50%, 50%)`,
            animation: `float ${Math.random() * 10 + 5}s linear infinite, pulse ${Math.random() * 2 + 1}s ease-in-out infinite alternate`
          }}
        />
      ))}
      <div className="gradient-bg"></div>
      <div className="logo" id="faizCreation">
        Faiz's Creations
      </div>
      <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={`menu ${menuOpen ? 'open' : ''}`}>
        <li ><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><ScrollLink to="about" smooth={true} duration={500} onClick={() => setMenuOpen(false)}>About</ScrollLink></li>
        <li><ScrollLink to="projects" smooth={true} duration={500} onClick={() => setMenuOpen(false)}>Projects</ScrollLink></li>
        <li><ScrollLink to="skills" smooth={true} duration={500} onClick={() => setMenuOpen(false)}>Skills</ScrollLink></li>
        <li><Link to="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link></li>
        <li><a href={resume} target='_blank' rel="noopener noreferrer" download="Faiz.pdf">Resume</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;